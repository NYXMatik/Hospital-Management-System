/*import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai'; // Plugin para facilitar as verificações
import { Request, Response } from 'express';
import MedicalConditionController from '../../src/controllers/MedicalConditionController';
import MedicalConditionService from '../../src/services/MedicalConditionService';
import MedicalConditionRepo from '../../src/repos/MedicalConditionRepo';

//chai.use(sinonChai);

describe('MedicalConditionController Unit Integration Test', function () {
    let medicalConditionRepoMock: sinon.SinonStubbedInstance<MedicalConditionRepo>;
    let medicalConditionService: MedicalConditionService;
    let medicalConditionController: MedicalConditionController;
    let request: Partial<Request>;
    let response: Partial<Response>;

    beforeEach(function () {
        medicalConditionRepoMock = sinon.createStubInstance(MedicalConditionRepo);
        medicalConditionService = new MedicalConditionService(medicalConditionRepoMock);
        medicalConditionController = new MedicalConditionController(medicalConditionService);

        request = {
            body: {
                code: 'A123',
                designation: 'Test Condition',
                description: 'A condition used for testing purposes.',
                commonSymptoms: ['fever', 'headache'],
            },
        };

        response = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis(),
        };
    });

    afterEach(function () {
        sinon.restore(); // Restaura os mocks
    });

    it('should call the service to create a medical condition and return 201', async function () {
        medicalConditionRepoMock.findByCode.resolves(null); // Simula que o código não existe
        medicalConditionRepoMock.create.resolves({
            code: 'A123',
            designation: 'Test Condition',
            description: 'A condition used for testing purposes.',
            commonSymptoms: ['fever', 'headache'],
        });

        await medicalConditionController.createMedicalCondition(request as Request, response as Response, () => {});

        // Verifica se o método foi chamado
        expect(medicalConditionRepoMock.findByCode).to.have.been.calledOnceWith('A123');
        expect(medicalConditionRepoMock.create).to.have.been.calledOnce;
        expect(response.status).to.have.been.calledWith(201);
    });

    it('should return 400 if the medical condition already exists', async function () {
        medicalConditionRepoMock.findByCode.resolves({
            code: 'A123',
            designation: 'Test Condition',
            description: 'A condition used for testing purposes.',
            commonSymptoms: ['fever', 'headache'],
        });

        await medicalConditionController.createMedicalCondition(request as Request, response as Response, () => {});

        // Verifica se o método foi chamado corretamente
        expect(medicalConditionRepoMock.findByCode).to.have.been.calledOnceWith('A123');
        expect(response.status).to.have.been.calledWith(400);
        expect(response.json).to.have.been.calledWith({
            errors: { message: 'Medical condition already exists.' },
        });
    });
});*/



/*import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai'; // Plugin para facilitar as verificações
import { Request, Response } from 'express';
import MedicalConditionController from '../../src/controllers/MedicalConditionController';
import MedicalConditionService from '../../src/services/MedicalConditionService';
import MedicalConditionRepo from '../../src/repos/MedicalConditionRepo';

chai.use(sinonChai);

describe('Medical Condition Unit Integration Test', function () {
    let medicalConditionRepoMock: sinon.SinonStubbedInstance<MedicalConditionRepo>;
    let medicalConditionService: MedicalConditionService;
    let medicalConditionController: MedicalConditionController;
    let request: Partial<Request>;
    let response: Partial<Response>;

    beforeEach(function () {
        // Mocka o repositório
        medicalConditionRepoMock = sinon.createStubInstance(MedicalConditionRepo);
        medicalConditionService = new MedicalConditionService(medicalConditionRepoMock);
        medicalConditionController = new MedicalConditionController(medicalConditionService);

        request = {
            body: {
                code: 'A123',
                designation: 'Test Condition',
                description: 'A condition used for testing purposes.',
                commonSymptoms: ['fever', 'headache'],
            },
        };

        response = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis(),
        };
    });

    afterEach(function () {
        sinon.restore(); // Restaura os mocks
    });

    it('should call the service to create a medical condition and return 201', async function () {
        // Simula o comportamento do repositório mockado
        medicalConditionRepoMock.findByCode.resolves(null); // Retorna null indicando que o código é único
        medicalConditionRepoMock.create.resolves({
            code: 'A123',
            designation: 'Test Condition',
            description: 'A condition used for testing purposes.',
            commonSymptoms: ['fever', 'headache'],
        });

        await medicalConditionController.createMedicalCondition(request as Request, response as Response, () => {});

        expect(medicalConditionRepoMock.findByCode).to.have.been.calledOnceWith('A123');
        expect(medicalConditionRepoMock.create).to.have.been.calledOnce;
        expect(response.status).to.have.been.calledWith(201);
    });

    it('should return 400 if the medical condition already exists', async function () {
        // Simula que o código já existe
        medicalConditionRepoMock.findByCode.resolves({
            code: 'A123',
            designation: 'Test Condition',
            description: 'A condition used for testing purposes.',
            commonSymptoms: ['fever', 'headache'],
        });

        await medicalConditionController.createMedicalCondition(request as Request, response as Response, () => {});

        expect(medicalConditionRepoMock.findByCode).to.have.been.calledOnceWith('A123');
        expect(response.status).to.have.been.calledWith(400);
        expect(response.json).to.have.been.calledWith({
            errors: { message: 'Medical condition already exists.' },
        });
    });
});*/
