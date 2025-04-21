import { expect } from "chai";
import sinon from "sinon";
import "reflect-metadata";

import MedicalConditionRepo from "../../../src/repos/MedicalConditionRepo";
import MedicalConditionService from "../../../src/services/MedicalConditionService";
import { Result } from "../../../src/core/logic/Result";
import { IMedicalConditionDTO } from "../../../src/dto/IMedicalConditionDTO";
import { Code } from "../../../src/domain/Code";
import { Name } from "../../../src/domain/Name";
import { Description } from "../../../src/domain/Description";
import { CommonSymptoms } from "../../../src/domain/CommonSymptoms";

describe("Medical Condition Service - Repo Integration Unit Test", () => {
  let conditionRepoStub: sinon.SinonStubbedInstance<MedicalConditionRepo>;
  let conditionService: MedicalConditionService;

  beforeEach(() => {
    // Criar um stub para o repo
    conditionRepoStub = sinon.createStubInstance(MedicalConditionRepo);

    // Injetar o stub no serviço
    conditionService = new MedicalConditionService(conditionRepoStub as any);
  });

  afterEach(() => {
    sinon.restore(); // Restaura mocks/stubs após cada teste
  });

  it("should successfully create a new Medical Condition", async () => {
    const conditionDTO: IMedicalConditionDTO = {
      code: 'A122',
      designation: 'Test Condition',
      description: 'A condition used for testing purposes.',
      commonSymptoms: ['fever', 'headache']
    };

    // Configura o comportamento esperado do repo
    conditionRepoStub.save.resolves(Result.ok<any>(conditionDTO));

    const result = await conditionService.createMedicalCondition(conditionDTO);

    expect(result.isSuccess).to.be.true;
    expect(result.getValue()).to.deep.equal(conditionDTO);
    sinon.assert.calledOnce(conditionRepoStub.save);
  });

  it("should fail to create an existing Medical Condition", async () => {
    const conditionDTO: IMedicalConditionDTO = {
      code: 'A122',
      designation: 'Test Condition',
      description: 'A condition used for testing purposes.',
      commonSymptoms: ['fever', 'headache']
    };

    // Configura o comportamento esperado do repo
    conditionRepoStub.save.resolves(Result.fail("Medical Condition already exists."));

    const result = await conditionService.createMedicalCondition(conditionDTO);

    expect(result.isFailure).to.be.true;
    expect(result.errorValue()).to.equal("Medical Condition already exists.");
    sinon.assert.calledOnce(conditionRepoStub.save);
  });

  it("should fail to create a Medical Condition with invalid data", async () => {
    const invalidConditionDTO = {
      code: "", // Código inválido
      designation: "Test Condition B",
      description: "",
      commonSymptoms: ['fever', 'headache'],
    };
  
    const result = await conditionService.createMedicalCondition(invalidConditionDTO);
  
    expect(result.isFailure).to.be.true;
    expect(result.errorValue()).to.include("Code cannot be empty or just whitespace");
    sinon.assert.notCalled(conditionRepoStub.save);
  });
  

  it("should successfully update an existing Medical Condition", async () => {
    const code = "A122";
    const updateData = {
      designation: "Updated Test Condition",
      description: "Updated description for testing purposes.",
    };
  
    const existingCondition ={
      medicalConditionId: { value: "A122" },
      designation: { value: "Test Condition" },
      description: { value: "A condition used for testing purposes." },
      commonSymptoms: { value: ["fever", "headache"]},
    };
  
    // Simula a busca por código
    conditionRepoStub.findByCode.resolves(existingCondition);
  
    // Simula o update no repositório
    conditionRepoStub.update.resolves(Result.ok<any>(existingCondition));
  
    const result = await conditionService.updateMedicalCondition(code, updateData);
  
    expect(result.isSuccess).to.be.true;
    
    sinon.assert.calledOnce(conditionRepoStub.findByCode);
    sinon.assert.calledOnce(conditionRepoStub.update);
  });

  it("should fail to update a non-existent Medical Condition", async () => {
    const code = "A999";
    const updateData = {
      designation: "Non-existent Condition",
    };
  
    // Simula um resultado nulo ao buscar por código
    conditionRepoStub.findByCode.resolves(null);
  
    const result = await conditionService.updateMedicalCondition(code, updateData);
  
    expect(result.isFailure).to.be.true;
    expect(result.errorValue()).to.equal("Medical condition not found");
    sinon.assert.calledOnce(conditionRepoStub.findByCode);
    sinon.assert.notCalled(conditionRepoStub.update);
  });
  
  it("should return Medical Conditions filtered by code", async () => {
    const code = "A001";
  
    const conditions = [
      {
        medicalConditionId: { value: "A001" },
        designation: { value: "Condition test" },
        description: { value: "Condition description for testing" },
        commonSymptoms: { value: ["fever", "headache"]},
      },
    ];
  
    // Simula a busca no repositório
    conditionRepoStub.searchMedicalConditions.resolves(conditions);
  
    const result = await conditionService.searchMedicalConditions(code);
  
    expect(result.isSuccess).to.be.true;
    expect(result.getValue()).to.have.length(1);
    expect(result.getValue()[0]).to.deep.include({
      code: "A001",
      designation: "Condition test",
      description: "Condition description for testing",
      commonSymptoms: ['fever', 'headache'],
    });
    sinon.assert.calledOnce(conditionRepoStub.searchMedicalConditions);
  });

  it("should return Medical Conditions filtered by designation", async () => {
    const designation = "Condition test";
  
    const conditions = [
      {
        medicalConditionId: { value: "A001" },
        designation: { value: "Condition test" },
        description: { value: "Condition description for testing" },
        commonSymptoms: { value: ["fever", "headache"]},
      },
    ];
  
    // Simula a busca no repositório
    conditionRepoStub.searchMedicalConditions.resolves(conditions);
  
    const result = await conditionService.searchMedicalConditions(undefined, designation);
  
    expect(result.isSuccess).to.be.true;
    expect(result.getValue()).to.have.length(1);
    expect(result.getValue()[0]).to.deep.include({
      code: "A001",
      designation: "Condition test",
      description: "Condition description for testing",
      commonSymptoms: ['fever', 'headache'],
    });
    sinon.assert.calledOnce(conditionRepoStub.searchMedicalConditions);
  });

  it("should fail when no Medical Conditions are found", async () => {
    const code = "A999";
  
    // Simula uma resposta vazia no repositório
    conditionRepoStub.searchMedicalConditions.resolves([]);
  
    const result = await conditionService.searchMedicalConditions(code);
  
    expect(result.isFailure).to.be.true;
    expect(result.errorValue()).to.equal("Medical conditions not found.");
    sinon.assert.calledOnce(conditionRepoStub.searchMedicalConditions);
  });

  it("should fail when repo throws an exception", async () => {
    const conditionDTO: IMedicalConditionDTO = {
      code: "A001",
      designation: "Peanut Allergy",
      description: "Severe reaction to peanuts",
      commonSymptoms: ['fever', 'headache'],
    };

    // Simula um erro no repo
    conditionRepoStub.save.rejects(new Error("Database connection failed"));

    try {
      await conditionService.createMedicalCondition(conditionDTO);
    } catch (err) {
      expect(err.message).to.equal("Database connection failed");
      sinon.assert.calledOnce(conditionRepoStub.save);
    }
  });
});
