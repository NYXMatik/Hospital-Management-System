import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import AllergyController from '../../../src/controllers/AllergyController';
import AllergyService from '../../../src/services/AllergyService';
import { Request, Response } from 'express';

chai.use(sinonChai); 

describe('AllergyController Integration Unit Test', function () {
    let allergyController: AllergyController;
    let allergyServiceMock: sinon.SinonStubbedInstance<AllergyService>;
    let request: Partial<Request>;
    let response: Partial<Response>;

    beforeEach(function () {
        // Criando mock do serviço
        allergyServiceMock = sinon.createStubInstance(AllergyService);

        // Inicializando o controller com o serviço mockado
        allergyController = new AllergyController(allergyServiceMock);

        // Mocks de request e response
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

    afterEach(function () {
        sinon.restore();
    });

    // Teste para criar alergia (createAllergy)
    it('should successfully create an allergy', async function () {
        // Setup do mock: quando o método createAllergy for chamado, simula um retorno bem-sucedido
        allergyServiceMock.createAllergy.resolves({
            isFailure: false,
            getValue: () => ({
                code: 'A123',
                designation: 'Test Allergy',
                description: 'An allergy used for testing purposes.'
            })
        });

        await allergyController.createAllergy(request as Request, response as Response, () => {});

        expect(response.status).to.have.been.calledWith(201);
        expect(response.json).to.have.been.calledWith({
            code: 'A123',
            designation: 'Test Allergy',
            description: 'An allergy used for testing purposes.'
        });
    });

    it('should return error when allergy already exists', async function () {
        // Setup do mock: quando o método createAllergy for chamado, simula um erro de duplicação
        allergyServiceMock.createAllergy.resolves({
            isFailure: true,
            errorValue: () => 'Allergy already exists.'
        });

        await allergyController.createAllergy(request as Request, response as Response, () => {});

        expect(response.status).to.have.been.calledWith(400);
        expect(response.json).to.have.been.calledWith({ errors: { message: 'Allergy already exists.' } });
    });

    // Teste para atualizar alergia (updateAllergy)
    it('should successfully update an allergy', async function () {
        // Setup do mock: quando o método updateAllergy for chamado, simula um retorno bem-sucedido
        allergyServiceMock.updateAllergy.resolves({
            isFailure: false,
            getValue: () => ({
                code: 'A123',
                designation: 'Updated Allergy',
                description: 'An updated allergy used for testing purposes.'
            })
        });

        // Atualizando request para incluir params
        request = {
            ...request,
            params: { code: 'A123' }  // Adicionando o parâmetro `code` para o updateAllergy
        };

        await allergyController.partialUpdateAllergy(request as Request, response as Response, () => {});

        expect(response.status).to.have.been.calledWith(200);
        expect(response.json).to.have.been.calledWith({
            code: 'A123',
            designation: 'Updated Allergy',
            description: 'An updated allergy used for testing purposes.'
        });
    });

    it('should return error when allergy to update does not exist', async function () {
        // Setup do mock: quando o método updateAllergy for chamado, simula um erro de não encontrado
        allergyServiceMock.updateAllergy.resolves({
            isFailure: true,
            errorValue: () => 'Allergy not found.'
        });

        // Atualizando request para incluir params
        request = {
            ...request,
            params: { code: 'A123' }  // Adicionando o parâmetro `code` para o updateAllergy
        };

        await allergyController.partialUpdateAllergy(request as Request, response as Response, () => {});

        expect(response.status).to.have.been.calledWith(400);
        expect(response.json).to.have.been.calledWith({ message: 'Allergy not found.' });
    });

    it('should return error when updating allergy with invalid data', async function () {
        // Simula um corpo de requisição inválido
        request.body = { code: '', designation: '', description: '' };

        // Setup do mock: quando o método updateAllergy for chamado, simula um erro de validação
        allergyServiceMock.updateAllergy.resolves({
            isFailure: true,
            errorValue: () => 'Invalid data provided.'
        });

        // Atualizando request para incluir params
        request = {
            ...request,
            params: { code: 'A123' }  // Adicionando o parâmetro `code` para o updateAllergy
        };

        await allergyController.partialUpdateAllergy(request as Request, response as Response, () => {});

        expect(response.status).to.have.been.calledWith(400);
        expect(response.json).to.have.been.calledWith({ message: "At least one field (designation or description) must be provided." });
    });

    // Teste para pesquisar alergias (searchAllergies)
    it('should successfully search allergies', async function () {
        // Simula uma lista de alergias para a pesquisa
        const allergies = [
            { code: 'A123', designation: 'Test Allergy', description: 'Test description 1' },
            { code: 'A124', designation: 'Another Allergy', description: 'Test description 2' }
        ];

        // Setup do mock: quando o método searchAllergies for chamado, simula uma resposta bem-sucedida
        allergyServiceMock.searchAllergies.resolves({
            isFailure: false,
            getValue: () => allergies
        });

        // Atualizando request para incluir query (parâmetros de pesquisa)
        request = {
            ...request,
            query: { code: 'A123' }  // Adicionando o parâmetro `code` para a pesquisa
        };

        await allergyController.searchAllergies(request as Request, response as Response, () => {});

        expect(response.status).to.have.been.calledWith(200);
        expect(response.json).to.have.been.calledWith(allergies);
    });

    it('should return empty list when no allergies match the search criteria', async function () {
        // Setup do mock: quando o método searchAllergies for chamado, simula uma resposta sem resultados
        allergyServiceMock.searchAllergies.resolves({
            isFailure: false,
            getValue: () => []
        });

        // Atualizando request para incluir query (parâmetros de pesquisa)
        request = {
            ...request,
            query: { code: 'nonexistentCode' }  // Simulando um parâmetro que não retorna resultados
        };

        await allergyController.searchAllergies(request as Request, response as Response, () => {});

        expect(response.status).to.have.been.calledWith(200);
        expect(response.json).to.have.been.calledWith([]);
    });

    it('should return error when search fails', async function () {
        // Setup do mock: quando o método searchAllergies for chamado, simula um erro
        allergyServiceMock.searchAllergies.resolves({
            isFailure: true,
            errorValue: () => 'Search failed.'
        });

        // Atualizando request para incluir query (parâmetros de pesquisa)
        request = {
            ...request,
            query: { code: 'A123' }  // Adicionando o parâmetro `code` para a pesquisa
        };

        await allergyController.searchAllergies(request as Request, response as Response, () => {});

        expect(response.status).to.have.been.calledWith(400);
        expect(response.json).to.have.been.calledWith({ message: 'Search failed.' });
    });
});
