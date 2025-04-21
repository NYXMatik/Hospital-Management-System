import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import MedicalConditionController from '../../../src/controllers/MedicalConditionController';
import MedicalConditionService from '../../../src/services/MedicalConditionService';
import { Request, Response } from 'express';

chai.use(sinonChai); 

describe('Medical Condition Controller-Service Integration Unit Test', function () {
    let medicalConditionController: MedicalConditionController;
    let conditionServiceMock: sinon.SinonStubbedInstance<MedicalConditionService>;
    let request: Partial<Request>;
    let response: Partial<Response>;

    beforeEach(function () {
        // Criando mock do serviço
        conditionServiceMock = sinon.createStubInstance(MedicalConditionService);

        // Inicializando o controller com o serviço mockado
        medicalConditionController = new MedicalConditionController(conditionServiceMock);

        // Mocks de request e response
        request = {
            body: {
                code: 'A122',
                designation: 'Test Condition A',
                description: 'A condition used for testing purposes.',
                commonSymptoms: ['fever', 'headache'],
            }
        };

        response = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis()
        };
    });

    afterEach(function () {
        sinon.restore();
    });

    it('should successfully create an medical condition', async function () {
        // Setup do mock: quando o método createAllergy for chamado, simula um retorno bem-sucedido
        conditionServiceMock.createMedicalCondition.resolves({
            isFailure: false,
            getValue: () => ({
                code: 'A122',
                designation: 'Test Condition A',
                description: 'A condition used for testing purposes.',
                commonSymptoms: ['fever', 'headache']
            })
        });

        await medicalConditionController.createMedicalCondition(request as Request, response as Response, () => {});

        expect(response.status).to.have.been.calledWith(201);
        expect(response.json).to.have.been.calledWith({
            code: 'A122',
            designation: 'Test Condition A',
            description: 'A condition used for testing purposes.',
            commonSymptoms: ['fever', 'headache']
        });
    });

    it('should return error when medical condition already exists', async function () {
        // Setup do mock: quando o método createMedicalCondition for chamado, simula um erro de duplicação
        conditionServiceMock.createMedicalCondition.resolves({
            isFailure: true,
            errorValue: () => 'Medical Condition already exists.'
        });

        await medicalConditionController.createMedicalCondition(request as Request, response as Response, () => {});

        expect(response.status).to.have.been.calledWith(400);
        expect(response.json).to.have.been.calledWith({ errors: { message: 'Medical Condition already exists.' } });
    });

    it('should successfully update a medical condition', async function () {
        // Setup do mock: quando o método update for chamado, simula um retorno bem-sucedido
        conditionServiceMock.updateMedicalCondition.resolves({
            isFailure: false,
            getValue: () => ({
                code: 'A122',
                designation: 'Updated Condition',
                description: 'An updated condition used for testing purposes.',
                commonSymptoms: ['fever', 'headache']
            })
        });

        // Atualizando request para incluir params
        request = {
            ...request,
            params: { code: 'A122' }  // Adicionando o parâmetro `code` para o update
        };

        await medicalConditionController.partialUpdateMedicalCondition(request as Request, response as Response, () => {});

        expect(response.status).to.have.been.calledWith(200);
        expect(response.json).to.have.been.calledWith({
            code: 'A122',
            designation: 'Updated Condition',
            description: 'An updated condition used for testing purposes.',
            commonSymptoms: ['fever', 'headache']
        });
    });

    it('should return error when medical condition to update does not exist', async function () {
        // Setup do mock: quando o método update for chamado, simula um erro de não encontrado
        conditionServiceMock.updateMedicalCondition.resolves({
            isFailure: true,
            errorValue: () => 'Medical Condition not found.'
        });

        // Atualizando request para incluir params
        request = {
            ...request,
            params: { code: 'A122' }  // Adicionando o parâmetro `code` para o update
        };

        await medicalConditionController.partialUpdateMedicalCondition(request as Request, response as Response, () => {});

        expect(response.status).to.have.been.calledWith(400);
        expect(response.json).to.have.been.calledWith({ message: 'Medical Condition not found.' });
    });

    it('should return error when updating Medical Condition with invalid data', async function () {
        // Simula um corpo de requisição inválido
        request.body = { code: '', designation: '', description: '' };

        // Setup do mock: quando o método updateAllergy for chamado, simula um erro de validação
        conditionServiceMock.updateMedicalCondition.resolves({
            isFailure: true,
            errorValue: () => 'Invalid data provided.'
        });

        // Atualizando request para incluir params
        request = {
            ...request,
            params: { code: 'A122' }  // Adicionando o parâmetro `code` para o update
        };

        await medicalConditionController.partialUpdateMedicalCondition(request as Request, response as Response, () => {});

        expect(response.status).to.have.been.calledWith(400);
        expect(response.json).to.have.been.calledWith({ message: "At least one field (designation or description) must be provided." });
    });


    it('should successfully search medical conditions', async function () {
        // Simula uma lista de condições para a pesquisa
        const conditions = [
            { code: 'A122', designation: 'Test Condition', description: 'Test description 1', commonSymptoms: ['fever', 'headache'] },
            { code: 'A123', designation: 'Another Condition', description: 'Test description 2', commonSymptoms: ['fever', 'headache'] }
        ];

        // Setup do mock: quando o método searchMedicalConditions for chamado, simula uma resposta bem-sucedida
        conditionServiceMock.searchMedicalConditions.resolves({
            isFailure: false,
            getValue: () => conditions
        });

        // Atualizando request para incluir query (parâmetros de pesquisa)
        request = {
            ...request,
            query: { code: 'A123' }  // Adicionando o parâmetro `code` para a pesquisa
        };

        await medicalConditionController.searchMedicalConditions(request as Request, response as Response, () => {});

        expect(response.status).to.have.been.calledWith(200);
        expect(response.json).to.have.been.calledWith(conditions);
    });

    it('should return empty list when no medical conditions match the search criteria', async function () {
        // Setup do mock: quando o método searchMedicalConditions for chamado, simula uma resposta sem resultados
        conditionServiceMock.searchMedicalConditions.resolves({
            isFailure: false,
            getValue: () => []
        });

        // Atualizando request para incluir query (parâmetros de pesquisa)
        request = {
            ...request,
            query: { code: 'nonexistentCode' }  // Simulando um parâmetro que não retorna resultados
        };

        await medicalConditionController.searchMedicalConditions(request as Request, response as Response, () => {});

        expect(response.status).to.have.been.calledWith(200);
        expect(response.json).to.have.been.calledWith([]);
    });

    it('should return error when search fails', async function () {
        // Setup do mock: quando o método searchMedicalConditions for chamado, simula um erro
        conditionServiceMock.searchMedicalConditions.resolves({
            isFailure: true,
            errorValue: () => 'Search failed.'
        });

        // Atualizando request para incluir query (parâmetros de pesquisa)
        request = {
            ...request,
            query: { code: 'A122' }  // Adicionando o parâmetro `code` para a pesquisa
        };

        await medicalConditionController.searchMedicalConditions(request as Request, response as Response, () => {});

        expect(response.status).to.have.been.calledWith(400);
        expect(response.json).to.have.been.calledWith({ message: 'Search failed.' });
    });
});
