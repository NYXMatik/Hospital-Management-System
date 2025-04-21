import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Result } from '../../../src/core/logic/Result';
import IAllergyService from '../../../src/services/IServices/IAllergyService';
import AllergyController from '../../../src/controllers/AllergyController';
import { IAllergyDTO, IAllergyUpdateDTO } from '../../../src/dto/IAllergyDTO';

describe('AllergyController', function () {
  let allergyServiceInstance: sinon.SinonStubbedInstance<IAllergyService>;
  let controller: AllergyController;

  beforeEach(function () {
    allergyServiceInstance = sinon.createStubInstance<IAllergyService>(AllergyController); 
    allergyServiceInstance.updateAllergy = sinon.stub(); // Stub explícito para o método updateAllergy
    controller = new AllergyController(allergyServiceInstance as any);
  });

  // Teste para o método createAllergy
  it('createAllergy: should return created allergy json with all fields', async function () {
    const createData: IAllergyDTO = {
      code: '12345',
      designation: 'Lactose',
      description: 'Intolerância à lactose (leite, iogurtes, manteiga, queijo, etc.)'
    };

    const req: Partial<Request> = { body: createData };
    const res: Partial<Response> = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };
    const next: Partial<NextFunction> = () => {};

    // Simulando o retorno do createAllergy
    allergyServiceInstance.createAllergy.returns(Result.ok(createData));

    await controller.createAllergy(<Request>req, <Response>res, <NextFunction>next);

    sinon.assert.calledWith(res.status, 201);
    sinon.assert.calledWith(res.json, sinon.match(createData));
  });

  it('createAllergy: should return error if create fails', async function () {
    const createData: IAllergyDTO = {
      code: '12345',
      designation: 'Lactose',
      description: 'Intolerância à lactose'
    };

    const req: Partial<Request> = { body: createData };
    const res: Partial<Response> = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };
    const next: Partial<NextFunction> = () => {};

    allergyServiceInstance.createAllergy.returns(Result.fail('Error creating allergy'));

    await controller.createAllergy(<Request>req, <Response>res, <NextFunction>next);

    sinon.assert.calledWith(res.status, 400);
    sinon.assert.calledWith(res.json, sinon.match({
      errors: { message: 'Error creating allergy' }
    }));
  });

  // Teste para o método partialUpdateAllergy
  it('partialUpdateAllergy: should update allergy with valid fields', async function () {
    const code = '12345';
    const updateData: IAllergyUpdateDTO = {
      designation: 'Lactose Updated',
      description: 'Updated Lactose description'
    };

    const req: Partial<Request> = { 
      params: { code },
      body: updateData
    };
    
    const res: Partial<Response> = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };
    const next: Partial<NextFunction> = () => {};

    allergyServiceInstance.updateAllergy.returns(Result.ok(updateData));

    await controller.partialUpdateAllergy(<Request>req, <Response>res, <NextFunction>next);

    sinon.assert.calledWith(res.status, 200);
    sinon.assert.calledWith(res.json, sinon.match({
      designation: updateData.designation,
      description: updateData.description
    }));
  });

  it('partialUpdateAllergy: should return error if no fields are provided for update', async function () {
    const code = '12345';
    const updateData: IAllergyUpdateDTO = {}; // Nenhum campo fornecido

    const req: Partial<Request> = { 
      params: { code },
      body: updateData
    };
    
    const res: Partial<Response> = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };
    const next: Partial<NextFunction> = () => {};

    await controller.partialUpdateAllergy(<Request>req, <Response>res, <NextFunction>next);

    sinon.assert.calledWith(res.status, 400);
    sinon.assert.calledWith(res.json, sinon.match({
      message: 'At least one field (designation or description) must be provided.'
    }));
  });

  // Teste para o método searchAllergies
  it('searchAllergies: should return a list of allergies matching search criteria', async function () {
    const req: Partial<Request> = { 
      query: { code: '12345', designation: 'Lactose' }
    };
    
    const res: Partial<Response> = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };
    const next: Partial<NextFunction> = () => {};

    const allergies = [{
      code: '12345',
      designation: 'Lactose',
      description: 'Intolerância à lactose (leite, iogurtes, manteiga, queijo, etc.)'    }];

    allergyServiceInstance.searchAllergies.returns(Result.ok(allergies));

    await controller.searchAllergies(<Request>req, <Response>res, <NextFunction>next);

    sinon.assert.calledWith(res.status, 200);
    sinon.assert.calledWith(res.json, sinon.match(allergies));
  });

  it('searchAllergies: should return error if no allergies are found', async function () {
    const req: Partial<Request> = { 
      query: { code: '12345', designation: 'Nonexistent' }
    };
    
    const res: Partial<Response> = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };
    const next: Partial<NextFunction> = () => {};

    allergyServiceInstance.searchAllergies.returns(Result.fail('No allergies found'));

    await controller.searchAllergies(<Request>req, <Response>res, <NextFunction>next);

    sinon.assert.calledWith(res.status, 400);
    sinon.assert.calledWith(res.json, sinon.match({
      message: 'No allergies found'
    }));
  });
});