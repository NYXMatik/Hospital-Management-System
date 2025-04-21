import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai'; 
import { Request, Response } from 'express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import AllergyController from '../../src/controllers/AllergyController';
import AllergyService from '../../src/services/AllergyService';
import AllergyRepo from '../../src/repos/AllergyRepo';
import AllergySchema from '../../src/persistence/schemas/AllergySchema';
import { Logger } from 'winston';


chai.use(sinonChai); // Register sinon-chai as plugin


describe('Allergy Container Integration Test', function () {
    let mongoServer: MongoMemoryServer;
    let allergyRepo: AllergyRepo;
    let allergyService: AllergyService;
    let allergyController: AllergyController;
    let request: Partial<Request>;
    let response: Partial<Response>;

    beforeEach(async function () {
        this.timeout(60000); 
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        mongoose.set('strictQuery', false);

        await mongoose.connect(uri);

        const loggerStub = sinon.createStubInstance(Logger);

        allergyRepo = new AllergyRepo(AllergySchema, loggerStub);
        allergyService = new AllergyService(allergyRepo);
        allergyController = new AllergyController(allergyService);

        // allergy created for testing
        const allergy = new AllergySchema({
            code: 'A122',
            designation: 'Test Allergy A',
            description: 'An allergy used for testing purposes.'
        });
        await allergy.save();

        // Request for allergy for testing
        request = {
            body: {
                code: 'A123',
                designation: 'Test Allergy',
                description: 'An allergy used for testing purposes.'
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

    it('should create an allergy successfully', async function () {
        await allergyController.createAllergy(request as Request, response as Response, () => {});

        //Check the returned status code
        expect(response.status).to.have.been.calledWith(201);
    
        const allergy = await allergyRepo.findByCode('A123');
    
        // Check if the created allergy as the correct parameters
        expect(allergy).to.not.be.null;
        expect(allergy?.allergyId.value).to.equal('A123');
        expect(allergy?.designation.value).to.equal('Test Allergy');
        expect(allergy?.description.value).to.equal('An allergy used for testing purposes.');
    });
    

    it('should fail to create a duplicate allergy', async function () {
        await allergyController.createAllergy(request as Request, response as Response, () => {});
        const duplicateRequest = {
            body: {
                code: 'A123',
                designation: 'Test Allergy Duplicate',
                description: 'This should fail due to duplicate code.'
            }
        };

        await allergyController.createAllergy(duplicateRequest as Request, response as Response, () => {});
        
        //Check the returned status code
        expect(response.status).to.have.been.calledWith(400);

        // Check the error message
        expect(response.json).to.have.been.calledWith({
            errors: { message: 'Allergy already exists.' }
        });
    });

    it('should update the allergy successfully', async function () {

        await allergyController.createAllergy(request as Request, response as Response, () => {});
        expect(response.status).to.have.been.calledWith(201);

        const updateRequest = sinon.stub<Request>();
        updateRequest.params = { code: 'A123' };
        updateRequest.body = {
            designation: 'Updated Test Allergy',
            description: 'An updated allergy used for testing purposes.'
        };
            
        await allergyController.partialUpdateAllergy(updateRequest as Request, response as Response, () => {});
        
        //Check the returned status code
        expect(response.status).to.have.been.calledWith(200);
    
        // Check if the updated allergy as the correct parameters
        const allergy = await allergyRepo.findByCode('A123');
        expect(allergy).to.not.be.null;
        expect(allergy?.designation.value).to.equal('Updated Test Allergy');
        expect(allergy?.description.value).to.equal('An updated allergy used for testing purposes.');
    });
    
    
    it('should fail to update a non-existent allergy', async function () {

        await allergyController.createAllergy(request as Request, response as Response, () => {});
        expect(response.status).to.have.been.calledWith(201);

        const updateRequest = sinon.stub<Request>();
        updateRequest.params = { code: 'NonExistentCode' };
        updateRequest.body = {
            designation: 'Non-existent Test Condition',
            description: 'This update should fail.'
        };
    
        await allergyController.partialUpdateAllergy(updateRequest as Request, response as Response, () => {});
    
        //Check the returned status code
        expect(response.status).to.have.been.calledWith(400);

        // Check the error message
        expect(response.json).to.have.been.calledWith({
            message: 'Allergy not found'
        });
    });
    
    it('should fail to update with invalid fields', async function () {
        await allergyController.createAllergy(request as Request, response as Response, () => {});
        expect(response.status).to.have.been.calledWith(201);

        const invalidUpdateRequest = sinon.stub<Request>();
        invalidUpdateRequest.params = { code: 'A123' };
        invalidUpdateRequest.body = {};
    
        await allergyController.partialUpdateAllergy(invalidUpdateRequest as Request, response as Response, () => {});
    
        //Check the returned status code
        expect(response.status).to.have.been.calledWith(400);

        // Check the error message
        expect(response.json).to.have.been.calledWith({
            message: 'At least one field (designation or description) must be provided.'
        });
    });


    it('should return allergy matching the code', async function () {
        
        request.query = { code: 'A122' };
        await allergyController.searchAllergies(request as Request, response as Response, () => {});
    
        //Check the returned status code
        expect(response.status).to.have.been.calledWith(200);
        
        // Check if the response contains the set of conditions
        expect(response.json).to.have.been.calledWithMatch([{
          code: 'A122',
          designation: 'Test Allergy A',
          description: 'An allergy used for testing purposes.'
        }]);
      });
    
      it('should return 400 if no allergies are found for the search', async function () {
        
        request.query = { code: 'NonExistentCode' };
        await allergyController.searchAllergies(request as Request, response as Response, () => {});
    
        //Check the returned status code
        expect(response.status).to.have.been.calledWith(400);
    
        // Check the error message
        expect(response.json).to.have.been.calledWith({
          message: 'Allergy not found.'
        });
      });
    
      it('should return all allergies if no parameters are provided', async function () {
        
        request.query = {};
        await allergyController.searchAllergies(request as Request, response as Response, () => {});
    
        //Check the returned status code
        expect(response.status).to.have.been.calledWith(200);
        
        // Check if the response contains the set of conditions
        expect(response.json).to.have.been.calledWithMatch([{
          code: 'A122',
          designation: 'Test Allergy A',
          description: 'An allergy used for testing purposes.'
        }]);
      });
    
});