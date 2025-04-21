import { expect } from 'chai';
import sinon from 'sinon';
import AllergyService from '../../../src/services/AllergyService';
import AllergyRepo from '../../../src/repos/AllergyRepo';
import { AllergyMap } from '../../../src/mappers/AllergyMap';
import { Allergy } from '../../../src/domain/Allergy';
import { Result } from '../../../src/core/logic/Result';
import { Code } from '../../../src/domain/Code';
import { Name } from '../../../src/domain/Name';
import { Description } from '../../../src/domain/Description';
import { CommonSymptoms } from '../../../src/domain/CommonSymptoms';

describe('AllergyService', () => {
  let allergyService: AllergyService;
  let allergyRepoMock: sinon.SinonStubbedInstance<AllergyRepo>;

  beforeEach(() => {
    allergyRepoMock = sinon.createStubInstance(AllergyRepo);
    allergyService = new AllergyService(allergyRepoMock as any);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should create a new allergy successfully', async () => {
    // Arrange
    const allergyDTO = {
      code: '12345',
      designation: 'Allergy 123',
      description: 'A test allergy'
    };

    const mockAllergy = sinon.createStubInstance(Allergy);
    allergyRepoMock.save.resolves(Result.ok(mockAllergy));

    // Act
    const result = await allergyService.createAllergy(allergyDTO);

    // Assert
    expect(result.isSuccess).to.be.true;
    sinon.assert.calledOnce(allergyRepoMock.save);
  });

  it('should fail if the allergy already exists', async () => {
    // Arrange
    const allergyDTO = {
      code: '12345',
      designation: 'Allergy 123',
      description: 'A test allergy'
    };

    allergyRepoMock.save.resolves(Result.fail('Allergy already exists.'));

    // Act
    const result = await allergyService.createAllergy(allergyDTO);

    // Assert
    expect(result.isFailure).to.be.true;
    expect(result.errorValue()).to.equal('Allergy already exists.');
    sinon.assert.calledOnce(allergyRepoMock.save);
  });

  it('should throw an error if an exception occurs', async () => {
    // Arrange
    const allergyDTO = {
      code: '12345',
      designation: 'Allergy 123',
      description: 'A test allergy'
    };

    allergyRepoMock.save.rejects(new Error('Database error'));

    // Act
    try {
      await allergyService.createAllergy(allergyDTO);
    } catch (err) {
      // Assert
      expect(err.message).to.equal('Database error');
    }

    sinon.assert.calledOnce(allergyRepoMock.save);
  });

  // Update Tests
  it('should update an existing allergy successfully', async () => {
    const code = '12345';
    const updateData = {
      designation: 'Updated designation',
      description: 'Updated description',
    };
  
    const existingAllergy = Allergy.create({
      allergyId: Code.create('12345').getValue(),
      designation: Name.create('Allergy 123').getValue(),
      description: Description.create('A description').getValue(),
    }).getValue();
  
    allergyRepoMock.findByCode.resolves(existingAllergy);
    allergyRepoMock.update.resolves(Result.ok(existingAllergy));
    sinon.stub(AllergyMap, 'partialUpdateToDomain').returns(Result.ok(existingAllergy));
  
    const result = await allergyService.updateAllergy(code, updateData);
  
    expect(result.isSuccess).to.be.true;
    sinon.assert.calledOnce(allergyRepoMock.findByCode);
    sinon.assert.calledOnce(allergyRepoMock.update);
  });
  

  it('should return failure when trying to update a non-existing allergy', async () => {
    // Arrange
    const code = 'INVALID_CODE';
    const updateData = { description: 'New description' };

    allergyRepoMock.findByCode.resolves(null);

    // Act
    const result = await allergyService.updateAllergy(code, updateData);

    // Assert
    expect(result.isFailure).to.be.true;
    expect(result.errorValue()).to.equal('Allergy not found');
    sinon.assert.calledOnce(allergyRepoMock.findByCode);
    sinon.assert.notCalled(allergyRepoMock.update);
  });

  // Search Tests
  it('should return a list of allergies matching the search criteria', async () => {
    // Arrange
    const searchCriteria = { code: '12345' };
    const mockAllergies = [sinon.createStubInstance(Allergy)];

    allergyRepoMock.searchAllergies.resolves(mockAllergies);
    sinon.stub(AllergyMap, 'toDTOList').returns([{}]);

    // Act
    const result = await allergyService.searchAllergies(searchCriteria.code);

    // Assert
    expect(result.isSuccess).to.be.true;
    expect(result.getValue()).to.be.an('array');
    sinon.assert.calledOnce(allergyRepoMock.searchAllergies);
  });

  it('should return failure when no allergies are found', async () => {
    // Arrange
    const searchCriteria = { code: 'INVALID_CODE' };
    allergyRepoMock.searchAllergies.resolves([]);

    // Act
    const result = await allergyService.searchAllergies(searchCriteria.code);

    // Assert
    expect(result.isFailure).to.be.true;
    expect(result.errorValue()).to.equal('Allergy not found.');
    sinon.assert.calledOnce(allergyRepoMock.searchAllergies);
  });

  it('should return all allergies when no search criteria are provided', async () => {
    // Arrange
    const mockAllergies = [sinon.createStubInstance(Allergy)];

    allergyRepoMock.getAllAllergies.resolves(mockAllergies);
    sinon.stub(AllergyMap, 'toDTOList').returns([{}]);

    // Act
    const result = await allergyService.searchAllergies();

    // Assert
    expect(result.isSuccess).to.be.true;
    expect(result.getValue()).to.be.an('array');
    sinon.assert.calledOnce(allergyRepoMock.getAllAllergies);
  });

  it('should return failure when no allergies are found and no criteria are provided', async () => {
    // Arrange
    allergyRepoMock.getAllAllergies.resolves([]);

    // Act
    const result = await allergyService.searchAllergies();

    // Assert
    expect(result.isFailure).to.be.true;
    expect(result.errorValue()).to.equal('Allergy not found.');
    sinon.assert.calledOnce(allergyRepoMock.getAllAllergies);
  });
});