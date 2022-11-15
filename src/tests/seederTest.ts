import 'mocha';
import chai from 'chai';
const assert = chai.assert;

import seeder from '../seeder';
import mockMembers from './data/mockMembers';
const testData = mockMembers.getMockMembers();

describe('_getRelatives', () => {
    it('gets no targetId, should return an empty array', () => {
        // Act
        const result = seeder._getRelatives(testData);

        // Assert
        assert.isArray(result);
        assert.isEmpty(result);
    })
    describe('gets valid targetId', () => {
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
            it('should return list including target with their parent ids', () => {
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
                it('only has parent1, should return list including parent1 without their parent ids', () => {
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
                it('only has parent2, should return list including parent2 without their parent ids', () => {
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
                it('has 2 parents, should return list including both parents without their parent ids', () => {
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
                it('with same parent order, should return list including siblings with their parent ids', () => {
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
                it('with reverse parent order, should return list including siblings with their parent ids', () => {
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
                it('with both parent orders, should return list including siblings with their parent ids', () => {
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
                it('should return list including children with their parent ids', () => {
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
                it('should return list including children\'s other parent without their parent ids', () => {
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
                it('should return list including grandchildren with their parent ids', () => {
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
                it('should return list including grandchildren\'s other parents without their parent ids', () => {
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

        // Arrange

        // Assert
    })
});