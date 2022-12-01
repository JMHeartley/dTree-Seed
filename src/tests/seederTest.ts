import 'mocha';
import Chai from 'chai';
const assert = Chai.assert;

import Seeder from '../seeder';
import TreeNode from '../treeNode';
import TreeNodeMarriage from '../treeNodeMarriage';

import MockMembers from './data/mockMembers';
const testData = MockMembers.getAll();

import dTreeSampleData from './data/dTreeSampleData.json';
import dTreeSampleMockMembers from './data/dTreeSampleMockMembers';

describe('_getRelatives', () => {
    it('gets empty array, should throw error', () => {
        // Assert
        assert.throws(() => Seeder._getRelatives([]));
    })
    it('gets no targetId, should return an empty array', () => {
        // Assert
        assert.throws(() => Seeder._getRelatives(testData));
    })
    describe('gets targetId', () => {
        it('target is not in data, should throw error', () => {
            // Arrange
            const targetId = 999;

            // Assert
            assert.throw(() => Seeder._getRelatives(testData, targetId));
        })
        describe('target is in data', () => {
            it('should return array with no duplicates', () => {
                // Arrange
                const targetId = MockMembers.LyarraStark.id;

                // Act
                const result = Seeder._getRelatives(testData, targetId);

                // Assert
                const resultIds = result.map((member) => member.id);
                const duplicateIds = resultIds.filter((value, index) =>
                    index !== resultIds.indexOf(value));
                assert.isEmpty(duplicateIds);
            })
            it('should return array including target with their parent ids', () => {
                // Arrange
                const targetId = MockMembers.EdardStark.id;

                // Act
                const result = Seeder._getRelatives(testData, targetId);

                // Assert
                const target = result.find((member) => member.id === targetId);
                assert.isDefined(target);
                assert.isNotNull(target?.parent1Id);
                assert.isNotNull(target?.parent2Id);
            })
            describe('has parents', () => {
                it('only has parent1, should return array including parent1 without their parent ids', () => {
                    // Arrange
                    const targetId = MockMembers.OnlyHasParent1.id;

                    // Act
                    const result = Seeder._getRelatives(testData, targetId);

                    // Assert
                    const resultIds = result.map((member) => member.id);
                    const target = result.find((member) => member.id === targetId);
                    assert.include(resultIds, target?.parent1Id);
                    assert.isNull(target?.parent2Id);

                    const parent1 = result.find((member) => member.id === target?.parent1Id);
                    assert.isNull(parent1?.parent1Id);
                    assert.isNull(parent1?.parent2Id);
                })
                it('only has parent2, should return array including parent2 without their parent ids', () => {
                    // Arrange
                    // Arrange
                    const targetId = MockMembers.OnlyHasParent2.id;

                    // Act
                    const result = Seeder._getRelatives(testData, targetId);

                    // Assert
                    const resultIds = result.map((member) => member.id);
                    const target = result.find((member) => member.id === targetId);
                    assert.isNull(target?.parent1Id);
                    assert.include(resultIds, target?.parent2Id);

                    const parent2 = result.find((member) => member.id === target?.parent2Id);
                    assert.isNull(parent2?.parent1Id);
                    assert.isNull(parent2?.parent2Id);
                })
                it('has 2 parents, should return array including both parents without their parent ids', () => {
                    // Arrange
                    const targetId = MockMembers.LyannaStark.id;

                    // Act
                    const result = Seeder._getRelatives(testData, targetId);

                    // Assert
                    const resultIds = result.map((member) => member.id);
                    const target = result.find((member) => member.id === targetId);
                    assert.include(resultIds, target?.parent1Id);
                    assert.include(resultIds, target?.parent2Id);
                    const parent1 = result.find((member) => member.id === target?.parent1Id);
                    const parent2 = result.find((member) => member.id === target?.parent2Id);
                    assert.isNull(parent1?.parent1Id);
                    assert.isNull(parent1?.parent2Id);
                    assert.isNull(parent2?.parent1Id);
                    assert.isNull(parent2?.parent2Id);
                })
                it('parent1 is not in data, should throw error', () => {
                    // Arrange
                    const targetId = MockMembers.Parent1IsNotInData.id;

                    // Assert
                    assert.throw(() => Seeder._getRelatives(testData, targetId));
                })
                it('parent2 is not in data, should throw error', () => {
                    // Arrange
                    const targetId = MockMembers.Parent2IsNotInData.id;

                    // Assert
                    assert.throw(() => Seeder._getRelatives(testData, targetId));
                })
            })
            describe('has siblings', () => {
                it('with same parent order, should return array including siblings with their parent ids', () => {
                    // Arrange
                    const targetId = MockMembers.Child.id;

                    // Act
                    const result = Seeder._getRelatives(testData, targetId);

                    // Assert
                    const resultIds = result.map((member) => member.id);
                    assert.include(resultIds, MockMembers.SiblingWithParentsInSameOrder.id);

                    const sibling = result.find((member) => member.id === MockMembers.SiblingWithParentsInSameOrder.id);
                    assert.isNotNull(sibling?.parent1Id);
                    assert.isNotNull(sibling?.parent2Id);
                })
                it('with reverse parent order, should return array including siblings with their parent ids', () => {
                    // Arrange
                    const targetId = MockMembers.Child.id;

                    // Act
                    const result = Seeder._getRelatives(testData, targetId);

                    // Assert
                    const resultIds = result.map((member) => member.id);
                    assert.include(resultIds, MockMembers.SiblingWithParentsInReverseOrder.id);
                    const sibling = result.find((member) => member.id === MockMembers.SiblingWithParentsInSameOrder.id);
                    assert.isNotNull(sibling?.parent1Id);
                    assert.isNotNull(sibling?.parent2Id);
                })
                it('with both parent orders, should return array including siblings with their parent ids', () => {
                    // Arrange
                    const targetId = MockMembers.Child.id;

                    // Act
                    const result = Seeder._getRelatives(testData, targetId);

                    // Assert
                    const resultIds = result.map((member) => member.id);

                    const sibling1Id = MockMembers.SiblingWithParentsInSameOrder.id;
                    const sibling2Id = MockMembers.SiblingWithParentsInReverseOrder.id;
                    assert.include(resultIds, sibling1Id);
                    assert.include(resultIds, sibling2Id);
                    const sibling1 = result.find((member) => member.id === sibling1Id);
                    const sibling2 = result.find((member) => member.id === sibling2Id);
                    assert.isNotNull(sibling1?.parent1Id);
                    assert.isNotNull(sibling1?.parent2Id);
                    assert.isNotNull(sibling2?.parent1Id);
                    assert.isNotNull(sibling2?.parent2Id);
                })
            })
            describe('has children', () => {
                it('should return array including children with their parent ids', () => {
                    // Arrange
                    const targetId = MockMembers.LyarraStark.id;

                    // Act
                    const result = Seeder._getRelatives(testData, targetId);

                    // Assert
                    const resultIds = result.map((member) => member.id);
                    const child1Id = MockMembers.EdardStark.id;
                    const child2Id = MockMembers.LyannaStark.id;
                    assert.include(resultIds, child1Id);
                    assert.include(resultIds, child2Id);
                    const child1 = result.find((member) => member.id === child1Id);
                    const child2 = result.find((member) => member.id === child2Id);
                    assert.isNotNull(child1?.parent1Id);
                    assert.isNotNull(child1?.parent2Id);
                    assert.isNotNull(child2?.parent1Id);
                    assert.isNotNull(child2?.parent2Id);
                })
                it('should return array including children\'s other parent without their parent ids', () => {
                    // Arrange
                    const targetId = MockMembers.EdardStark.id;

                    // Act
                    const result = Seeder._getRelatives(testData, targetId);

                    // Assert
                    const resultIds = result.map((member) => member.id);
                    const spouseId = MockMembers.CatelynStark.id;
                    assert.include(resultIds, spouseId);
                    const spouse = result.find((member) => member.id === spouseId);
                    assert.isNull(spouse?.parent1Id);
                    assert.isNull(spouse?.parent2Id);
                })
                it('other parent (parent1) is not in data, should throw error', () => {
                    // Arrange
                    const targetId = MockMembers.Parent1IsNotInData.id;

                    // Assert
                    assert.throw(() => Seeder._getRelatives(testData, targetId));
                })
                it('other parent (parent2) is not in data, should throw error', () => {
                    // Arrange
                    const targetId = MockMembers.Parent2IsNotInData.id;

                    // Assert
                    assert.throw(() => Seeder._getRelatives(testData, targetId));
                })
            })
            describe('has grandchildren', () => {
                it('should return array including grandchildren with their parent ids', () => {
                    // Arrange
                    const targetId = MockMembers.LyarraStark.id;

                    // Act
                    const result = Seeder._getRelatives(testData, targetId);

                    // Assert
                    const resultIds = result.map((member) => member.id);
                    const grandchildId = MockMembers.AryaStark.id;
                    assert.include(resultIds, grandchildId);
                    const grandchild = result.find((member) => member.id === grandchildId);
                    assert.isNotNull(grandchild?.parent1Id);
                    assert.isNotNull(grandchild?.parent2Id);
                })
                it('should return array including grandchildren\'s other parents without their parent ids', () => {
                    // Arrange
                    const targetId = MockMembers.LyarraStark.id;

                    // Act
                    const result = Seeder._getRelatives(testData, targetId);

                    // Assert
                    const resultIds = result.map((member) => member.id);
                    const grandchildOtherParentId = MockMembers.CatelynStark.id;
                    assert.include(resultIds, grandchildOtherParentId);
                    const grandchildOtherParent = result.find((member) => member.id === grandchildOtherParentId);
                    assert.isNull(grandchildOtherParent?.parent1Id);
                    assert.isNull(grandchildOtherParent?.parent2Id);
                })
            })
        })
    })
});

