import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockMedicalConditionsService } from '../mock-medical-conditions.service';
import { UpdateMedicalConditionsComponent } from './update-medical-conditions.component';
import { MedicalConditionService } from '../../../../services/medical-condition.service';
import { ActivatedRoute, Router } from '@angular/router';
import { throwError } from 'rxjs';

describe('UpdateMedicalConditionComponent', () => {
  let component: UpdateMedicalConditionsComponent;
  let fixture: ComponentFixture<UpdateMedicalConditionsComponent>;
  let mockService: MockMedicalConditionsService;

  const mockActivatedRoute = {
    snapshot: {
      params: {},
    },
    getCurrentNavigation: () => ({
      extras: {
        state: {
          medicalCondition: {
            code: 'MIG007',
            designation: 'Migraine',
            description: 'A neurological condition characterized by recurrent headaches that are often accompanied by other symptoms such as nausea, sensitivity to light, and visual disturbances.',
            commonSymptoms: ['Moderate to severe headache, often on one side of the head',
              'Sensitivity to light and sound', 'Nausea and vomiting']
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
      imports: [UpdateMedicalConditionsComponent],
      providers: [
        { provide: MedicalConditionService, useClass: MockMedicalConditionsService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateMedicalConditionsComponent);
    component = fixture.componentInstance;
    mockService = TestBed.inject(MedicalConditionService) as unknown as MockMedicalConditionsService;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update medical condition successfully', () => {
    const updatedMedicalCondition = {
        code: 'MIG007',
        designation: 'Severe Migraine',
        description: 'A neurological condition characterized by recurrent headaches that are often accompanied by other symptoms such as nausea, sensitivity to light, and visual disturbances.',
        commonSymptoms: ['Moderate to severe headache, often on one side of the head',
        'Sensitivity to light and sound', 'Nausea and vomiting']
    };

    expect(component.medicalCondition.designation).toBe('Migraine');

    component.medicalCondition = updatedMedicalCondition;
    component.onSubmit();

    expect(mockService.updateMedicalCondition).toHaveBeenCalledWith(updatedMedicalCondition);
    expect(component.message).toBe('Medical Condition updated successfully!');
    expect(component.updatedMedicalCondition).toEqual(updatedMedicalCondition);
    expect(component.medicalCondition.designation).toBe('Severe Migraine');
    expect(mockService.medicalConditionUpdatedSource.next).toHaveBeenCalled();
  });

  it('should show error message when designation is invalid', () => {
    const updatedMedicalCondition = {
      code: 'MIG007',
        designation: '123342',
        description: 'A neurological condition characterized by recurrent headaches that are often accompanied by other symptoms such as nausea, sensitivity to light, and visual disturbances.',
        commonSymptoms: ['Moderate to severe headache, often on one side of the head',
        'Sensitivity to light and sound', 'Nausea and vomiting']
    };

    // Inicializa com dados válidos
    component.medicalCondition = { ...updatedMedicalCondition, designation: 'Migraine' };

    // Simula erro no serviço para o email
    mockService.updateMedicalCondition.and.returnValue(throwError(() => ({
      status: 400,
      error: 'Designation must contain at least one letter and only alphanumeric characters and spaces.'}
    )));

    component.onSubmit();

    // Verifica se a mensagem de erro foi configurada corretamente
    expect(component.message).toBe('Designation must contain at least one letter and only alphanumeric characters and spaces.');
  });

  it('should show error message when description is invalid', () => {
    const updatedStaff = {
      code: 'MIG07',
      designation: 'Severe Migraine',
      description: '4213',
      commonSymptoms: ['Moderate to severe headache, often on one side of the head',
        'Sensitivity to light and sound', 'Nausea and vomiting']
    };

    // Inicializa com dados válidos
    component.medicalCondition = { ...updatedStaff, description: 'A neurological condition characterized by recurrent headaches that are often accompanied by other symptoms such as nausea, sensitivity to light, and visual disturbances.' };

    // Simula erro no serviço para o telefone
    mockService.updateMedicalCondition.and.returnValue(throwError(() => ({
      status: 400,
      error: 'Description cannot contain only numbers.'
    })));

    component.onSubmit();

    expect(component.message).toBe('Description cannot contain only numbers.');
  });

  it('should display an error message when designation and description are not provided', () => {
    mockService.updateMedicalCondition.and.returnValue(
      throwError(() => ({
        status: 400,
        error: 'At least one field (designation or description) must be provided.'
      }))
    );

    component.medicalCondition = {
      code: '',
      designation: '',
      description: '',
      commonSymptoms: ['',
        '']
    };
    component.onSubmit();

    expect(mockService.updateMedicalCondition).toHaveBeenCalled();
    expect(component.message).toContain('At least one field (designation or description) must be provided.'); // Mensagem geral
    expect(component.updatedMedicalCondition).toBeNull();
  });

});


