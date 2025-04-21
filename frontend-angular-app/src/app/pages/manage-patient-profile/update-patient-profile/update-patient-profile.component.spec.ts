import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdatePatientProfileComponent } from './update-patient-profile.component';
import { MockPatientService } from '../mock-patient.services';
import { PatientService } from '../../../services/patient-profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { throwError } from 'rxjs';

describe('UpdatePatientComponent', () => {
  let component: UpdatePatientProfileComponent;
  let fixture: ComponentFixture<UpdatePatientProfileComponent>;
  let mockService: MockPatientService;

  const mockActivatedRoute = {
    snapshot: {
      params: {},
    },
    getCurrentNavigation: () => ({
      extras: {
        state: {
          patient: {
            medicalRecordNum: '202411000001',
            fullName: 'Ana Sousa',
            email: 'ana@example.com',
            phoneNumber: '+351 987654321',
            gender: 'Female',
            birth: '1990-01-01',
            emergencyContact: '+351 966222111'
          },
        },
      },
    }),
  };

  const mockRouter = {
    navigate: jasmine.createSpy('navigate'),
    getCurrentNavigation: () => mockActivatedRoute.getCurrentNavigation(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatePatientProfileComponent],
      providers: [
        { provide: PatientService, useClass: MockPatientService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdatePatientProfileComponent);
    component = fixture.componentInstance;
    mockService = TestBed.inject(PatientService) as unknown as MockPatientService;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update patient successfully', () => {
    const updatedPatient = {
      medicalRecordNum: '202411000001',
      fullName: 'Ana Maria Sousa',
      email: 'ana@example.com',
      phoneNumber: '+351 987654321',
      gender: 'Female',
      birth: '1990-01-01',
      emergencyContact: '+351 966222111'
    };

    expect(component.patient.fullName).toBe('Ana Sousa');

    component.patient = updatedPatient;
    component.onSubmit();

    expect(mockService.updatePatient).toHaveBeenCalledWith(updatedPatient);
    expect(component.message).toBe('Patient updated successfully!');
    expect(component.updatedPatient).toEqual(updatedPatient);
    expect(component.patient.fullName).toBe('Ana Maria Sousa');
    expect(mockService.patientUpdatedSource.next).toHaveBeenCalled();
  });

  it('should show error message when email is invalid', () => {
    const updatedPatient = {
      medicalRecordNum: '202411000001',
      fullName: 'Ana Sousa',
      email: 'invalid-email', // Email inválido
      phoneNumber: '+351 987654321',
      gender: 'Female',
      birth: '1990-01-01',
      emergencyContact: '+351 966222111'
    };

    // Inicializa com dados válidos
    component.patient = { ...updatedPatient, email: 'ana@example.com' };

    // Simula erro no serviço para o email
    mockService.updatePatient.and.returnValue(throwError(() => ({
      status: 400,
      error: { errors: ['Invalid email format'] }
    })));

    component.onSubmit();

    // Verifica se a mensagem de erro foi configurada corretamente
    expect(component.message).toBe('Error updating Patient profile. Please verify the following:<br>- Invalid email format');
  });

  it('should show error message when phone number is invalid', () => {
    const updatedPatient = {
      medicalRecordNum: '202411000001',
      fullName: 'Ana Sousa',
      email: 'ana@example.com',
      phoneNumber: 'invalid-phone', // Número de telefone inválido
      gender: 'Female',
      birth: '1990-01-01',
      emergencyContact: '+351 966222111'
    };

    // Inicializa com dados válidos
    component.patient = { ...updatedPatient, phoneNumber: '+351 987654321' };

    // Simula erro no serviço para o telefone
    mockService.updatePatient.and.returnValue(throwError(() => ({
      status: 400,
      error: { errors: ['Invalid phone number format'] }
    })));

    component.onSubmit();

    expect(component.message).toBe('Error updating Patient profile. Please verify the following:<br>- Invalid phone number format');
  });

  it('should display an error message when updatePatient fails', () => {
    mockService.updatePatient.and.returnValue(
      throwError(() => ({
        status: 400,
        error: { errors: ['Invalid email format', 'Phone number is required'] }
      }))
    );

    component.patient = { medicalRecordNum: '202411000001', fullName: '', email: '', phoneNumber: '', gender: '', birth: '', emergencyContact: '' };

    component.onSubmit();
    //console.log("Message", component.message);

    expect(mockService.updatePatient).toHaveBeenCalled();
    expect(component.message).toContain('Error updating Patient profile'); // Mensagem geral
    expect(component.message).toContain('Error updating Patient profile. Please verify the following:<br>- Invalid email format<br>- Phone number is required'); // Detalhes do erro
    expect(component.message).toContain('Invalid email format');
    expect(component.message).toContain('Phone number is required');
    expect(component.updatedPatient).toBeNull();
  });

});


