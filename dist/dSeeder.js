"use strict";
var dSeeder;
(function (dSeeder) {
    class TreeNode {
        constructor(member, options) {
            var _a, _b, _c, _d, _e, _f, _g;
            this.id = member.id;
            this.name = member.name;
            this.class = (_b = (_a = options === null || options === void 0 ? void 0 : options.class) === null || _a === void 0 ? void 0 : _a.call(options, member)) !== null && _b !== void 0 ? _b : "";
            this.textClass = (_d = (_c = options === null || options === void 0 ? void 0 : options.textClass) === null || _c === void 0 ? void 0 : _c.call(options, member)) !== null && _d !== void 0 ? _d : "";
            this.depthOffset = (_e = member.depthOffset) !== null && _e !== void 0 ? _e : -1;
            this.marriages = new Array();
            this.extra = (_g = (_f = options === null || options === void 0 ? void 0 : options.extra) === null || _f === void 0 ? void 0 : _f.call(options, member)) !== null && _g !== void 0 ? _g : {};
        }
        canInsertAsDescendant(descendent) {
            var _a;
            if (this.id === descendent.id) {
                return false;
            }
            for (let index = 0; index < this.marriages.length; index++) {
                const marriage = this.marriages[index];
                if (((_a = marriage.spouse) === null || _a === void 0 ? void 0 : _a.id) === descendent.id) {
                    return false;
                }
                if (marriage.children.map(child => child.id).includes(descendent.id)) {
                    this._overwriteChild(marriage, descendent);
                    return true;
                }
                if (this._canInsertAsDescendantByPivotingOnAMarriage(marriage, descendent)) {
                    return true;
                }
                if (marriage.children.some((child) => child.canInsertAsDescendant(descendent))) {
                    return true;
                }
            }
            return false;
        }
        _overwriteChild(marriage, newChild) {
            const index = marriage.children.findIndex(child => child.id === newChild.id);
            marriage.children.splice(index, 1, newChild);
        }
        _canInsertAsDescendantByPivotingOnAMarriage(marriage, descendent) {
            if (marriage.spouse === undefined) {
                return false;
            }
            const childIds = marriage.children.map(child => child.id);
            if (!descendent.marriages.map(m => { var _a; return (_a = m.spouse) === null || _a === void 0 ? void 0 : _a.id; })
                .some(id => childIds.includes(id))) {
                return false;
            }
            const marriageToPivotOn = descendent.marriages.find(m => { var _a; return childIds.includes((_a = m.spouse) === null || _a === void 0 ? void 0 : _a.id); });
            const newDescendent = this._pivotOnMarriage(marriageToPivotOn, descendent);
            this._overwriteChild(marriage, newDescendent);
            return true;
        }
        _pivotOnMarriage(marriage, descendent) {
            const newDescendent = marriage === null || marriage === void 0 ? void 0 : marriage.spouse;
            const newMarriage = new dSeeder.TreeNodeMarriage();
            descendent.marriages = new Array();
            newMarriage.spouse = descendent;
            newMarriage.children = marriage === null || marriage === void 0 ? void 0 : marriage.children;
            newDescendent.marriages.push(newMarriage);
            return newDescendent;
        }
    }
    dSeeder.TreeNode = TreeNode;
})(dSeeder || (dSeeder = {}));
var dSeeder;
(function (dSeeder) {
    class TreeNodeMarriage {
        constructor() {
            this.spouse = null;
            this.children = new Array();
        }
    }
    dSeeder.TreeNodeMarriage = TreeNodeMarriage;
})(dSeeder || (dSeeder = {}));
var dSeeder;
(function (dSeeder) {
    let _generationLimit = 100;
    function _getWithParentIds(data, id) {
        const member = data.find((member) => member.id === id);
        if (member === undefined) {
            throw new Error(`Member with id (${id}) was not found`);
        }
        return member;
    }
    function _getWithoutParentIds(data, id) {
        let member = _getWithParentIds(data, id);
        member.parent1Id = null;
        member.parent2Id = null;
        return member;
    }
    function _get(data, ids, options) {
        const members = new Array();
        ids.forEach(id => {
            const member = (options.preserveParentIds)
                ? _getWithParentIds(data, id)
                : _getWithoutParentIds(data, id);
            members.push(member);
        });
        return members;
    }
    function _getChildren(data, ...parents) {
        var _a;
        const childIds = data.filter((member) => parents.some((parent) => parent.id === member.parent1Id || parent.id === member.parent2Id))
            .map((member) => member.id);
        if (childIds.length === 0) {
            return [];
        }
        const children = _get(data, childIds, { preserveParentIds: true });
        const parentDepthOffset = (_a = parents.find((parent) => parent.depthOffset !== undefined)) === null || _a === void 0 ? void 0 : _a.depthOffset;
        if (parentDepthOffset !== undefined) {
            children.forEach((child) => child.depthOffset = parentDepthOffset + 1);
        }
        return children;
    }
    function _getOtherParents(data, children, ...parents) {
        var _a;
        const parentIds = parents.map((parent) => parent.id);
        const otherParentIds = children.map((child) => parentIds.includes(child.parent1Id)
            ? child.parent2Id
            : child.parent1Id);
        const uniqueOtherParentIds = otherParentIds.filter((value, index) => index === otherParentIds.indexOf(value));
        const otherParents = _get(data, uniqueOtherParentIds, { preserveParentIds: false });
        const parentDepthOffset = (_a = parents.find((parent) => parent.depthOffset !== undefined)) === null || _a === void 0 ? void 0 : _a.depthOffset;
        if (parentDepthOffset !== undefined) {
            otherParents.forEach((otherParent) => otherParent.depthOffset = parentDepthOffset);
        }
        return otherParents;
    }
    function _getRelatives(data, targetId) {
        if (data.length === 0) {
            throw new Error("Data cannot be empty");
        }
        if (targetId === undefined) {
            throw new Error("TargetId cannot be undefined");
        }
        const depthOffsetStart = 1;
        const members = new Array();
        const target = _getWithParentIds(data, targetId);
        const hasParent1 = target.parent1Id !== null;
        const hasParent2 = target.parent2Id !== null;
        if (!hasParent1 && !hasParent2) {
            target.depthOffset = depthOffsetStart;
        }
        else {
            target.depthOffset = depthOffsetStart + 1;
            const parentIds = new Array();
            if (hasParent1) {
                parentIds.push(target.parent1Id);
            }
            if (hasParent2) {
                parentIds.push(target.parent2Id);
            }
            const parents = _get(data, parentIds, { preserveParentIds: false });
            parents.forEach((parent) => parent.depthOffset = depthOffsetStart);
            members.push(...parents);
            const siblingIds = data.filter((member) => ((member.parent1Id === target.parent1Id || member.parent2Id === target.parent2Id)
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
    function _combineIntoMarriages(data, options) {
        if (data.length === 1) {
            return data.map((member) => new dSeeder.TreeNode(member));
        }
        let parentGroups = data.map((member) => {
            return [member.parent1Id, member.parent2Id].filter((id) => id !== null);
        }).filter((group) => group.length > 0);
        parentGroups = [...new Set(parentGroups
                .map((group) => JSON.stringify(group.sort())))]
            .map((group) => JSON.parse(group));
        if (parentGroups.length === 0) {
            throw new Error("At least one member must have at least one parent");
        }
        const treeNodes = new Array();
        parentGroups.forEach((currentParentGroup) => {
            const nodeId = currentParentGroup[0];
            const node = new dSeeder.TreeNode(_getWithParentIds(data, nodeId), options);
            const nodeMarriages = parentGroups.filter((group) => group.includes(nodeId));
            nodeMarriages.forEach((marriedCouple) => {
                const index = parentGroups.indexOf(marriedCouple);
                if (index !== parentGroups.indexOf(currentParentGroup)) {
                    parentGroups.splice(index, 1);
                }
                const marriage = new dSeeder.TreeNodeMarriage();
                const spouseId = marriedCouple[1];
                if (spouseId !== undefined) {
                    marriage.spouse = new dSeeder.TreeNode(_getWithParentIds(data, spouseId), options);
                }
                marriage.children = data.filter((member) => {
                    if (member.parent1Id !== null && member.parent2Id !== null) {
                        return marriedCouple.includes(member.parent1Id)
                            && marriedCouple.includes(member.parent2Id);
                    }
                    if (member.parent1Id !== null && member.parent2Id === null) {
                        return marriedCouple.includes(member.parent1Id)
                            && member.parent2Id === null;
                    }
                    if (member.parent1Id === null && member.parent2Id !== null) {
                        return marriedCouple.includes(member.parent2Id)
                            && member.parent1Id === null;
                    }
                    return false;
                }).map((child) => new dSeeder.TreeNode(child, options));
                node.marriages.push(marriage);
            });
            treeNodes.push(node);
        });
        return treeNodes;
    }
    function _coalesce(data) {
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
    function seed(data, targetId, options) {
        const members = _getRelatives(data, targetId);
        const marriages = _combineIntoMarriages(members, options);
        const rootNode = _coalesce(marriages);
        return rootNode;
    }
    dSeeder.seed = seed;
    dSeeder._private = {
        _getRelatives,
        _combineIntoMarriages,
        _coalesce
    };
})(dSeeder || (dSeeder = {}));
//# sourceMappingURL=dSeeder.js.map