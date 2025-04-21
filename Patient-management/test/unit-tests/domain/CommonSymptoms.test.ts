import { expect } from 'chai';
import { CommonSymptoms } from '../../../src/domain/CommonSymptoms';

describe('CommonSymptoms Value Object', () => {
  it('should create a valid CommonSymptoms if the input is valid', () => {
    const result = CommonSymptoms.create(['Headache', 'Fever', 'Cough']);
    expect(result.isSuccess).to.be.true;
    expect(result.getValue().value).to.deep.equal(['Headache', 'Fever', 'Cough']);
  });

  it('should fail to create a CommonSymptoms if the input is null or undefined', () => {
    const result = CommonSymptoms.create(null as unknown as string[]);
    expect(result.isFailure).to.be.true;
    expect(result.error).to.equal('commonSymptoms is null or undefined');
  });

  it('should fail to create a CommonSymptoms if the symptoms array is empty', () => {
    const result = CommonSymptoms.create([]);
    expect(result.isFailure).to.be.true;
    expect(result.error).to.equal('A medical condition must have at least one common symptom.');
  });

  it('should fail to create a CommonSymptoms if it contains an empty symptom', () => {
    const result = CommonSymptoms.create(['Headache', '   ', 'Cough']);
    expect(result.isFailure).to.be.true;
    expect(result.error).to.equal('Symptoms cannot be empty or just whitespace.');
  });

  it('should create a CommonSymptoms even if it contains symptoms with leading or trailing spaces', () => {
    const result = CommonSymptoms.create([' Headache ', '  Fever ', 'Cough']);
    expect(result.isSuccess).to.be.true;
    expect(result.getValue().value).to.deep.equal([' Headache ', '  Fever ', 'Cough']);
  });

  it('should fail to create a CommonSymptoms if it contains a symptom with only whitespace', () => {
    const result = CommonSymptoms.create(['Headache', '    ', 'Fever']);
    expect(result.isFailure).to.be.true;
    expect(result.error).to.equal('Symptoms cannot be empty or just whitespace.');
  });
});