describe('_combineIntoMarriages', () => {
    it('gets empty array, should throw error', () => {
        // Assert
        assert.throws(() => Seeder._combineIntoMarriages([]));
    })
    it('gets 1 member, returns array of 1 treeNode', () => {
        // Arrange
        const members = [MockMembers.AryaStark];

        // Act
        const result = Seeder._combineIntoMarriages(members);

        // Assert
        assert.isArray(result);
        assert.lengthOf(result, 1);
        assert.equal(result[0].id, members[0].id);
    })
    it('gets only members with no parents, should throw error', () => {
        // Arrange
        const members = [
            {
                id: 1,
                name: 'No Parents 1',
                parent1Id: null,
                parent2Id: null
            },
            {
                id: 2,
                name: 'No Parents 2',
                parent1Id: null,
                parent2Id: null
            }
        ];
        // Assert
        assert.throw(() => Seeder._combineIntoMarriages(members));
    })
    it('gets 1 child with 1 parent as parent1, returns array of 1 tree node with 1 marrige to no spouse and 1 child', () => {
        // Arrange
        const parent = {
            id: 1,
            name: 'Parent',
            parent1Id: null,
            parent2Id: null
        };
        const child = {
            id: 2,
            name: 'Child',
            parent1Id: 1,
            parent2Id: null
        };
        const members = [parent, child];

        // Act
        const result = Seeder._combineIntoMarriages(members);

        // Assert
        assert.isNull(result[0].marriages[0].spouse);
        assert.equal(result[0].marriages[0].children[0].id, child.id);
        assert.equal(result[0].marriages[0].children.length, 1);
    })
    it('gets 1 child with 1 parent as parent2, returns array of 1 tree node with 1 marrige to no spouse and 1 child', () => {
        // Arrange
        const parent = {
            id: 1,
            name: 'Parent',
            parent1Id: null,
            parent2Id: null
        };
        const child = {
            id: 2,
            name: 'Child',
            parent1Id: null,
            parent2Id: 1
        };
        const members = [parent, child];

        // Act
        const result = Seeder._combineIntoMarriages(members);

        // Assert
        assert.isNull(result[0].marriages[0].spouse);
        assert.equal(result[0].marriages[0].children[0].id, child.id);
        assert.equal(result[0].marriages[0].children.length, 1);
    })
    it('gets 1 child with 2 parents, returns array of 1 tree node with 1 marrige to spouse with 1 child', () => {
        // Arrange
        const parent1 = {
            id: 1,
            name: 'Parent1',
            parent1Id: null,
            parent2Id: null
        };
        const parent2 = {
            id: 2,
            name: 'Parent2',
            parent1Id: null,
            parent2Id: null
        };
        const child = {
            id: 3,
            name: 'Child',
            parent1Id: 1,
            parent2Id: 2
        };
        const members = [parent1, parent2, child];

        // Act
        const result = Seeder._combineIntoMarriages(members);

        // Assert
        assert.equal(result[0].marriages[0].spouse?.id, parent2.id);
        assert.equal(result[0].marriages[0].children[0].id, child.id);
        assert.equal(result[0].marriages[0].children.length, 1);

    })
    it('gets 1 parent with multiple spouses and children, returns array of 1 tree node with multiple marriages to spouses with children', () => {
        // Arrange
        const parent = {
            id: 1,
            name: 'Parent',
            parent1Id: null,
            parent2Id: null
        };
        const spouse1 = {
            id: 2,
            name: 'Spouse1',
            parent1Id: null,
            parent2Id: null
        };
        const spouse2 = {
            id: 3,
            name: 'Spouse2',
            parent1Id: null,
            parent2Id: null
        };
        const child1 = {
            id: 4,
            name: 'Child1',
            parent1Id: 1,
            parent2Id: 2
        };
        const child2 = {
            id: 5,
            name: 'Child2',
            parent1Id: 1,
            parent2Id: 3
        };
        const members = [parent, spouse1, spouse2, child1, child2];

        // Act
        const result = Seeder._combineIntoMarriages(members);

        // Assert
        assert.equal(result.length, 1);
        assert.equal(result[0].marriages.length, 2);
        assert.equal(result[0].marriages[0].spouse?.id, spouse1.id);
        assert.equal(result[0].marriages[0].children[0].id, child1.id);
        assert.equal(result[0].marriages[0].children.length, 1);
        assert.equal(result[0].marriages[1].spouse?.id, spouse2.id);
        assert.equal(result[0].marriages[1].children[0].id, child2.id);
        assert.equal(result[0].marriages[1].children.length, 1);
    })
    it('gets 2 children with 2 parents in different order, returns array of 1 tree node with 1 marriage to spouse with 2 children', () => {
        // Arrange
        const parent1 = {
            id: 1,
            name: 'Parent1',
            parent1Id: null,
            parent2Id: null
        };
        const parent2 = {
            id: 2,
            name: 'Parent2',
            parent1Id: null,
            parent2Id: null
        };
        const child1 = {
            id: 3,
            name: 'Child1',
            parent1Id: 1,
            parent2Id: 2
        };
        const child2 = {
            id: 4,
            name: 'Child2',
            parent1Id: 2,
            parent2Id: 1
        };
        const members = [parent1, parent2, child1, child2];

        // Act
        const result = Seeder._combineIntoMarriages(members);

        // Assert
        assert.equal(result.length, 1);
        assert.equal(result[0].marriages[0].spouse?.id, parent2.id);
        assert.equal(result[0].marriages[0].children[0].id, child1.id);
        assert.equal(result[0].marriages[0].children[1].id, child2.id);
        assert.equal(result[0].marriages[0].children.length, 2);
    })
});

