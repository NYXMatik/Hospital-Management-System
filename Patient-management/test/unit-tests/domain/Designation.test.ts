import { expect } from 'chai';
import { Name } from '../../../src/domain/Name';

describe('Designation Value Object', () => {
  it('should create a valid Designation if the input is valid', () => {
    const result = Name.create('Valid Designation');
    expect(result.isSuccess).to.be.true;
    expect(result.getValue().value).to.equal('Valid Designation');
  });

  it('should fail to create a Designation if it is null or undefined', () => {
    const result = Name.create(null as unknown as string);
    expect(result.isFailure).to.be.true;
    expect(result.error).to.equal('name is null or undefined');
  });

  it('should fail to create a Designation if it contains only whitespace', () => {
    const result = Name.create('     ');
    expect(result.isFailure).to.be.true;
    expect(result.error).to.equal('Designation cannot be empty or just whitespace.');
  });

  it('should fail to create a Designation if it contains less than 5 characters', () => {
    const result = Name.create('abcd');
    expect(result.isFailure).to.be.true;
    expect(result.error).to.equal('Designation must be between 5 and 50 characters.');
  });

  it('should fail to create a Designation if it contains more than 50 characters', () => {
    const longName = 'a'.repeat(51);
    const result = Name.create(longName);
    expect(result.isFailure).to.be.true;
    expect(result.error).to.equal('Designation must be between 5 and 50 characters.');
  });

  it('should fail to create a Designation if it contains invalid characters', () => {
    const result = Name.create('Invalid@Designation');
    expect(result.isFailure).to.be.true;
    expect(result.error).to.equal('Designation must contain at least one letter and may include alphanumeric characters (letters, numbers), spaces, hyphens (-), and parentheses.');
  });

  it('should allow a Designation with spaces and alphanumeric characters', () => {
    const result = Name.create('Name 123');
    expect(result.isSuccess).to.be.true;
    expect(result.getValue().value).to.equal('Name 123');
  });
});
