import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchPatientProfileComponent } from './search-patient-profile.component';
import { MockPatientService } from '../mock-patient.services';
import { PatientService } from '../../../services/patient-profile.service';
import { of, throwError }from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';

describe('SearchPatientComponent', () => {
  let component: SearchPatientProfileComponent;
  let fixture: ComponentFixture<SearchPatientProfileComponent>;
  let mockPatientService: MockPatientService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchPatientProfileComponent],
      providers: [
        { provide: PatientService, useClass: MockPatientService }, // Usando o mock
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 'some-id' }), // Simula parâmetros de rota, se necessário
            queryParams: of({ search: 'query' }) // Simula query params, se necessário
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchPatientProfileComponent);
    component = fixture.componentInstance;
    mockPatientService = TestBed.inject(PatientService) as unknown as MockPatientService; // Injetando o mock
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return patient when search is successful', () => {
    // Configurar o mock com uma lista de patient simulada
    const mockPatientList = [
      {
        medicalRecordNum: '202411000001',
        fullName: 'Ana Sousa',
        email: 'ana@example.com',
        phoneNumber: '+351 987654321',
        gender: 'Female',
        birth: '1990-01-01',
        emergencyContact: '+351 966222111'
      },
    ];

    // Inicializar campos de pesquisa no componente
    component.name = 'Ana';
    component.email = 'ana@example.com';

    // Chamar a função de pesquisa
    component.searchPatients();
    fixture.detectChanges();

    // Verificar o estado após a chamada
    expect(component.patientList).toEqual(mockPatientList); // Verifica se a lista está correta
    expect(component.error).toBe(''); // O erro deve ser uma string vazia (respeitando clearMessages)
    expect(component.isLoading).toBeFalse(); // Verifica se o carregamento terminou
  });


  it('should set error message when no patient is found', () => {
    // Chamar a função de pesquisa com um valor qualquer
    component.name = 'John';
    component.searchPatients();

    fixture.detectChanges();

    // Verificar se a lista de funcionários é vazia e se a mensagem de erro foi definida
    expect(component.patientList).toEqual([]);
    expect(component.error).toBe('No patient found!');
  });

  it('should handle errors when patient search fails', () => {
    // Configurar o mock para simular uma falha
    mockPatientService.filterPatients.and.returnValue(
      throwError(() => ({ status: 500 })) // Simula erro de conexão (status 500)
    );

    // Configurar os campos de pesquisa no componente
    component.name = 'Nonexistent Patient';

    // Chamar o método de busca
    component.searchPatients();
    fixture.detectChanges();

    // Verificar o estado após a falha
    expect(component.error).toBe('Error geting Patient profile. Connection failed!'); // Mensagem de erro
    expect(component.isLoading).toBeFalse(); // Verificar se o carregamento terminou
    expect(component.patientList).toEqual([]); // Lista deve permanecer vazia
  });


  it('should load patients on init', () => {
    // Simular o retorno do mock para o método getPatients
    mockPatientService.getPatients.and.returnValue(
      of({
        body: [
          {
            medicalRecordNum: '202411000001',
            fullName: 'Ana Sousa',
            email: 'ana@example.com',
            phoneNumber: '+351 987654321',
            gender: 'Female',
            birth: '1990-01-01',
            emergencyContact: '+351 966222111'
          },
        ],
        headers: new Map<string, string>(),
        status: 200,
      })
    );

    // Chamar o ngOnInit do componente
    component.ngOnInit();

    // Garantir que o serviço foi chamado
    expect(mockPatientService.getPatients).toHaveBeenCalled();

    // Verificar se os patients foram carregados corretamente
    expect(component.patientList.length).toBe(1); // O mock tem 1 patient
    expect(component.patientList[0].fullName).toBe('Ana Sousa'); // Verifica um dado específico

    // Garantir que o indicador de carregamento foi desativado
    expect(component.isLoading).toBeFalse();
  });

  it('should show error message if no patients are found on init', () => {
    mockPatientService.getPatients.and.returnValue(
      of({ body: [], headers: new Map<string, string>(), status: 200 }) // Retorna lista vazia
    );

    component.ngOnInit();

    expect(mockPatientService.getPatients).toHaveBeenCalled();
    expect(component.patientList.length).toBe(0);
    expect(component.error).toBe('No patient found!');
    expect(component.isLoading).toBeFalse();
  });

  it('should deactivate a patient and update the list on success', () => {
    const patientToDeactivate = {
      medicalRecordNum: '202411000001',
      fullName: 'Ana Sousa',
      email: 'ana@example.com',
      phoneNumber: '+351 987654321',
      gender: 'Female',
      birth: '1990-01-01',
      emergencyContact: '+351 966222111'
    };

    // Simula a confirmação do usuário
    spyOn(window, 'confirm').and.returnValue(true);

    // Simula o sucesso no serviço de desativação
    mockPatientService.deactivatePatient.and.returnValue(of({ message: 'Patient deactivated successfully' }));

    // Limpa mensagens de sucesso e erro antes de simular a desativação
    component.clearMessages();

    // Chama o método de desativação
    component.deactivatePatient(patientToDeactivate);

    // Verifica se o método de desativação foi chamado com o ID correto
    expect(mockPatientService.deactivatePatient).toHaveBeenCalledWith(patientToDeactivate.medicalRecordNum);

    // Verifica se a mensagem de sucesso foi definida corretamente
    expect(component.success).toBe('Patient deactivated successfully');

    // Verifica se a lista de patients foi atualizada corretamente
    component.getPatients();
    expect(component.patientList.length).toBe(0); // A lista deve estar vazia após a remoção do patient
  });

  it('should handle server error when deactivating a patient', () => {
    const patientToDeactivate = {
      medicalRecordNum: '202411000001',
      fullName: 'Ana Sousa',
      email: 'ana@example.com',
      phoneNumber: '+351 987654321',
      gender: 'Female',
      birth: '1990-01-01',
      emergencyContact: '+351 966222111'
    };

    // Simula a confirmação do usuário
    spyOn(window, 'confirm').and.returnValue(true);

    // Simula o erro 500 no serviço de desativação
    mockPatientService.deactivatePatient.and.returnValue(throwError(() => ({ status: 500, message: 'Server error' })));

    // Limpa as mensagens de sucesso e erro antes de simular o erro
    component.clearMessages();

    // Chama o método de desativação
    component.deactivatePatient(patientToDeactivate);

    // Verifica se a mensagem de erro foi definida corretamente
    expect(component.error).toBe('Error deactivating Patient profile. Connection failed!');

    // Verifica se o estado de loading foi alterado corretamente
    expect(component.isLoading).toBeFalse();

    // Verifica se a lista de patients não foi alterada
    expect(component.patientList.length).toBe(0); // A lista deve continuar com 1 patient
  });



});
