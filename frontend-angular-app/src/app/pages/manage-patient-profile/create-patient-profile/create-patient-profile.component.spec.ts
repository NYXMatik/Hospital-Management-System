import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreatePatientProfileComponent } from './create-patient-profile.component';
import { MockPatientService } from '../mock-patient.services';
import { PatientService } from '../../../services/patient-profile.service';
import { throwError } from 'rxjs';

describe('CreatePatientProfileComponent', () => {
  let component: CreatePatientProfileComponent;
  let fixture: ComponentFixture<CreatePatientProfileComponent>;
  let mockService: MockPatientService;

  const newPatient = {
    medicalRecordNum: '202411000001',
    fullName: 'Ana Sousa',
    email: 'ana@example.com',
    phoneNumber: '+351 987654321',
    gender: 'Female',
    birth: '1990-01-01',
    emergencyContact: '+351 966222111'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePatientProfileComponent],
      providers: [{ provide: PatientService, useClass: MockPatientService }]
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePatientProfileComponent);
    component = fixture.componentInstance;
    mockService = TestBed.inject(PatientService) as unknown as MockPatientService;
    fixture.detectChanges();
  });

  it('should create', async () => {
    await fixture.whenStable();
    expect(component).toBeTruthy();
  });

  it('should create a patient and update the message', async () => {
    await fixture.whenStable();

    component.patient = newPatient;
    component.onSubmit();

    expect(mockService.createPatient).toHaveBeenCalledWith(newPatient);
    expect(component.message).toContain('Patient created successfully!');
    expect(component.createdPatient).toEqual(newPatient);
  });

  it('should display an error message when createPatient fails with 400 status', async () => {
    await fixture.whenStable();

    mockService.createPatient.and.returnValue(
      throwError(() => ({ status: 400, error: 'Error creating Patient' }))
    );

    component.onSubmit();

    expect(component.message).toContain('Error creating Patient profile');
    expect(component.createdPatient).toBeNull();
  });

  it('should display an error message when createPatient fails with 500 status', async () => {
    await fixture.whenStable();

    mockService.createPatient.and.returnValue(
      throwError(() => ({ status: 500, message: 'Server error' }))
    );

    component.onSubmit();

    expect(component.message).toContain('Error creating Patient profile. Connection failed!');
    expect(component.createdPatient).toBeNull();
  });

  it('should reset the form when createNewPatient is called', () => {
    // Simulating the user filling out the form
    component.patient = { ...newPatient };
    component.message = 'Patient created successfully!';
    component.createdPatient = newPatient;

    // Calling the method to reset the form
    component.createNewPatient();

    // Expect that the patient is reset to its initial state
    expect(component.patient).toEqual({
      medicalRecordNum: '',
      fullName: '',
      email: '',
      phoneNumber: '',
      gender: '',
      birth: '',
      emergencyContact: ''
    });
    expect(component.message).toBe('');
    expect(component.createdPatient).toBeNull();
  });

  it('should toggle expansion state when toggleExpansion is called', () => {
    expect(component.isExpanded).toBe(false);
    component.toggleExpansion();
    expect(component.isExpanded).toBe(true);
    component.toggleExpansion();
    expect(component.isExpanded).toBe(false);
  });

});
