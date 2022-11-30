import Member from "../../member";

class MockMember implements Member {
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

class MockMembers {
    static RickardStark: MockMember = new MockMember({
        id: 0,
        name: 'Rickard Stark',
        parent1Id: null,
        parent2Id: null
    });
    static LyarraStark: MockMember = new MockMember({
        id: 1,
        name: 'Lyarra Stark',
        parent1Id: null,
        parent2Id: null
    });
    static EdardStark: MockMember = new MockMember({
        id: 2,
        name: 'Edard Stark',
        parent1Id: MockMembers.LyarraStark.id,
        parent2Id: MockMembers.RickardStark.id
    });
    static BenjenStark: MockMember = new MockMember({
        id: 3,
        name: 'Benjen Stark',
        parent1Id: MockMembers.RickardStark.id,
        parent2Id: MockMembers.LyarraStark.id
    });
    static BrandonStark: MockMember = new MockMember({
        id: 4,
        name: 'Brandon Stark',
        parent1Id: MockMembers.RickardStark.id,
        parent2Id: MockMembers.LyarraStark.id
    });
    static LyannaStark: MockMember = new MockMember({
        id: 5,
        name: 'Lyanna Stark',
        parent1Id: MockMembers.RickardStark.id,
        parent2Id: MockMembers.LyarraStark.id
    });
    static Parent1: MockMember = new MockMember({
        id: 6,
        name: 'Parent 1',
        parent1Id: null,
        parent2Id: null
    });
    static Parent2: MockMember = new MockMember({
        id: 7,
        name: 'Parent 2',
        parent1Id: null,
        parent2Id: null
    });
    static OnlyHasParent1: MockMember = new MockMember({
        id: 8,
        name: 'Only Has Parent 1',
        parent1Id: MockMembers.Parent1.id,
        parent2Id: null
    });
    static OnlyHasParent2: MockMember = new MockMember({
        id: 9,
        name: 'Only Has Parent 2',
        parent1Id: null,
        parent2Id: MockMembers.Parent2.id
    });
    static Child: MockMember = new MockMember({
        id: 10,
        name: 'Child',
        parent1Id: MockMembers.Parent1.id,
        parent2Id: MockMembers.Parent2.id
    });
    static SiblingWithParentsInSameOrder: MockMember = new MockMember({
        id: 11,
        name: 'Sibling With Parents In Same Order',
        parent1Id: MockMembers.Parent1.id,
        parent2Id: MockMembers.Parent2.id
    });
    static SiblingWithParentsInReverseOrder: MockMember = new MockMember({
        id: 12,
        name: 'Sibling With Parents In Reverse Order',
        parent1Id: MockMembers.Parent2.id,
        parent2Id: MockMembers.Parent1.id
    });
    static HosterTully: MockMember = new MockMember({
        id: 13,
        name: 'Hoster Tully',
        parent1Id: null,
        parent2Id: null
    });
    static MonisaWhent: MockMember = new MockMember({
        id: 14,
        name: 'Monisa Whent',
        parent1Id: null,
        parent2Id: null
    });
    static CatelynStark: MockMember = new MockMember({
        id: 15,
        name: 'Catelyn Stark',
        parent1Id: null,
        parent2Id: null
    });
    static RobbStark: MockMember = new MockMember({
        id: 16,
        name: 'Robb Stark',
        parent1Id: MockMembers.CatelynStark.id,
        parent2Id: MockMembers.EdardStark.id
    });
    static SansaStark: MockMember = new MockMember({
        id: 17,
        name: 'Sansa Stark',
        parent1Id: MockMembers.CatelynStark.id,
        parent2Id: MockMembers.EdardStark.id
    });
    static AryaStark: MockMember = new MockMember({
        id: 18,
        name: 'Arya Stark',
        parent1Id: MockMembers.CatelynStark.id,
        parent2Id: MockMembers.EdardStark.id
    });
    static BranStark: MockMember = new MockMember({
        id: 19,
        name: 'Bran Stark',
        parent1Id: MockMembers.CatelynStark.id,
        parent2Id: MockMembers.EdardStark.id
    });
    static RickonStark: MockMember = new MockMember({
        id: 20,
        name: 'Rickon Stark',
        parent1Id: MockMembers.CatelynStark.id,
        parent2Id: MockMembers.EdardStark.id
    });
    static Parent1IsNotInData: MockMember = new MockMember({
        id: 21,
        name: 'Parent 1 Is Not In Data',
        parent1Id: 999,
        parent2Id: MockMembers.Parent2.id
    });
    static Parent2IsNotInData: MockMember = new MockMember({
        id: 22,
        name: 'Parent 2 Is Not In Data',
        parent1Id: MockMembers.Parent1.id,
        parent2Id: 999
    });
    static Gen1Parent1: MockMember = new MockMember({
        id: 23,
        name: 'Gen 1 Parent 1',
        parent1Id: null,
        parent2Id: null
    });
    static Gen1Parent2: MockMember = new MockMember({
        id: 24,
        name: 'Gen 1 Parent 2',
        parent1Id: null,
        parent2Id: null
    });
    static Gen2Parent1: MockMember = new MockMember({
        id: 25,
        name: 'Gen 2 Parent 2',
        parent1Id: null,
        parent2Id: null
    });
    static Gen1ChildGen2Parent2: MockMember = new MockMember({
        id: 26,
        name: 'Gen 1 Child, Gen 2 Parent 1',
        parent1Id: MockMembers.Gen1Parent1.id,
        parent2: MockMembers.Gen1Parent2.id
    });
    static Gen3Parent1: MockMember = new MockMember({
        id: 27,
        name: 'Gen 3 Parent 1',
        parent1Id: null,
        parent2Id: null
    });
    static Gen2ChildGen3Parent2: MockMember = new MockMember({
        id: 28,
        name: 'Gen 2 Child, Gen 3 Parent 2',
        parent1Id: MockMembers.Gen2Parent1.id,
        parent2Id: MockMembers.Gen1ChildGen2Parent2.id
    });
    static Gen3ChildGen4Parent1: MockMember = new MockMember({
        id: 29,
        name: 'Gen 3 Child, Gen 4 Parent 1',
        parent1Id: MockMembers.Gen3Parent1.id,
        parent2Id: MockMembers.Gen2ChildGen3Parent2.id
    });
    static Gen4Parent2: MockMember = new MockMember({
        id: 30,
        name: 'Gen 4 Parent 2',
        parent1Id: null,
        parent2Id: null
    });
    static Gen4ChildGen5Parent1: MockMember = new MockMember({
        id: 31,
        name: 'Gen 4 Child, Gen 5 Parent 1',
        parent1Id: MockMembers.Gen3ChildGen4Parent1.id,
        parent2Id: MockMembers.Gen4Parent2.id
    });
    static Gen5Parent2: MockMember = new MockMember({
        id: 32,
        name: 'Gen 5 Parent 2',
        parent1Id: null,
        parent2Id: null
    });
    static Gen5Child: MockMember = new MockMember({
        id: 33,
        name: 'Gen 5 Child',
        parent1Id: MockMembers.Gen4ChildGen5Parent1.id,
        parent2Id: MockMembers.Gen5Parent2.id
    });
    static getMockMembers(): MockMember[] {
        return [
            MockMembers.RickardStark,
            MockMembers.LyarraStark,
            MockMembers.EdardStark,
            MockMembers.BenjenStark,
            MockMembers.BrandonStark,
            MockMembers.LyannaStark,
            MockMembers.OnlyHasParent1,
            MockMembers.OnlyHasParent2,
            MockMembers.Parent1,
            MockMembers.Parent2,
            MockMembers.Child,
            MockMembers.SiblingWithParentsInSameOrder,
            MockMembers.SiblingWithParentsInReverseOrder,
            MockMembers.HosterTully,
            MockMembers.MonisaWhent,
            MockMembers.CatelynStark,
            MockMembers.RobbStark,
            MockMembers.SansaStark,
            MockMembers.AryaStark,
            MockMembers.BranStark,
            MockMembers.RickonStark,
            MockMembers.Parent1IsNotInData,
            MockMembers.Parent2IsNotInData,
            MockMembers.Gen1Parent1,
            MockMembers.Gen1Parent2,
            MockMembers.Gen1ChildGen2Parent2,
            MockMembers.Gen2Parent1,
            MockMembers.Gen3Parent1,
            MockMembers.Gen2ChildGen3Parent2,
            MockMembers.Gen3ChildGen4Parent1,
            MockMembers.Gen4Parent2,
            MockMembers.Gen4ChildGen5Parent1,
            MockMembers.Gen5Parent2,
            MockMembers.Gen5Child
        ];
    }
}

export default MockMembers;