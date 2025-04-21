import { expect } from "chai";
import sinon from "sinon";
import "reflect-metadata";

import AllergyRepo from "../../../src/repos/AllergyRepo";
import AllergyService from "../../../src/services/AllergyService";
import { Result } from "../../../src/core/logic/Result";
import { IAllergyDTO } from "../../../src/dto/IAllergyDTO";
import { Code } from "../../../src/domain/Code";
import { Name } from "../../../src/domain/Name";
import { Description } from "../../../src/domain/Description";

describe("AllergyService - Integration Unit Test", () => {
  let allergyRepoStub: sinon.SinonStubbedInstance<AllergyRepo>;
  let allergyService: AllergyService;

  beforeEach(() => {
    // Criar um stub para o repo
    allergyRepoStub = sinon.createStubInstance(AllergyRepo);

    // Injetar o stub no serviço
    allergyService = new AllergyService(allergyRepoStub as any);
  });

  afterEach(() => {
    sinon.restore(); // Restaura mocks/stubs após cada teste
  });

  it("should successfully create a new allergy", async () => {
    const allergyDTO: IAllergyDTO = {
      code: "A001",
      designation: "Peanut Allergy",
      description: "Severe reaction to peanuts",
    };

    // Configura o comportamento esperado do repo
    allergyRepoStub.save.resolves(Result.ok<any>(allergyDTO));

    const result = await allergyService.createAllergy(allergyDTO);

    expect(result.isSuccess).to.be.true;
    expect(result.getValue()).to.deep.equal(allergyDTO);
    sinon.assert.calledOnce(allergyRepoStub.save);
  });

  it("should fail to create an existing allergy", async () => {
    const allergyDTO: IAllergyDTO = {
      code: "A001",
      designation: "Peanut Allergy",
      description: "Severe reaction to peanuts",
    };

    // Configura o comportamento esperado do repo
    allergyRepoStub.save.resolves(Result.fail("Allergy already exists."));

    const result = await allergyService.createAllergy(allergyDTO);

    expect(result.isFailure).to.be.true;
    expect(result.errorValue()).to.equal("Allergy already exists.");
    sinon.assert.calledOnce(allergyRepoStub.save);
  });

  it("should fail to create an allergy with invalid data", async () => {
    const invalidAllergyDTO = {
      code: "", // Código inválido
      designation: "Invalid Allergy",
      description: "",
    };
  
    const result = await allergyService.createAllergy(invalidAllergyDTO);
  
    expect(result.isFailure).to.be.true;
    expect(result.errorValue()).to.include("Code cannot be empty or just whitespace");
    sinon.assert.notCalled(allergyRepoStub.save);
  });
  

  it("should successfully update an existing allergy", async () => {
    const code = "A001";
    const updateData = {
      designation: "Updated Peanut Allergy",
      description: "Updated description for peanut allergy",
    };
  
    const existingAllergy = {
      allergyId: { value: code },
      designation: { value: "Peanut Allergy" },
      description: { value: "Severe reaction to peanuts" },
    };
  
    // Simula a busca por código
    allergyRepoStub.findByCode.resolves(existingAllergy);
  
    // Simula o update no repositório
    allergyRepoStub.update.resolves(Result.ok<any>(existingAllergy));
  
    const result = await allergyService.updateAllergy(code, updateData);
  
    expect(result.isSuccess).to.be.true;
    
    sinon.assert.calledOnce(allergyRepoStub.findByCode);
    sinon.assert.calledOnce(allergyRepoStub.update);
  });

  it("should fail to update a non-existent allergy", async () => {
    const code = "A999";
    const updateData = {
      designation: "Non-existent Allergy",
      description: "Trying to update an allergy that does not exist",
    };
  
    // Simula um resultado nulo ao buscar por código
    allergyRepoStub.findByCode.resolves(null);
  
    const result = await allergyService.updateAllergy(code, updateData);
  
    expect(result.isFailure).to.be.true;
    expect(result.errorValue()).to.equal("Allergy not found");
    sinon.assert.calledOnce(allergyRepoStub.findByCode);
    sinon.assert.notCalled(allergyRepoStub.update);
  });
  
  it("should return allergies filtered by code", async () => {
    const code = "A001";
  
    const allergies = [
      {
        allergyId: { value: "A001" },
        designation: { value: "Peanut Allergy" },
        description: { value: "Severe reaction to peanuts" },
      },
    ];
  
    // Simula a busca no repositório
    allergyRepoStub.searchAllergies.resolves(allergies);
  
    const result = await allergyService.searchAllergies(code);
  
    expect(result.isSuccess).to.be.true;
    expect(result.getValue()).to.have.length(1);
    expect(result.getValue()[0]).to.deep.include({
      code: "A001",
      designation: "Peanut Allergy",
      description: "Severe reaction to peanuts",
    });
    sinon.assert.calledOnce(allergyRepoStub.searchAllergies);
  });

  it("should return allergies filtered by designation", async () => {
    const designation = "Peanut";
  
    const allergies = [
      {
        allergyId: { value: "A001" },
        designation: { value: "Peanut Allergy" },
        description: { value: "Severe reaction to peanuts" },
      },
    ];
  
    // Simula a busca no repositório
    allergyRepoStub.searchAllergies.resolves(allergies);
  
    const result = await allergyService.searchAllergies(undefined, designation);
  
    expect(result.isSuccess).to.be.true;
    expect(result.getValue()).to.have.length(1);
    expect(result.getValue()[0]).to.deep.include({
      code: "A001",
      designation: "Peanut Allergy",
      description: "Severe reaction to peanuts",
    });
    sinon.assert.calledOnce(allergyRepoStub.searchAllergies);
  });

  it("should fail when no allergies are found", async () => {
    const code = "A999";
  
    // Simula uma resposta vazia no repositório
    allergyRepoStub.searchAllergies.resolves([]);
  
    const result = await allergyService.searchAllergies(code);
  
    expect(result.isFailure).to.be.true;
    expect(result.errorValue()).to.equal("Allergy not found.");
    sinon.assert.calledOnce(allergyRepoStub.searchAllergies);
  });

  it("should fail when repo throws an exception", async () => {
    const allergyDTO: IAllergyDTO = {
      code: "A001",
      designation: "Peanut Allergy",
      description: "Severe reaction to peanuts",
    };

    // Simula um erro no repo
    allergyRepoStub.save.rejects(new Error("Database connection failed"));

    try {
      await allergyService.createAllergy(allergyDTO);
    } catch (err) {
      expect(err.message).to.equal("Database connection failed");
      sinon.assert.calledOnce(allergyRepoStub.save);
    }
  });
});
