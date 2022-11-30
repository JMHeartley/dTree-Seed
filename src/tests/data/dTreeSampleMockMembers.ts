import Member from "../../member";

class dTreeMockMember implements Member {
    constructor(member: any) {
        this.id = member.id;
        this.name = member.name;
        this.parent1Id = member.parent1Id;
        this.parent2Id = member.parent2Id;
    }
    id: number;
    name: string;
    parent1Id: number | null;
    parent2Id: number | null;
}

class dTreeMockMembers {
    static NiclasSuperLongsurname: dTreeMockMember = new dTreeMockMember({
        id: 0,
        name: 'Niclas Superlongsurname',
        parent1Id: null,
        parent2Id: null
    });
    static Iliana: dTreeMockMember = new dTreeMockMember({
        id: 1,
        name: 'Iliana',
        parent1Id: null,
        parent2Id: null
    });
    static James: dTreeMockMember = new dTreeMockMember({
        id: 2,
        name: 'James',
        parent1Id: dTreeMockMembers.NiclasSuperLongsurname.id,
        parent2Id: dTreeMockMembers.Iliana.id
    });
    static Alexandra: dTreeMockMember = new dTreeMockMember({
        id: 3,
        name: 'Alexandra',
        parent1Id: null,
        parent2Id: null
    });
    static Eric: dTreeMockMember = new dTreeMockMember({
        id: 4,
        name: 'Eric',
        parent1Id: dTreeMockMembers.Alexandra.id,
        parent2Id: dTreeMockMembers.James.id
    });
    static Eva: dTreeMockMember = new dTreeMockMember({
        id: 5,
        name: 'Eva',
        parent1Id: null,
        parent2Id: null
    });
    static Jane: dTreeMockMember = new dTreeMockMember({
        id: 6,
        name: 'Jane',
        parent1Id: dTreeMockMembers.James.id,
        parent2Id: dTreeMockMembers.Alexandra.id
    });
    static Jasper: dTreeMockMember = new dTreeMockMember({
        id: 7,
        name: 'Jasper',
        parent1Id: dTreeMockMembers.James.id,
        parent2Id: dTreeMockMembers.Alexandra.id
    });
    static Emma: dTreeMockMember = new dTreeMockMember({
        id: 8,
        name: 'Emma',
        parent1Id: dTreeMockMembers.James.id,
        parent2Id: dTreeMockMembers.Alexandra.id
    });
    static Julia: dTreeMockMember = new dTreeMockMember({
        id: 9,
        name: 'Julia',
        parent1Id: dTreeMockMembers.James.id,
        parent2Id: dTreeMockMembers.Alexandra.id
    });
    static Jessica: dTreeMockMember = new dTreeMockMember({
        id: 10,
        name: 'Jessica',
        parent1Id: dTreeMockMembers.James.id,
        parent2Id: dTreeMockMembers.Alexandra.id
    });
    static getMockMembers(): dTreeMockMember[] {
        return [
            dTreeMockMembers.NiclasSuperLongsurname,
            dTreeMockMembers.Iliana,
            dTreeMockMembers.James,
            dTreeMockMembers.Alexandra,
            dTreeMockMembers.Eric,
            dTreeMockMembers.Eva,
            dTreeMockMembers.Jane,
            dTreeMockMembers.Jasper,
            dTreeMockMembers.Emma,
            dTreeMockMembers.Julia,
            dTreeMockMembers.Jessica
        ]
    }
}

export default dTreeMockMembers;