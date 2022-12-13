import Member from "./member";
import TreeNode from "./treeNode";
import TreeNodeMarriage from "./treeNodeMarriage";
import SeederOptions from "./seederOptions";

let dTreeSeeder = {
    _generationLimit: 100,
    _getWithParentIds: function (data: Member[], id: number | null): Member {
        const member = data.find((member) => member.id === id);

        if (member === undefined) {
            throw new Error(`Member with id (${id}) was not found`);
        }
        return member;
    },
    _getWithoutParentIds: function (data: Member[], id: number | null): Member {
        let member = this._getWithParentIds(data, id);

        member.parent1Id = null;
        member.parent2Id = null;
        return member;
    },
    _get: function (data: Member[], ids: number[], options: { preserveParentIds: boolean }): Member[] {
        const members = new Array<Member>();
        ids.forEach(id => {
            const member = (options.preserveParentIds)
                ? this._getWithParentIds(data, id)
                : this._getWithoutParentIds(data, id);
            members.push(member);
        });
        return members;
    },
    _getChildren: function (data: Member[], ...parents: Member[]): Member[] {
        const childIds = data.filter((member) =>
            parents.some((parent) => parent.id === member.parent1Id || parent.id === member.parent2Id))
            .map((member) => member.id);

        if (childIds.length === 0) {
            return [];
        }
        const children = this._get(data, childIds, { preserveParentIds: true });

        const parentDepthOffset = parents.find((parent) => parent.depthOffset !== undefined)?.depthOffset;
        if (parentDepthOffset !== undefined) {
            children.forEach((child) => child.depthOffset = parentDepthOffset + 1);
        }
        return children;
    },
    _getOtherParents: function (data: Member[], children: Member[], ...parents: Member[]): Member[] {
        const parentIds = parents.map((parent) => parent.id);
        const otherParentIds = children.map((child) =>
            parentIds.includes(child.parent1Id as number)
                ? child.parent2Id
                : child.parent1Id);

        // remove duplicates when siblings have common parent
        const uniqueOtherParentIds = otherParentIds.filter((value, index) =>
            index === otherParentIds.indexOf(value));

        // remove parentIds so their ancestors aren't included
        const otherParents = this._get(data, uniqueOtherParentIds as number[], { preserveParentIds: false });

        const parentDepthOffset = parents.find((parent) => parent.depthOffset !== undefined)?.depthOffset;
        if (parentDepthOffset !== undefined) {
            otherParents.forEach((otherParent) => otherParent.depthOffset = parentDepthOffset);
        }
        return otherParents;
    },
    _getRelatives: function (data: Member[], targetId?: number): Member[] {
        if (data.length === 0) {
            throw new Error("Data cannot be empty");
        }

        if (targetId === undefined) {
            throw new Error("TargetId cannot be undefined");
        }

        // start at 1, as specificed by dTree
        const depthOffsetStart = 1;
        const members = new Array<Member>();

        const target = this._getWithParentIds(data, targetId);

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
            const parents = this._get(data, parentIds, { preserveParentIds: false });
            parents.forEach((parent) => parent.depthOffset = depthOffsetStart);
            members.push(...parents);

            const siblingIds = data.filter((member) =>
                ((member.parent1Id === target.parent1Id || member.parent2Id === target.parent2Id)
                    || (member.parent1Id === target.parent2Id || member.parent2Id === target.parent1Id))
                && member.id !== target.id).map((member) => member.id);
            const siblings = this._get(data, siblingIds, { preserveParentIds: true });
            siblings.forEach((sibling) => sibling.depthOffset = depthOffsetStart + 1);
            members.push(...siblings);
        }
        members.push(target);

        const children = this._getChildren(data, target);
        members.push(...children);

        if (children.length === 0) {
            return members;
        }

        const otherParents = this._getOtherParents(data, children, target);
        members.push(...otherParents);

        let nextGeneration = children;
        do {
            const nextGenerationChildren = this._getChildren(data, ...nextGeneration);
            members.push(...nextGenerationChildren);

            const nextGenerationOtherParents = this._getOtherParents(data, nextGenerationChildren, ...nextGeneration);
            members.push(...nextGenerationOtherParents);

            nextGeneration = nextGenerationChildren;
        } while (nextGeneration.length > 0);

        return members;
    },
    _combineIntoMarriages: function (data: Member[], options?: SeederOptions): TreeNode[] {
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
            const node = new TreeNode(this._getWithParentIds(data, nodeId), options);

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
                    marriage.spouse = new TreeNode(this._getWithParentIds(data, spouseId), options);
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
    },
    _coalesce: function (data: TreeNode[]): TreeNode[] {
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

            if (count > this._generationLimit) {
                throw new Error(`Data contains multiple roots or spans more than ${this._generationLimit} generations.`);
            }
        }
        return data;
    },
    seed: function (data: Member[], targetId?: number, options?: SeederOptions): string {
        const members = this._getRelatives(data, targetId);
        const marriages = this._combineIntoMarriages(members, options);
        const rootNode = this._coalesce(marriages);
        return JSON.stringify(rootNode);
    }
};

export default dTreeSeeder;