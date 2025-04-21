import { expect } from 'chai';
import { Description } from '../../../src/domain/Description';

describe('Description Value Object', () => {
  it('should create a valid Description with a non-empty string', () => {
    const result = Description.create('A chronic condition');
    expect(result.isSuccess).to.be.true;

    const description = result.getValue();
    expect(description.value).to.equal('A chronic condition');
  });

  it('should allow creating a Description with a null value', () => {
    const result = Description.create(null);
    expect(result.isSuccess).to.be.true;

    const description = result.getValue();
    expect(description.value).to.equal('');
  });

  it('should allow creating a Description with an empty string', () => {
    const result = Description.create('');
    expect(result.isSuccess).to.be.true;

    const description = result.getValue();
    expect(description.value).to.equal('');
  });

  it('should fail to create a Description if it contains only whitespace', () => {
    const result = Description.create('    ');
    expect(result.isFailure).to.be.true;
    expect(result.error).to.equal('Description cannot be just whitespace.');
  });

  it('should fail to create a Description if it contains only numbers', () => {
    const result = Description.create('123456');
    expect(result.isFailure).to.be.true;
    expect(result.error).to.equal('Description cannot contain only numbers.');
  });

  it('should fail to create a Description if it is not a string or null', () => {
    const result = Description.create(123 as any);
    expect(result.isFailure).to.be.true;
    expect(result.error).to.equal('Description must be a string or empty.');
  });
});
