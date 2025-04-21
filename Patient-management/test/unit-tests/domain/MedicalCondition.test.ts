import { expect } from 'chai';
import { MedicalCondition } from '../../../src/domain/MedicalCondition';
import { Code } from '../../../src/domain/Code';
import { Name } from '../../../src/domain/Name';
import { Description } from '../../../src/domain/Description';
import { CommonSymptoms } from '../../../src/domain/CommonSymptoms';
import { UniqueEntityID } from '../../../src/core/domain/UniqueEntityID';

describe('MedicalCondition Entity', () => {
  let validProps: any;
  let uniqueId: UniqueEntityID;

  beforeEach(() => {
    validProps = {
      medicalConditionId: Code.create('C001').getValue(),
      designation: Name.create('Diabetes').getValue(),
      description: Description.create('A chronic condition that affects insulin regulation.').getValue(),
      commonSymptoms: CommonSymptoms.create(['Increased thirst', 'Frequent urination']).getValue(),
    };

    uniqueId = new UniqueEntityID();
  });

  it('should create a valid MedicalCondition entity', () => {
    const result = MedicalCondition.create(validProps, uniqueId);
    expect(result.isSuccess).to.be.true;

    const medicalCondition = result.getValue();
    expect(medicalCondition).to.be.instanceOf(MedicalCondition);
    expect(medicalCondition.id).to.equal(uniqueId);
    expect(medicalCondition.medicalConditionId.value).to.equal('C001');
    expect(medicalCondition.designation.value).to.equal('Diabetes');
    expect(medicalCondition.description.value).to.equal('A chronic condition that affects insulin regulation.');
    expect(medicalCondition.commonSymptoms.value).to.deep.equal(['Increased thirst', 'Frequent urination']);
  });

  it('should fail to create a MedicalCondition if required fileds are empty', () => {
    const invalidProps = {
      ...validProps,
      medicalConditionId: null, designation: null, commonSymptoms: null,
    };
    const result = MedicalCondition.create(invalidProps);
    expect(result.isFailure).to.be.true;
    expect(result.error).to.equal('code is null or undefined');
  });

  it('should correctly return all attributes through getters', () => {
    const result = MedicalCondition.create(validProps, uniqueId);
    const medicalCondition = result.getValue();

    expect(medicalCondition.medicalConditionId.value).to.equal('C001');
    expect(medicalCondition.designation.value).to.equal('Diabetes');
    expect(medicalCondition.description.value).to.equal('A chronic condition that affects insulin regulation.');
    expect(medicalCondition.commonSymptoms.value).to.deep.equal(['Increased thirst', 'Frequent urination']);
  });
});