describe('_coalesce', () => {
    it('gets empty array, should throw error', () => {
        // Assert
        assert.throws(() => Seeder._coalesce([]));
    })
    it('gets 1 generation, should return valid tree', () => {
        // Arrange
        const node = new TreeNode(MockMembers.EdardStark);
        const marriage = new TreeNodeMarriage();
        marriage.spouse = new TreeNode(MockMembers.CatelynStark);
        marriage.children = [
            new TreeNode(MockMembers.AryaStark),
            new TreeNode(MockMembers.BranStark),
            new TreeNode(MockMembers.RickonStark),
            new TreeNode(MockMembers.SansaStark)
        ];
        node.marriages.push(marriage);

        // Assert
        const result = Seeder._coalesce([node]);

        // Assert
        assert.equal(result.length, 1);
        assert.equal(result[0].id, MockMembers.EdardStark.id);
        assert.equal(result[0].marriages[0].spouse?.id, MockMembers.CatelynStark.id);
        assert.deepEqual(result[0].marriages[0].children.map(child => child.id), marriage.children.map(child => child.id));
    })
    it('gets 2 generations, should return valid tree', () => {
        // Arrange
        const nedStarkNode = new TreeNode(MockMembers.EdardStark);
        const nedStarkMarriage = new TreeNodeMarriage();
        nedStarkMarriage.spouse = new TreeNode(MockMembers.CatelynStark);
        nedStarkMarriage.children = [
            new TreeNode(MockMembers.AryaStark),
            new TreeNode(MockMembers.BranStark),
            new TreeNode(MockMembers.RickonStark),
            new TreeNode(MockMembers.SansaStark)
        ];
        nedStarkNode.marriages.push(nedStarkMarriage);
        const rickardStarkNode = new TreeNode(MockMembers.RickardStark);
        const rickardStarkMarriage = new TreeNodeMarriage();
        rickardStarkMarriage.spouse = new TreeNode(MockMembers.LyarraStark);
        rickardStarkMarriage.children = [
            new TreeNode(MockMembers.EdardStark),
            new TreeNode(MockMembers.BenjenStark),
            new TreeNode(MockMembers.BrandonStark),
            new TreeNode(MockMembers.LyannaStark)
        ];
        rickardStarkNode.marriages.push(rickardStarkMarriage);

        // Assert
        const result = Seeder._coalesce([nedStarkNode, rickardStarkNode]);

        // Assert
        assert.equal(result.length, 1);
        assert.equal(result[0].id, MockMembers.RickardStark.id);
        assert.equal(result[0].marriages[0].spouse?.id, MockMembers.LyarraStark.id);
        assert.deepEqual(result[0].marriages[0].children.map(child => child.id), rickardStarkMarriage.children.map(child => child.id));

        const nedStarkInResult = result[0].marriages[0].children.find(child => child.id === MockMembers.EdardStark.id);
        assert.equal(nedStarkInResult?.marriages[0].spouse?.id, MockMembers.CatelynStark.id);
        assert.deepEqual(nedStarkInResult?.marriages[0].children.map(child => child.id), nedStarkMarriage.children.map(child => child.id));
    })
    it('descendent is listed as spouse in marriage, should pivot node on marriage and return valid tree', () => {
        // Arrange
        const gen1Node = new TreeNode(MockMembers.Gen1Parent1);
        const gen1Marriage = new TreeNodeMarriage();
        gen1Marriage.spouse = new TreeNode(MockMembers.Gen1Parent2);
        gen1Marriage.children = [new TreeNode(MockMembers.Gen1ChildGen2Parent2)];
        gen1Node.marriages.push(gen1Marriage);

        const gen2Node = new TreeNode(MockMembers.Gen2Parent1);
        const gen2Marriage = new TreeNodeMarriage();
        gen2Marriage.spouse = new TreeNode(MockMembers.Gen1ChildGen2Parent2);
        gen2Marriage.children = [new TreeNode(MockMembers.Gen2ChildGen3Parent2)];
        gen2Node.marriages.push(gen2Marriage);

        // Act
        const result = Seeder._coalesce([gen1Node, gen2Node]);

        // Assert
        assert.equal(result.length, 1);
        const gen1InResult = result[0];
        assert.equal(gen1InResult.id, MockMembers.Gen1Parent1.id);
        assert.equal(gen1InResult.marriages[0].spouse?.id, MockMembers.Gen1Parent2.id);
        assert.deepEqual(gen1InResult.marriages[0].children.map(child => child.id), gen1Marriage.children.map(child => child.id));

        const gen2InResult = gen1InResult.marriages[0].children.find(child => child.id === MockMembers.Gen1ChildGen2Parent2.id);
        assert.equal(gen2InResult?.marriages[0].spouse?.id, MockMembers.Gen2Parent1.id);
        assert.deepEqual(gen2InResult?.marriages[0].children.map(child => child.id), gen2Marriage.children.map(child => child.id));
    })
    it('gets 5 generations, should return valid tree', () => {
        // Arrange
        const gen1Node = new TreeNode(MockMembers.Gen1Parent1);
        const gen1Marriage = new TreeNodeMarriage();
        gen1Marriage.spouse = new TreeNode(MockMembers.Gen1Parent2);
        gen1Marriage.children = [new TreeNode(MockMembers.Gen1ChildGen2Parent2)];
        gen1Node.marriages.push(gen1Marriage);

        const gen2Node = new TreeNode(MockMembers.Gen1ChildGen2Parent2);
        const gen2Marriage = new TreeNodeMarriage();
        gen2Marriage.spouse = new TreeNode(MockMembers.Gen2Parent1);
        gen2Marriage.children = [new TreeNode(MockMembers.Gen2ChildGen3Parent2)];
        gen2Node.marriages.push(gen2Marriage);

        const gen3Node = new TreeNode(MockMembers.Gen2ChildGen3Parent2);
        const gen3Marriage = new TreeNodeMarriage();
        gen3Marriage.spouse = new TreeNode(MockMembers.Gen3Parent1);
        gen3Marriage.children = [new TreeNode(MockMembers.Gen3ChildGen4Parent1)];
        gen3Node.marriages.push(gen3Marriage);

        const gen4Node = new TreeNode(MockMembers.Gen3ChildGen4Parent1);
        const gen4Marriage = new TreeNodeMarriage();
        gen4Marriage.spouse = new TreeNode(MockMembers.Gen4Parent2);
        gen4Marriage.children = [new TreeNode(MockMembers.Gen4ChildGen5Parent1)];
        gen4Node.marriages.push(gen4Marriage);

        const gen5Node = new TreeNode(MockMembers.Gen4ChildGen5Parent1);
        const gen5Marriage = new TreeNodeMarriage();
        gen5Marriage.spouse = new TreeNode(MockMembers.Gen5Parent2);
        gen5Marriage.children = [new TreeNode(MockMembers.Gen5Child)];
        gen5Node.marriages.push(gen5Marriage);

        // Assert
        const result = Seeder._coalesce([gen1Node, gen2Node, gen3Node, gen4Node, gen5Node]);

        // Assert
        assert.equal(result.length, 1);
        const gen1InResult = result[0];
        assert.equal(gen1InResult.id, MockMembers.Gen1Parent1.id);
        assert.equal(gen1InResult.marriages[0].spouse?.id, MockMembers.Gen1Parent2.id);
        assert.deepEqual(gen1InResult.marriages[0].children.map(child => child.id), gen1Marriage.children.map(child => child.id));

        const gen2InResult = gen1InResult.marriages[0].children.find(child => child.id === MockMembers.Gen1ChildGen2Parent2.id);
        assert.equal(gen2InResult?.marriages[0].spouse?.id, MockMembers.Gen2Parent1.id);
        assert.deepEqual(gen2InResult?.marriages[0].children.map(child => child.id), gen2Marriage.children.map(child => child.id));

        const gen3InResult = gen2InResult?.marriages[0].children.find(child => child.id === MockMembers.Gen2ChildGen3Parent2.id);
        assert.equal(gen3InResult?.marriages[0].spouse?.id, MockMembers.Gen3Parent1.id);
        assert.deepEqual(gen3InResult?.marriages[0].children.map(child => child.id), gen3Marriage.children.map(child => child.id));

        const gen4InResult = gen3InResult?.marriages[0].children.find(child => child.id === MockMembers.Gen3ChildGen4Parent1.id);;
        assert.equal(gen4InResult?.marriages[0].spouse?.id, MockMembers.Gen4Parent2.id);
        assert.deepEqual(gen4InResult?.marriages[0].children.map(child => child.id), gen4Marriage.children.map(child => child.id));

        const gen5InResult = gen4InResult?.marriages[0].children.find(child => child.id === MockMembers.Gen4ChildGen5Parent1.id);;
        assert.equal(gen5InResult?.marriages[0].spouse?.id, MockMembers.Gen5Parent2.id);
        assert.deepEqual(gen5InResult?.marriages[0].children.map(child => child.id), gen5Marriage.children.map(child => child.id));
    })
    it('gets multiple root nodes, should throw error', () => {
        // Arrange
        const nodes = [
            new TreeNode(MockMembers.AryaStark),
            new TreeNode(MockMembers.Parent1)
        ];

        // Assert
        assert.throws(() => Seeder._coalesce(nodes));
    })
    it('get duplicate tree nodes, should throw error', () => {
        // Arrange
        const nodes = [
            new TreeNode(MockMembers.AryaStark),
            new TreeNode(MockMembers.AryaStark)
        ];

        // Assert
        assert.throws(() => Seeder._coalesce(nodes));
    })
});

