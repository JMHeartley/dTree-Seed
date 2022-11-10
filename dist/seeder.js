"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let dTreeSeeder = {
    _data: new Array(),
    _getWithParentIds: function (id) {
        const member = this._data.find((member) => member.id === id);
        if (member === undefined) {
            throw new Error(`Member with id (${id}) was not found`);
        }
        return member;
    },
    _getWithoutParentIds: function (id) {
        let member = this._getWithParentIds(id);
        member.parent1Id = null;
        member.parent2Id = null;
        return member;
    },
    seed: function (data, targetId) {
        this._data = data;
        if (targetId === undefined) {
            return [];
        }
        let members = new Array();
        const target = this._getWithParentIds(targetId);
        members.push(target);
        const hasParent1 = target.parent1Id !== null;
        const hasParent2 = target.parent2Id !== null;
        if (hasParent1) {
            const parent1 = this._getWithoutParentIds(target.parent1Id);
            members.push(parent1);
        }
        if (hasParent2) {
            const parent2 = this._getWithoutParentIds(target.parent2Id);
            members.push(parent2);
        }
        if (hasParent1 || hasParent2) {
            const siblingIds = this._data.filter((member) => ((member.parent1Id === target.parent1Id || member.parent2Id === target.parent2Id)
                || (member.parent1Id === target.parent2Id || member.parent2Id === target.parent1Id))
                && member.id !== target.id)
                .map((member) => member.id);
            siblingIds.forEach(id => {
                const sibling = this._getWithParentIds(id);
                members.push(sibling);
            });
        }
        const childIds = this._data.filter((member) => member.parent1Id === target.id || member.parent2Id === target.id)
            .map((member) => member.id);
        if (childIds.length === 0) {
            return members;
        }
        let children = new Array();
        childIds.forEach(id => {
            const child = this._getWithParentIds(id);
            children.push(child);
            members.push(child);
        });
        const otherParentIds = children.map((member) => member.parent1Id === target.id
            ? member.parent2Id
            : member.parent1Id);
        const uniqueOtherParentIds = otherParentIds.filter((value, index) => index === otherParentIds.indexOf(value));
        uniqueOtherParentIds.forEach(id => {
            const otherParent = this._getWithoutParentIds(id);
            members.push(otherParent);
        });
        return members;
    }
};
exports.default = dTreeSeeder;
//# sourceMappingURL=seeder.js.map