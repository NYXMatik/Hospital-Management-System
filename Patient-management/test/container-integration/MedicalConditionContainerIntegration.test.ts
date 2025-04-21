import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai'; 
import { Request, Response } from 'express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import MedicalConditionController from '../../src/controllers/MedicalConditionController';
import MedicalConditionService from '../../src/services/MedicalConditionService';
import MedicalConditionRepo from '../../src/repos/MedicalConditionRepo';
import MedicalConditionSchema from '../../src/persistence/schemas/MedicalConditionSchema';
import { Logger } from 'winston';


chai.use(sinonChai); // Register sinon-chai as plugin


describe('Medical Condition Container Integration Test', function () {
    let mongoServer: MongoMemoryServer;
    let medicalConditionRepo: MedicalConditionRepo;
    let medicalConditionService: MedicalConditionService;
    let medicalConditionController: MedicalConditionController;
    let request: Partial<Request>;
    let response: Partial<Response>;

    beforeEach(async function () {
        this.timeout(60000); 
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        mongoose.set('strictQuery', false);

        await mongoose.connect(uri);

        const loggerStub = sinon.createStubInstance(Logger);

        medicalConditionRepo = new MedicalConditionRepo(MedicalConditionSchema, loggerStub);
        medicalConditionService = new MedicalConditionService(medicalConditionRepo);
        medicalConditionController = new MedicalConditionController(medicalConditionService);

        // Medical condition created for testing
        const condition = new MedicalConditionSchema({
            code: 'A122',
            designation: 'Test Condition A',
            description: 'A condition used for testing purposes.',
            commonSymptoms: ['fever', 'headache'],
        });
        await condition.save();

        // Request for medical condition for testing
        request = {
            body: {
                code: 'A123',
                designation: 'Test Condition',
                description: 'A condition used for testing purposes.',
                commonSymptoms: ['fever', 'headache']
            }
        };

        response = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis()
        };
    });

    afterEach(async function () {
        sinon.restore();
        if (mongoServer) {
            await mongoServer.stop();
        }
        await mongoose.disconnect();
    });

    it('should create a medical condition successfully', async function () {
        await medicalConditionController.createMedicalCondition(request as Request, response as Response, () => {});

        //Check the returned status code
        expect(response.status).to.have.been.calledWith(201);
    
        const condition = await medicalConditionRepo.findByCode('A123');
    
        // Check if the created condition as the correct parameters
        expect(condition).to.not.be.null;
        expect(condition?.medicalConditionId.value).to.equal('A123');
        expect(condition?.designation.value).to.equal('Test Condition');
        expect(condition?.description.value).to.equal('A condition used for testing purposes.');
        expect(condition?.commonSymptoms.value).to.deep.equal( [ 'fever', 'headache' ]);
    });
    

    it('should fail to create a duplicate medical condition', async function () {
        await medicalConditionController.createMedicalCondition(request as Request, response as Response, () => {});
        const duplicateRequest = {
            body: {
                code: 'A123',
                designation: 'Test Condition Duplicate',
                description: 'This should fail due to duplicate code.',
                commonSymptoms: ['fever', 'cough']
            }
        };

        await medicalConditionController.createMedicalCondition(duplicateRequest as Request, response as Response, () => {});
        
        //Check the returned status code
        expect(response.status).to.have.been.calledWith(400);

        // Check the error message
        expect(response.json).to.have.been.calledWith({
            errors: { message: 'Medical condition already exists.' }
        });
    });

    it('should update the medical condition successfully', async function () {

        await medicalConditionController.createMedicalCondition(request as Request, response as Response, () => {});
        expect(response.status).to.have.been.calledWith(201);

        const updateRequest = sinon.stub<Request>();
        updateRequest.params = { code: 'A123' };
        updateRequest.body = {
            designation: 'Updated Test Condition',
            description: 'An updated condition used for testing purposes.'
        };
            
        await medicalConditionController.partialUpdateMedicalCondition(updateRequest as Request, response as Response, () => {});
        
        //Check the returned status code
        expect(response.status).to.have.been.calledWith(200);
    
        // Check if the updated condition as the correct parameters
        const condition = await medicalConditionRepo.findByCode('A123');
        expect(condition).to.not.be.null;
        expect(condition?.designation.value).to.equal('Updated Test Condition');
        expect(condition?.description.value).to.equal('An updated condition used for testing purposes.');
    });
    
    
    it('should fail to update a non-existent medical condition', async function () {

        await medicalConditionController.createMedicalCondition(request as Request, response as Response, () => {});
        expect(response.status).to.have.been.calledWith(201);

        const updateRequest = sinon.stub<Request>();
        updateRequest.params = { code: 'NonExistentCode' };
        updateRequest.body = {
            designation: 'Non-existent Test Condition',
            description: 'This update should fail.'
        };
    
        await medicalConditionController.partialUpdateMedicalCondition(updateRequest as Request, response as Response, () => {});
    
        //Check the returned status code
        expect(response.status).to.have.been.calledWith(400);

        // Check the error message
        expect(response.json).to.have.been.calledWith({
            message: 'Medical condition not found'
        });
    });
    
    it('should fail to update with invalid fields', async function () {
        await medicalConditionController.createMedicalCondition(request as Request, response as Response, () => {});
        expect(response.status).to.have.been.calledWith(201);

        const invalidUpdateRequest = sinon.stub<Request>();
        invalidUpdateRequest.params = { code: 'A123' };
        invalidUpdateRequest.body = {};
    
        await medicalConditionController.partialUpdateMedicalCondition(invalidUpdateRequest as Request, response as Response, () => {});
    
        //Check the returned status code
        expect(response.status).to.have.been.calledWith(400);

        // Check the error message
        expect(response.json).to.have.been.calledWith({
            message: 'At least one field (designation or description) must be provided.'
        });
    });


    it('should return medical conditions matching the code', async function () {
        
        request.query = { code: 'A122' };
        await medicalConditionController.searchMedicalConditions(request as Request, response as Response, () => {});
    
        //Check the returned status code
        expect(response.status).to.have.been.calledWith(200);
        
        // Check if the response contains the set of conditions
        expect(response.json).to.have.been.calledWithMatch([{
          code: 'A122',
          designation: 'Test Condition A',
          description: 'A condition used for testing purposes.',
          commonSymptoms: ['fever', 'headache'],
        }]);
      });
    
      it('should return 400 if no conditions are found for the search', async function () {
        
        request.query = { code: 'NonExistentCode' };
        await medicalConditionController.searchMedicalConditions(request as Request, response as Response, () => {});
    
        //Check the returned status code
        expect(response.status).to.have.been.calledWith(400);
    
        // Check the error message
        expect(response.json).to.have.been.calledWith({
          message: 'Medical conditions not found.'
        });
      });
    
      it('should return all conditions if no parameters are provided', async function () {
        
        request.query = {};
        await medicalConditionController.searchMedicalConditions(request as Request, response as Response, () => {});
    
        //Check the returned status code
        expect(response.status).to.have.been.calledWith(200);
        
        // Check if the response contains the set of conditions
        expect(response.json).to.have.been.calledWithMatch([{
          code: 'A122',
          designation: 'Test Condition A',
          description: 'A condition used for testing purposes.',
          commonSymptoms: ['fever', 'headache'],
        }]);
      });
    
});