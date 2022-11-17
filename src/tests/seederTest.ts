import 'mocha';
import chai from 'chai';
const assert = chai.assert;

import seeder from '../seeder';
import TreeNode from '../treeNode';
import TreeNodeMarriage from '../treeNodeMarriage';
import mockMembers from './data/mockMembers';
const testData = mockMembers.getMockMembers();

describe('_getRelatives', () => {
    it('gets empty array, should throw error', () => {
        // Assert
        assert.throws(() => seeder._getRelatives([]));
    })
    it('gets no targetId, should return an empty array', () => {
        // Act
        const result = seeder._getRelatives(testData);

        // Assert
        assert.isArray(result);
        assert.isEmpty(result);
    })
    describe('gets targetId', () => {
        it('target is not in data, should throw error', () => {
            // Arrange
            const targetId = 999;

            // Assert
            assert.throw(() => seeder._getRelatives(testData, targetId));
        })
        describe('target is in data', () => {
            it('should return array with no duplicates', () => {
                // Arrange
                const targetId = mockMembers.LyarraStark.id;

                // Act
                const result = seeder._getRelatives(testData, targetId);

                // Assert
                const resultIds = result.map((member) => member.id);
                const duplicateIds = resultIds.filter((value, index) =>
                    index !== resultIds.indexOf(value));
                assert.isEmpty(duplicateIds);
            })
            it('should return array including target with their parent ids', () => {
                // Arrange
                const targetId = mockMembers.EdardStark.id;

                // Act
                const result = seeder._getRelatives(testData, targetId);

                // Assert
                const target = result.find((member) => member.id === targetId);
                assert.isDefined(target);
                assert.isNotNull(target?.parent1Id);
                assert.isNotNull(target?.parent2Id);
            })
            describe('has parents', () => {
                it('only has parent1, should return array including parent1 without their parent ids', () => {
                    // Arrange
                    const targetId = mockMembers.OnlyHasParent1.id;

                    // Act
                    const result = seeder._getRelatives(testData, targetId);

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
                    const targetId = mockMembers.OnlyHasParent2.id;

                    // Act
                    const result = seeder._getRelatives(testData, targetId);

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
                    const targetId = mockMembers.LyannaStark.id;

                    // Act
                    const result = seeder._getRelatives(testData, targetId);

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
                    const targetId = mockMembers.Parent1IsNotInData.id;

                    // Assert
                    assert.throw(() => seeder._getRelatives(testData, targetId));
                })
                it('parent2 is not in data, should throw error', () => {
                    // Arrange
                    const targetId = mockMembers.Parent2IsNotInData.id;

                    // Assert
                    assert.throw(() => seeder._getRelatives(testData, targetId));
                })
            })
            describe('has siblings', () => {
                it('with same parent order, should return array including siblings with their parent ids', () => {
                    // Arrange
                    const targetId = mockMembers.Child.id;

                    // Act
                    const result = seeder._getRelatives(testData, targetId);

                    // Assert
                    const resultIds = result.map((member) => member.id);
                    assert.include(resultIds, mockMembers.SiblingWithParentsInSameOrder.id);

                    const sibling = result.find((member) => member.id === mockMembers.SiblingWithParentsInSameOrder.id);
                    assert.isNotNull(sibling?.parent1Id);
                    assert.isNotNull(sibling?.parent2Id);
                })
                it('with reverse parent order, should return array including siblings with their parent ids', () => {
                    // Arrange
                    const targetId = mockMembers.Child.id;

                    // Act
                    const result = seeder._getRelatives(testData, targetId);

                    // Assert
                    const resultIds = result.map((member) => member.id);
                    assert.include(resultIds, mockMembers.SiblingWithParentsInReverseOrder.id);
                    const sibling = result.find((member) => member.id === mockMembers.SiblingWithParentsInSameOrder.id);
                    assert.isNotNull(sibling?.parent1Id);
                    assert.isNotNull(sibling?.parent2Id);
                })
                it('with both parent orders, should return array including siblings with their parent ids', () => {
                    // Arrange
                    const targetId = mockMembers.Child.id;

                    // Act
                    const result = seeder._getRelatives(testData, targetId);

                    // Assert
                    const resultIds = result.map((member) => member.id);

                    const sibling1Id = mockMembers.SiblingWithParentsInSameOrder.id;
                    const sibling2Id = mockMembers.SiblingWithParentsInReverseOrder.id;
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
                    const targetId = mockMembers.LyarraStark.id;

                    // Act
                    const result = seeder._getRelatives(testData, targetId);

                    // Assert
                    const resultIds = result.map((member) => member.id);
                    const child1Id = mockMembers.EdardStark.id;
                    const child2Id = mockMembers.LyannaStark.id;
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
                    const targetId = mockMembers.EdardStark.id;

                    // Act
                    const result = seeder._getRelatives(testData, targetId);

                    // Assert
                    const resultIds = result.map((member) => member.id);
                    const spouseId = mockMembers.CatelynStark.id;
                    assert.include(resultIds, spouseId);
                    const spouse = result.find((member) => member.id === spouseId);
                    assert.isNull(spouse?.parent1Id);
                    assert.isNull(spouse?.parent2Id);
                })
                it('other parent (parent1) is not in data, should throw error', () => {
                    // Arrange
                    const targetId = mockMembers.Parent1IsNotInData.id;

                    // Assert
                    assert.throw(() => seeder._getRelatives(testData, targetId));
                })
                it('other parent (parent2) is not in data, should throw error', () => {
                    // Arrange
                    const targetId = mockMembers.Parent2IsNotInData.id;

                    // Assert
                    assert.throw(() => seeder._getRelatives(testData, targetId));
                })
            })
            describe('has grandchildren', () => {
                it('should return array including grandchildren with their parent ids', () => {
                    // Arrange
                    const targetId = mockMembers.LyarraStark.id;

                    // Act
                    const result = seeder._getRelatives(testData, targetId);

                    // Assert
                    const resultIds = result.map((member) => member.id);
                    const grandchildId = mockMembers.AryaStark.id;
                    assert.include(resultIds, grandchildId);
                    const grandchild = result.find((member) => member.id === grandchildId);
                    assert.isNotNull(grandchild?.parent1Id);
                    assert.isNotNull(grandchild?.parent2Id);
                })
                it('should return array including grandchildren\'s other parents without their parent ids', () => {
                    // Arrange
                    const targetId = mockMembers.LyarraStark.id;

                    // Act
                    const result = seeder._getRelatives(testData, targetId);

                    // Assert
                    const resultIds = result.map((member) => member.id);
                    const grandchildOtherParentId = mockMembers.CatelynStark.id;
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
        assert.throws(() => seeder._combineIntoMarriages([]));
    })
    it('gets 1 member, returns array of 1 treeNode', () => {
        // Arrange
        const members = [mockMembers.AryaStark];

        // Act
        const result = seeder._combineIntoMarriages(members);

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
        assert.throw(() => seeder._combineIntoMarriages(members));
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
        const result = seeder._combineIntoMarriages(members);

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
        const result = seeder._combineIntoMarriages(members);

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
        const result = seeder._combineIntoMarriages(members);

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
        const result = seeder._combineIntoMarriages(members);

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
        const result = seeder._combineIntoMarriages(members);

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
        assert.throws(() => seeder._coalesce([]));
    })
    it('gets 1 generation, should return valid tree', () => {
        // Arrange
        const node = new TreeNode(mockMembers.EdardStark);
        const marriage = new TreeNodeMarriage();
        marriage.spouse = new TreeNode(mockMembers.CatelynStark);
        marriage.children = [
            new TreeNode(mockMembers.AryaStark),
            new TreeNode(mockMembers.BranStark),
            new TreeNode(mockMembers.RickonStark),
            new TreeNode(mockMembers.SansaStark)
        ];
        node.marriages.push(marriage);

        // Assert
        const result = seeder._coalesce([node]);

        // Assert
        assert.equal(result.length, 1);
        assert.equal(result[0].id, mockMembers.EdardStark.id);
        assert.equal(result[0].marriages[0].spouse?.id, mockMembers.CatelynStark.id);
        assert.deepEqual(result[0].marriages[0].children.map(child => child.id), marriage.children.map(child => child.id));
    })
    it('gets 2 generations, should return valid tree', () => {
        // Arrange
        const nedStarkNode = new TreeNode(mockMembers.EdardStark);
        const nedStarkMarriage = new TreeNodeMarriage();
        nedStarkMarriage.spouse = new TreeNode(mockMembers.CatelynStark);
        nedStarkMarriage.children = [
            new TreeNode(mockMembers.AryaStark),
            new TreeNode(mockMembers.BranStark),
            new TreeNode(mockMembers.RickonStark),
            new TreeNode(mockMembers.SansaStark)
        ];
        nedStarkNode.marriages.push(nedStarkMarriage);
        const rickardStarkNode = new TreeNode(mockMembers.RickardStark);
        const rickardStarkMarriage = new TreeNodeMarriage();
        rickardStarkMarriage.spouse = new TreeNode(mockMembers.LyarraStark);
        rickardStarkMarriage.children = [
            new TreeNode(mockMembers.EdardStark),
            new TreeNode(mockMembers.BenjenStark),
            new TreeNode(mockMembers.BrandonStark),
            new TreeNode(mockMembers.LyannaStark)
        ];
        rickardStarkNode.marriages.push(rickardStarkMarriage);

        // Assert
        const result = seeder._coalesce([nedStarkNode, rickardStarkNode]);

        // Assert
        assert.equal(result.length, 1);
        assert.equal(result[0].id, mockMembers.RickardStark.id);
        assert.equal(result[0].marriages[0].spouse?.id, mockMembers.LyarraStark.id);
        assert.deepEqual(result[0].marriages[0].children.map(child => child.id), rickardStarkMarriage.children.map(child => child.id));

        const nedStarkInResult = result[0].marriages[0].children.find(child => child.id === mockMembers.EdardStark.id);
        assert.equal(nedStarkInResult?.marriages[0].spouse?.id, mockMembers.CatelynStark.id);
        assert.deepEqual(nedStarkInResult?.marriages[0].children.map(child => child.id), nedStarkMarriage.children.map(child => child.id));
    })

    //dTree sample data => valid tree
    //four generations => valid tree

    //two nodes are descendants of each other => valid tree
    //spouse is descendant or parent => valid tree
    //spouse is cousin => valid tree

    //has to pivot on node marriage - occurs when spouse has lower id value but is a descendant of the tree
    //spans more than generation limit => throws error

    it('has multiple root nodes, should throw error', () => {
        // Arrange
        const nodes = [
            new TreeNode(mockMembers.AryaStark),
            new TreeNode(mockMembers.Parent1)
        ];

        // Assert
        assert.throws(() => seeder._coalesce(nodes));
    })
    it('get duplicate tree nodes, should throw error', () => {
        // Arrange
        const nodes = [
            new TreeNode(mockMembers.AryaStark),
            new TreeNode(mockMembers.AryaStark)
        ];

        // Assert
        assert.throws(() => seeder._coalesce(nodes));
    })
});