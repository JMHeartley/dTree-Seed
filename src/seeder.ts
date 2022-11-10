import Member from "./member";

let dTreeSeeder = {
    _data: new Array<Member>(),
    _getWithParentIds: function (id: number | null): Member {
        const member = this._data.find((member) => member.id === id);

        if (member === undefined) {
            throw new Error(`Member with id (${id}) was not found`);
        }
        return member;
    },
    _getWithoutParentIds: function (id: number | null): Member {
        let member = this._getWithParentIds(id);

        member.parent1Id = null;
        member.parent2Id = null;
        return member;
    },
    _get: function (ids: number[], parentOptions: { preserveParentIds: boolean }): Member[] {
        const members = new Array<Member>();
        ids.forEach(id => {
            const member = (parentOptions.preserveParentIds)
                ? this._getWithParentIds(id)
                : this._getWithoutParentIds(id);
            members.push(member);
        });
        return members;
    },
    _getChildren: function (...parents: Member[]): Member[] {
        const childIds = this._data.filter((member) =>
            parents.some((parent) => parent.id === member.parent1Id || parent.id === member.parent2Id))
            .map((member) => member.id);

        if (childIds.length === 0) {
            return [];
        }
        return this._get(childIds, { preserveParentIds: true });
    },
    _getOtherParents: function (children: Member[], ...parents: Member[]): Member[] {
        const parentIds = parents.map((parent) => parent.id);
        const otherParentIds = children.map((child) =>
            parentIds.includes(child.parent1Id as number)
                ? child.parent2Id
                : child.parent1Id);

        // remove duplicates when siblings have common parent
        const uniqueOtherParentIds = otherParentIds.filter((value, index) =>
            index === otherParentIds.indexOf(value));

        // remove parentIds so their ancestors aren't included
        return this._get(uniqueOtherParentIds as number[], { preserveParentIds: false });
    },
    seed: function (data: Member[], targetId?: number): Member[] {
        this._data = data;

        if (targetId === undefined) {
            return [];
        }

        const members = new Array<Member>();

        const target = this._getWithParentIds(targetId);
        members.push(target);

        const hasParent1 = target.parent1Id !== null;
        const hasParent2 = target.parent2Id !== null;
        if (hasParent1) {
            // remove parentIds so their ancestors aren't included
            const parent1 = this._getWithoutParentIds(target.parent1Id);
            members.push(parent1);
        }
        if (hasParent2) {
            // remove parentIds so their ancestors aren't included
            const parent2 = this._getWithoutParentIds(target.parent2Id);
            members.push(parent2);
        }

        if (hasParent1 || hasParent2) {
            const siblingIds = this._data.filter((member) =>
                ((member.parent1Id === target.parent1Id || member.parent2Id === target.parent2Id)
                    || (member.parent1Id === target.parent2Id || member.parent2Id === target.parent1Id))
                && member.id !== target.id)
                .map((member) => member.id);
            const siblings = this._get(siblingIds, { preserveParentIds: true });
            members.push(...siblings);
        }

        const children = this._getChildren(target);
        members.push(...children);

        if (children.length === 0) {
            return members;
        }

        const otherParents = this._getOtherParents(children, target);
        members.push(...otherParents);

        let nextGeneration = children;
        do {
            const nextGenerationChildren = this._getChildren(...nextGeneration);
            members.push(...nextGenerationChildren);

            const nextGenerationOtherParents = this._getOtherParents(nextGenerationChildren, ...nextGeneration);
            members.push(...nextGenerationOtherParents);

            nextGeneration = nextGenerationChildren;
        } while (nextGeneration.length > 0);

        return members;
    }
};

//3. generate tree hierarchy
//4. return tree hierarchy
//5. add options object to specify which relatives to include

export default dTreeSeeder;