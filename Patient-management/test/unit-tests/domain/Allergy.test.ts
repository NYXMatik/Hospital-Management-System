import { expect } from 'chai';
import { Allergy } from '../../../src/domain/Allergy';
import { Code } from '../../../src/domain/Code';
import { Name } from '../../../src/domain/Name';
import { Description } from '../../../src/domain/Description';
import { UniqueEntityID } from '../../../src/core/domain/UniqueEntityID';

describe('Allergy Entity', () => {
  let validProps: any;
  let uniqueId: UniqueEntityID;

  beforeEach(() => {
    validProps = {
      allergyId: Code.create('A001').getValue(),
      designation: Name.create('Polen').getValue(),
      description: Description.create('Alergia ao Polen: provoca tosse e espirros').getValue(),
    };

    uniqueId = new UniqueEntityID();
  });

  it('should create a valid Allergy entity', () => {
    const result = Allergy.create(validProps, uniqueId);
    expect(result.isSuccess).to.be.true;

    const allergy = result.getValue();
    expect(allergy).to.be.instanceOf(Allergy);
    expect(allergy.id).to.equal(uniqueId);
    expect(allergy.allergyId.value).to.equal('A001');
    expect(allergy.designation.value).to.equal('Polen');
    expect(allergy.description.value).to.equal('Alergia ao Polen: provoca tosse e espirros');
  });

  it('should fail to create an Allergy if required fileds are empty', () => {
    const invalidProps = {
      ...validProps,
      allergyId: null, designation: null,
    };
    const result = Allergy.create(invalidProps);
    expect(result.isFailure).to.be.true;
    expect(result.error).to.equal('code is null or undefined');
  });

  it('should correctly return all attributes through getters', () => {
    const result = Allergy.create(validProps, uniqueId);
    const allergy = result.getValue();

    expect(allergy.allergyId.value).to.equal('A001');
    expect(allergy.designation.value).to.equal('Polen');
    expect(allergy.description.value).to.equal('Alergia ao Polen: provoca tosse e espirros');
  });
});
