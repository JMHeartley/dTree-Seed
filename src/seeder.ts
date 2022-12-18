/// <reference path="member.ts" />
/// <reference path="treeNode.ts" />
/// <reference path="treeNodeMarriage.ts" />
/// <reference path="seederOptions.ts" />

namespace dSeeder {
    let _generationLimit = 100;
    function _getWithParentIds(data: Member[], id: number | null): Member {
        const member = data.find((member) => member.id === id);

        if (member === undefined) {
            throw new Error(`Member with id (${id}) was not found`);
        }
        return member;
    }
    function _getWithoutParentIds(data: Member[], id: number | null): Member {
        let member = _getWithParentIds(data, id);

        member.parent1Id = null;
        member.parent2Id = null;
        return member;
    }
    function _get(data: Member[], ids: number[], options: { preserveParentIds: boolean }): Member[] {
        const members = new Array<Member>();
        ids.forEach(id => {
            const member = (options.preserveParentIds)
                ? _getWithParentIds(data, id)
                : _getWithoutParentIds(data, id);
            members.push(member);
        });
        return members;
    }
    function _getChildren(data: Member[], ...parents: Member[]): Member[] {
        const childIds = data.filter((member) =>
            parents.some((parent) => parent.id === member.parent1Id || parent.id === member.parent2Id))
            .map((member) => member.id);

        if (childIds.length === 0) {
            return [];
        }
        const children = _get(data, childIds, { preserveParentIds: true });

        const parentDepthOffset = parents.find((parent) => parent.depthOffset !== undefined)?.depthOffset;
        if (parentDepthOffset !== undefined) {
            children.forEach((child) => child.depthOffset = parentDepthOffset + 1);
        }
        return children;
    }
    function _getOtherParents(data: Member[], children: Member[], ...parents: Member[]): Member[] {
        const parentIds = parents.map((parent) => parent.id);
        const otherParentIds = children.map((child) =>
            parentIds.includes(child.parent1Id as number)
                ? child.parent2Id
                : child.parent1Id);

        // remove duplicates when siblings have common parent
        const uniqueOtherParentIds = otherParentIds.filter((value, index) =>
            index === otherParentIds.indexOf(value));

        // remove parentIds so their ancestors aren't included
        const otherParents = _get(data, uniqueOtherParentIds as number[], { preserveParentIds: false });

        const parentDepthOffset = parents.find((parent) => parent.depthOffset !== undefined)?.depthOffset;
        if (parentDepthOffset !== undefined) {
            otherParents.forEach((otherParent) => otherParent.depthOffset = parentDepthOffset);
        }
        return otherParents;
    }
    function _getRelatives(data: Member[], targetId?: number): Member[] {
        if (data.length === 0) {
            throw new Error("Data cannot be empty");
        }

        if (targetId === undefined) {
            throw new Error("TargetId cannot be undefined");
        }

        // start at 1, as specificed by dTree
        const depthOffsetStart = 1;
        const members = new Array<Member>();

        const target = _getWithParentIds(data, targetId);

        const hasParent1 = target.parent1Id !== null;
        const hasParent2 = target.parent2Id !== null;
        if (!hasParent1 && !hasParent2) {
            target.depthOffset = depthOffsetStart;
        }
        else {
            target.depthOffset = depthOffsetStart + 1;

            const parentIds = new Array<number>();
            if (hasParent1) {
                parentIds.push(target.parent1Id as number);
            }
            if (hasParent2) {
                parentIds.push(target.parent2Id as number);
            }
            // remove parentIds so their ancestors aren't included
            const parents = _get(data, parentIds, { preserveParentIds: false });
            parents.forEach((parent) => parent.depthOffset = depthOffsetStart);
            members.push(...parents);

            const siblingIds = data.filter((member) =>
                ((member.parent1Id === target.parent1Id || member.parent2Id === target.parent2Id)
                    || (member.parent1Id === target.parent2Id || member.parent2Id === target.parent1Id))
                && member.id !== target.id).map((member) => member.id);
            const siblings = _get(data, siblingIds, { preserveParentIds: true });
            siblings.forEach((sibling) => sibling.depthOffset = depthOffsetStart + 1);
            members.push(...siblings);
        }
        members.push(target);

        const children = _getChildren(data, target);
        members.push(...children);

        if (children.length === 0) {
            return members;
        }

        const otherParents = _getOtherParents(data, children, target);
        members.push(...otherParents);

        let nextGeneration = children;
        do {
            const nextGenerationChildren = _getChildren(data, ...nextGeneration);
            members.push(...nextGenerationChildren);

            const nextGenerationOtherParents = _getOtherParents(data, nextGenerationChildren, ...nextGeneration);
            members.push(...nextGenerationOtherParents);

            nextGeneration = nextGenerationChildren;
        } while (nextGeneration.length > 0);

        return members;
    }
    function _combineIntoMarriages(data: Member[], options?: SeederOptions): TreeNode[] {
        if (data.length === 1) {
            return data.map((member) => new TreeNode(member));
        }

        let parentGroups = data.map((member) => {
            return [member.parent1Id, member.parent2Id].filter((id) => id !== null);
        }).filter((group) => group.length > 0);

        parentGroups = [...new Set(parentGroups
            // sort and stringify for comparison without iterating over each element
            .map((group) => JSON.stringify(group.sort())))]
            // parse elements back into objects
            .map((group) => JSON.parse(group));

        if (parentGroups.length === 0) {
            throw new Error("At least one member must have at least one parent");
        }

        const treeNodes = new Array<TreeNode>();
        parentGroups.forEach((currentParentGroup) => {
            const nodeId = currentParentGroup[0];
            const node = new TreeNode(_getWithParentIds(data, nodeId), options);

            const nodeMarriages = parentGroups.filter((group) => group.includes(nodeId));
            nodeMarriages.forEach((marriedCouple) => {

                // remove marriage to prevent interating on it twice, 
                //    except if it's currently being iterated by the outer forEach 
                //       removing that would cause the next one to replaced as current and be skipped
                const index = parentGroups.indexOf(marriedCouple);
                if (index !== parentGroups.indexOf(currentParentGroup)) {
                    parentGroups.splice(index, 1);
                }

                const marriage = new TreeNodeMarriage();

                const spouseId = marriedCouple[1];
                if (spouseId !== undefined) {
                    marriage.spouse = new TreeNode(_getWithParentIds(data, spouseId), options);
                }

                marriage.children = data.filter((member) => {
                    if (member.parent1Id !== null && member.parent2Id !== null) {
                        return marriedCouple.includes(member.parent1Id as number)
                            && marriedCouple.includes(member.parent2Id as number);
                    }
                    if (member.parent1Id !== null && member.parent2Id === null) {
                        return marriedCouple.includes(member.parent1Id as number)
                            && member.parent2Id === null;
                    }
                    if (member.parent1Id === null && member.parent2Id !== null) {
                        return marriedCouple.includes(member.parent2Id as number)
                            && member.parent1Id === null;
                    }
                    return false;
                }).map((child) => new TreeNode(child, options));

                node.marriages.push(marriage);
            });

            treeNodes.push(node);
        });

        return treeNodes;
    }
    function _coalesce(data: TreeNode[]): TreeNode[] {
        if (data.length === 0) {
            throw new Error("Data cannot be empty");
        }

        if (data.length === 1) {
            return data;
        }

        let count = 0;
        while (data.length > 1) {
            for (let index = 0; index < data.length; index++) {
                const node = data[index];
                const otherNodes = data.filter((otherNode) => otherNode !== node);

                if (otherNodes.some(otherNode => otherNode.canInsertAsDescendant(node))) {
                    data.splice(index, 1);
                }
            }
            count++;

            if (count > _generationLimit) {
                throw new Error(`Data contains multiple roots or spans more than ${_generationLimit} generations.`);
            }
        }
        return data;
    }
    export function seed(data: Member[], targetId: number, options?: SeederOptions): TreeNode[] {
        const members = _getRelatives(data, targetId);
        const marriages = _combineIntoMarriages(members, options);
        const rootNode = _coalesce(marriages);
        return rootNode;
    }
    export const _private = {
        _getRelatives,
        _combineIntoMarriages,
        _coalesce
    };
}