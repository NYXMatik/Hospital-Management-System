import { expect } from 'chai';
import sinon from 'sinon';
import MedicalConditionService from '../../../src/services/MedicalConditionService';
import MedicalConditionRepo from '../../../src/repos/MedicalConditionRepo';
import { MedicalConditionMap } from '../../../src/mappers/MedicalConditionMap';
import { MedicalCondition } from '../../../src/domain/MedicalCondition';
import { Result } from '../../../src/core/logic/Result';
import { Code } from '../../../src/domain/Code';
import { Name } from '../../../src/domain/Name';
import { Description } from '../../../src/domain/Description';
import { CommonSymptoms } from '../../../src/domain/CommonSymptoms';

describe('MedicalConditionService', () => {
  let medicalConditionService: MedicalConditionService;
  let medicalConditionRepoMock: sinon.SinonStubbedInstance<MedicalConditionRepo>;

  beforeEach(() => {
    medicalConditionRepoMock = sinon.createStubInstance(MedicalConditionRepo);
    medicalConditionService = new MedicalConditionService(medicalConditionRepoMock as any);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should create a new medical condition successfully', async () => {
    // Arrange
    const medicalConditionDTO = {
      code: 'COND123',
      designation: 'Condition 123',
      description: 'A test condition',
      commonSymptoms: ['Symptom1', 'Symptom2'],
    };

    const mockMedicalCondition = sinon.createStubInstance(MedicalCondition);
    medicalConditionRepoMock.save.resolves(Result.ok(mockMedicalCondition));

    // Act
    const result = await medicalConditionService.createMedicalCondition(medicalConditionDTO);

    // Assert
    expect(result.isSuccess).to.be.true;
    sinon.assert.calledOnce(medicalConditionRepoMock.save);
  });

  it('should fail if the medical condition already exists', async () => {
    // Arrange
    const medicalConditionDTO = {
      code: 'COND123',
      designation: 'Condition 123',
      description: 'A test condition',
      commonSymptoms: ['Symptom1', 'Symptom2'],
    };

    medicalConditionRepoMock.save.resolves(Result.fail('Medical condition already exists.'));

    // Act
    const result = await medicalConditionService.createMedicalCondition(medicalConditionDTO);

    // Assert
    expect(result.isFailure).to.be.true;
    expect(result.errorValue()).to.equal('Medical condition already exists.');
    sinon.assert.calledOnce(medicalConditionRepoMock.save);
  });

  it('should throw an error if an exception occurs', async () => {
    // Arrange
    const medicalConditionDTO = {
      code: 'COND123',
      designation: 'Condition 123',
      description: 'A test condition',
      commonSymptoms: ['Symptom1', 'Symptom2'],
    };

    medicalConditionRepoMock.save.rejects(new Error('Database error'));

    // Act
    try {
      await medicalConditionService.createMedicalCondition(medicalConditionDTO);
    } catch (err) {
      // Assert
      expect(err.message).to.equal('Database error');
    }

    sinon.assert.calledOnce(medicalConditionRepoMock.save);
  });

  // Update Tests
  it('should update an existing medical condition successfully', async () => {
    const code = 'COND123';
    const updateData = {
      designation: 'Updated designation',
      description: 'Updated description',
    };
  
    const existingCondition = MedicalCondition.create({
      medicalConditionId: Code.create('COND123').getValue(),
      designation: Name.create('Condition 123').getValue(),
      description: Description.create('A description').getValue(),
      commonSymptoms: CommonSymptoms.create(['Symptom1', 'Symptom2']).getValue(),
    }).getValue();
  
    medicalConditionRepoMock.findByCode.resolves(existingCondition);
    medicalConditionRepoMock.update.resolves(Result.ok(existingCondition));
    sinon.stub(MedicalConditionMap, 'partialUpdateToDomain').returns(Result.ok(existingCondition));
  
    const result = await medicalConditionService.updateMedicalCondition(code, updateData);
  
    expect(result.isSuccess).to.be.true;
    sinon.assert.calledOnce(medicalConditionRepoMock.findByCode);
    sinon.assert.calledOnce(medicalConditionRepoMock.update);
  });
  

  it('should return failure when trying to update a non-existing medical condition', async () => {
    // Arrange
    const code = 'INVALID_CODE';
    const updateData = { description: 'New description' };

    medicalConditionRepoMock.findByCode.resolves(null);

    // Act
    const result = await medicalConditionService.updateMedicalCondition(code, updateData);

    // Assert
    expect(result.isFailure).to.be.true;
    expect(result.errorValue()).to.equal('Medical condition not found');
    sinon.assert.calledOnce(medicalConditionRepoMock.findByCode);
    sinon.assert.notCalled(medicalConditionRepoMock.update);
  });

  // Search Tests
  it('should return a list of medical conditions matching the search criteria', async () => {
    // Arrange
    const searchCriteria = { code: 'COND123' };
    const mockConditions = [sinon.createStubInstance(MedicalCondition)];

    medicalConditionRepoMock.searchMedicalConditions.resolves(mockConditions);
    sinon.stub(MedicalConditionMap, 'toDTOList').returns([{}]);

    // Act
    const result = await medicalConditionService.searchMedicalConditions(searchCriteria.code);

    // Assert
    expect(result.isSuccess).to.be.true;
    expect(result.getValue()).to.be.an('array');
    sinon.assert.calledOnce(medicalConditionRepoMock.searchMedicalConditions);
  });

  it('should return failure when no medical conditions are found', async () => {
    // Arrange
    const searchCriteria = { code: 'INVALID_CODE' };
    medicalConditionRepoMock.searchMedicalConditions.resolves([]);

    // Act
    const result = await medicalConditionService.searchMedicalConditions(searchCriteria.code);

    // Assert
    expect(result.isFailure).to.be.true;
    expect(result.errorValue()).to.equal('Medical conditions not found.');
    sinon.assert.calledOnce(medicalConditionRepoMock.searchMedicalConditions);
  });

  it('should return all medical conditions when no search criteria are provided', async () => {
    // Arrange
    const mockConditions = [sinon.createStubInstance(MedicalCondition)];

    medicalConditionRepoMock.getAllMedicalConditions.resolves(mockConditions);
    sinon.stub(MedicalConditionMap, 'toDTOList').returns([{}]);

    // Act
    const result = await medicalConditionService.searchMedicalConditions();

    // Assert
    expect(result.isSuccess).to.be.true;
    expect(result.getValue()).to.be.an('array');
    sinon.assert.calledOnce(medicalConditionRepoMock.getAllMedicalConditions);
  });

  it('should return failure when no medical conditions are found and no criteria are provided', async () => {
    // Arrange
    medicalConditionRepoMock.getAllMedicalConditions.resolves([]);

    // Act
    const result = await medicalConditionService.searchMedicalConditions();

    // Assert
    expect(result.isFailure).to.be.true;
    expect(result.errorValue()).to.equal('Medical conditions not found.');
    sinon.assert.calledOnce(medicalConditionRepoMock.getAllMedicalConditions);
  });
});