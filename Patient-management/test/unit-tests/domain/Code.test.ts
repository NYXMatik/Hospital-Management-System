import { expect } from 'chai';
import { Code } from '../../../src/domain/Code';

describe('Code Value Object', () => {
  it('should create a valid Code if the input is valid', () => {
    const result = Code.create('Valid-Code_123');
    expect(result.isSuccess).to.be.true;
    expect(result.getValue().value).to.equal('Valid-Code_123');
  });

  it('should fail to create a Code if it is null or undefined', () => {
    const result = Code.create(null as unknown as string);
    expect(result.isFailure).to.be.true;
    expect(result.error).to.equal('code is null or undefined');
  });

  it('should fail to create a Code if it contains only whitespace', () => {
    const result = Code.create('     ');
    expect(result.isFailure).to.be.true;
    expect(result.error).to.equal('Code cannot be empty or just whitespace.');
  });

  it('should fail to create a Code if it contains invalid characters', () => {
    const result = Code.create('Invalid@Code!');
    expect(result.isFailure).to.be.true;
    expect(result.error).to.equal('Code must only contain alphanumeric characters (letters, numbers), spaces, and the following special characters: -, _, ., :.');
  });

  it('should allow a Code with alphanumeric characters and permitted special characters', () => {
    const result = Code.create('Alpha_12:3-Beta');
    expect(result.isSuccess).to.be.true;
    expect(result.getValue().value).to.equal('Alpha_12:3-Beta');
  });

  it('should fail to create a Code if it is empty', () => {
    const result = Code.create('');
    expect(result.isFailure).to.be.true;
    expect(result.error).to.equal('Code cannot be empty or just whitespace.');
  });
});
