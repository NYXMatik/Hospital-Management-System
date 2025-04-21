import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Result } from '../../../src/core/logic/Result';
import IMedicalConditionService from '../../../src/services/IServices/IMedicalConditionService';
import MedicalConditionController from '../../../src/controllers/MedicalConditionController';
import { IMedicalConditionDTO, IMedicalConditionUpdateDTO } from '../../../src/dto/IMedicalConditionDTO';

describe('MedicalConditionController', function () {
  let medicalConditionServiceInstance: sinon.SinonStubbedInstance<IMedicalConditionService>;
  let controller: MedicalConditionController;

  beforeEach(function () {
    medicalConditionServiceInstance = sinon.createStubInstance<IMedicalConditionService>(MedicalConditionController); 
    medicalConditionServiceInstance.updateMedicalCondition = sinon.stub(); // Stub explícito para o método updateMedicalCondition
    controller = new MedicalConditionController(medicalConditionServiceInstance as any);
  });

  // Teste para o método createMedicalCondition
  it('createMedicalCondition: should return created medical condition json with all fields', async function () {
    const createData: IMedicalConditionDTO = {
      code: '12345',
      designation: 'Flu',
      description: 'Influenza infection',
      commonSymptoms: ['Fever', 'Cough', 'Fatigue']
    };

    const req: Partial<Request> = { body: createData };
    const res: Partial<Response> = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };
    const next: Partial<NextFunction> = () => {};

    // Simulando o retorno do createMedicalCondition
    medicalConditionServiceInstance.createMedicalCondition.returns(Result.ok(createData));

    await controller.createMedicalCondition(<Request>req, <Response>res, <NextFunction>next);

    sinon.assert.calledWith(res.status, 201);
    sinon.assert.calledWith(res.json, sinon.match(createData));
  });

  it('createMedicalCondition: should return error if create fails', async function () {
    const createData: IMedicalConditionDTO = {
      code: '12345',
      designation: 'Flu',
      description: 'Influenza infection',
      commonSymptoms: ['Fever', 'Cough', 'Fatigue']
    };

    const req: Partial<Request> = { body: createData };
    const res: Partial<Response> = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };
    const next: Partial<NextFunction> = () => {};

    medicalConditionServiceInstance.createMedicalCondition.returns(Result.fail('Error creating condition'));

    await controller.createMedicalCondition(<Request>req, <Response>res, <NextFunction>next);

    sinon.assert.calledWith(res.status, 400);
    sinon.assert.calledWith(res.json, sinon.match({
      errors: { message: 'Error creating condition' }
    }));
  });

  // Teste para o método partialUpdateMedicalCondition
  it('partialUpdateMedicalCondition: should update medical condition with valid fields', async function () {
    const code = '12345';
    const updateData: IMedicalConditionUpdateDTO = {
      designation: 'Flu Updated',
      description: 'Updated Flu description'
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

    medicalConditionServiceInstance.updateMedicalCondition.returns(Result.ok(updateData));

    await controller.partialUpdateMedicalCondition(<Request>req, <Response>res, <NextFunction>next);

    sinon.assert.calledWith(res.status, 200);
    sinon.assert.calledWith(res.json, sinon.match({
      designation: updateData.designation,
      description: updateData.description
    }));
  });

  it('partialUpdateMedicalCondition: should return error if no fields are provided for update', async function () {
    const code = '12345';
    const updateData: IMedicalConditionUpdateDTO = {}; // Nenhum campo fornecido

    const req: Partial<Request> = { 
      params: { code },
      body: updateData
    };
    
    const res: Partial<Response> = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };
    const next: Partial<NextFunction> = () => {};

    await controller.partialUpdateMedicalCondition(<Request>req, <Response>res, <NextFunction>next);

    sinon.assert.calledWith(res.status, 400);
    sinon.assert.calledWith(res.json, sinon.match({
      message: 'At least one field (designation or description) must be provided.'
    }));
  });

  // Teste para o método searchMedicalConditions
  it('searchMedicalConditions: should return a list of medical conditions matching search criteria', async function () {
    const req: Partial<Request> = { 
      query: { code: '12345', designation: 'Flu' }
    };
    
    const res: Partial<Response> = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };
    const next: Partial<NextFunction> = () => {};

    const conditions = [{
      code: '12345',
      designation: 'Flu',
      description: 'Influenza infection',
      commonSymptoms: ['Fever', 'Cough', 'Fatigue']
    }];

    medicalConditionServiceInstance.searchMedicalConditions.returns(Result.ok(conditions));

    await controller.searchMedicalConditions(<Request>req, <Response>res, <NextFunction>next);

    sinon.assert.calledWith(res.status, 200);
    sinon.assert.calledWith(res.json, sinon.match(conditions));
  });

  it('searchMedicalConditions: should return error if no conditions are found', async function () {
    const req: Partial<Request> = { 
      query: { code: '12345', designation: 'Nonexistent' }
    };
    
    const res: Partial<Response> = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };
    const next: Partial<NextFunction> = () => {};

    medicalConditionServiceInstance.searchMedicalConditions.returns(Result.fail('No conditions found'));

    await controller.searchMedicalConditions(<Request>req, <Response>res, <NextFunction>next);

    sinon.assert.calledWith(res.status, 400);
    sinon.assert.calledWith(res.json, sinon.match({
      message: 'No conditions found'
    }));
  });
});