describe('seed', () => {
    it('gets empty array, should throw error', () => {
        // Assert
        assert.throws(() => Seeder.seed([]));
    })
    it('gets no targetId, should throw error', () => {
        // Assert
        assert.throws(() => Seeder.seed([MockMembers.AryaStark]));
    })
    it('gets dTree sample data, should return valid tree in JSON format', () => {
        // Act
        const result = Seeder.seed(dTreeSampleMockMembers.getAll(), dTreeSampleMockMembers.NiclasSuperLongsurname.id);

        // Assert
        assert.isString(result);
        assert.equal(result, JSON.stringify(dTreeSampleData));
    })
    describe('target has no parents', () => {
        it('target should have depthOffset 1', () => {
            // Arrange
            const targetId = MockMembers.Gen1Parent1.id;

            // Act
            const result = Seeder.seed(testData, targetId);

            // Assert
            const parsedResult = JSON.parse(result);
            const gen1: TreeNode[] = parsedResult;
            assert.include(gen1.map(node => node.id), targetId);
            assert.isTrue(gen1.every((node) => node.depthOffset === 1));
        })
        it('target has spouse, target and spouse should have same depthOffset', () => {
            // Arrange
            const targetId = MockMembers.Gen1Parent1.id;
            const spouseId = MockMembers.Gen1Parent2.id;

            // Act
            const result = Seeder.seed(testData, targetId);

            // Assert
            const parsedResult = JSON.parse(result);
            const gen1: TreeNode[] = parsedResult;
            assert.include(gen1.flatMap((node) => node.marriages.map((marriage) => marriage.spouse?.id)), spouseId);
            const targetDepthOffset = gen1.find(node => node.id === targetId)?.depthOffset as number;
            assert.isTrue(gen1.flatMap((node) => node.marriages.map((marriage) => marriage.spouse)).every((spouse) => spouse?.depthOffset === targetDepthOffset));
        })
        it('target has children, children should have depthOffset 1 more than target', () => {
            // Arrange
            const targetId = MockMembers.Gen1Parent1.id;
            const childId = MockMembers.Gen1ChildGen2Parent2.id;

            // Act
            const result = Seeder.seed(testData, targetId);

            // Assert
            const parsedResult = JSON.parse(result);
            const gen1: TreeNode[] = parsedResult;
            const gen2 = gen1.flatMap((node) => node.marriages.flatMap((marriage) => marriage.children));
            assert.include(gen2.map((node) => node.id), childId);
            const targetDepthOffset = gen1.find(node => node.id === targetId)?.depthOffset as number;
            assert.isTrue(gen2.every((node) => node.depthOffset === targetDepthOffset + 1));
        })
    })
    describe('target has parents', () => {
        it('target should have depthOffset 2', () => {
            // Arrange
            const targetId = MockMembers.Gen1ChildGen2Parent2.id;

            // Act
            const result = Seeder.seed(testData, targetId);

            // Assert
            const parsedResult = JSON.parse(result);
            const gen1: TreeNode[] = parsedResult;
            const gen2 = gen1.flatMap((node) => node.marriages.flatMap((marriage) => marriage.children));
            assert.include(gen2.map(node => node.id), targetId);
            assert.isTrue(gen2.every((node) => node.depthOffset === 2));
        })
        it('target has spouse, target and spouse should have same depthOffset', () => {
            // Arrange
            const targetId = MockMembers.Gen1ChildGen2Parent2.id;
            const spouseId = MockMembers.Gen2Parent1.id;

            // Act
            const result = Seeder.seed(testData, targetId);

            // Assert
            const parsedResult = JSON.parse(result);
            const gen1: TreeNode[] = parsedResult;
            const gen2 = gen1.flatMap((node) => node.marriages.flatMap((marriage) => marriage.children));
            assert.include(gen2.flatMap((node) => node.marriages.map((marriage) => marriage.spouse?.id)), spouseId);
            const targetDepthOffset = gen2.find(node => node.id === targetId)?.depthOffset as number;
            assert.isTrue(gen2.flatMap((node) => node.marriages.map((marriage) => marriage.spouse)).every((spouse) => spouse?.depthOffset === targetDepthOffset));
        })
        it('target has children, children should have depthOffset 1 more than target', () => {
            // Arrange
            const targetId = MockMembers.Gen1ChildGen2Parent2.id;
            const childId = MockMembers.Gen2ChildGen3Parent2.id;

            // Act
            const result = Seeder.seed(testData, targetId);

            // Assert
            const parsedResult = JSON.parse(result);
            const gen1: TreeNode[] = parsedResult;
            const gen2 = gen1.flatMap((node) => node.marriages.flatMap((marriage) => marriage.children));
            const gen3 = gen2.flatMap((node) => node.marriages.flatMap((marriage) => marriage.children));
            assert.include(gen3.map((node) => node.id), childId);
            const targetDepthOffset = gen2.find(node => node.id === targetId)?.depthOffset as number;
            assert.isTrue(gen3.every((node) => node.depthOffset === targetDepthOffset + 1));
        })
    })
    it('should add depthOffset to each generation', () => {
        // Act
        const result = Seeder.seed(testData, MockMembers.Gen1ChildGen2Parent2.id);

        // Assert
        const parsedResult = JSON.parse(result);
        const gen1: TreeNode[] = parsedResult;

        assert.isTrue(gen1.every((node) => node.depthOffset === 1));
        assert.isTrue(gen1.flatMap((node) => node.marriages.map((marriage) => marriage.spouse)).every((spouse) => spouse?.depthOffset == 1));

        const gen2 = gen1.flatMap((node) => node.marriages.flatMap((marriage) => marriage.children));
        assert.isTrue(gen2.every((node) => node.depthOffset === 2));
        assert.isTrue(gen2.flatMap((node) => node.marriages.map((marriage) => marriage.spouse)).every((spouse) => spouse?.depthOffset === 2));

        const gen3 = gen2.flatMap((node) => node.marriages.flatMap((marriage) => marriage.children));
        assert.isTrue(gen3.every((node) => node.depthOffset === 3));
        assert.isTrue(gen3.flatMap((node) => node.marriages.map((marriage) => marriage.spouse)).every((spouse) => spouse?.depthOffset === 3));

        const gen4 = gen3.flatMap((node) => node.marriages.flatMap((marriage) => marriage.children));
        assert.isTrue(gen4.every((node) => node.depthOffset === 4));
        assert.isTrue(gen4.flatMap((node) => node.marriages.map((marriage) => marriage.spouse)).every((spouse) => spouse?.depthOffset === 4));

        const gen5 = gen4.flatMap((node) => node.marriages.flatMap((marriage) => marriage.children));
        assert.isTrue(gen5.every((node) => node.depthOffset === 5));
        assert.isTrue(gen5.flatMap((node) => node.marriages.map((marriage) => marriage.spouse)).every((spouse) => spouse?.depthOffset === 5));
    })
});

