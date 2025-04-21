import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockMedicalConditionsService } from '../mock-medical-conditions.service';
import { CreateMedicalConditionsComponent } from './create-medical-conditions.component';
import { MedicalConditionService } from '../../../../services/medical-condition.service';
import { throwError } from 'rxjs';

describe('CreateMedicalConditionComponent', () => {
  let component: CreateMedicalConditionsComponent;
  let fixture: ComponentFixture<CreateMedicalConditionsComponent>;
  let mockService: MockMedicalConditionsService;

  const newMedicalCondition = {
    code: 'MIG007',
    designation: 'Migraine',
    description: 'A neurological condition characterized by recurrent headaches that are often accompanied by other symptoms such as nausea, sensitivity to light, and visual disturbances.',
    commonSymptoms: ['Moderate to severe headache, often on one side of the head',
      'Sensitivity to light and sound', 'Nausea and vomiting']
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateMedicalConditionsComponent],
      providers: [{ provide: MedicalConditionService, useClass: MockMedicalConditionsService }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateMedicalConditionsComponent);
    component = fixture.componentInstance;
    mockService = TestBed.inject(MedicalConditionService) as unknown as MockMedicalConditionsService;
    fixture.detectChanges();
  });

  it('should create', async () => {
    await fixture.whenStable();
    expect(component).toBeTruthy();
  });

  it('should create a medical condition and update the message', async () => {
    await fixture.whenStable();

    component.medicalCondition = newMedicalCondition;
    component.onSubmit();

    expect(mockService.createMedicalCondition).toHaveBeenCalledWith(newMedicalCondition);
    expect(component.message).toContain('Medical Condition created successfully!');
    expect(component.createdMedicalCondition).toEqual(newMedicalCondition);
  });

  it('should display an error message when create Medical condition fails with 400 status', async () => {
    await fixture.whenStable();

    mockService.createMedicalCondition.and.returnValue(
      throwError(() => ({ status: 400, error: 'Error creating Medical Condition' }))
    );

    component.onSubmit();

    expect(component.message).toContain('Error creating Medical Condition');
    expect(component.createdMedicalCondition).toBeNull();
  });

  it('should display an error message when create Medical condition fails with 500 status', async () => {
    await fixture.whenStable();

    mockService.createMedicalCondition.and.returnValue(
      throwError(() => ({ status: 500, message: 'Server error' }))
    );

    component.onSubmit();

    expect(component.message).toContain('An unknown error occurred.');
    expect(component.createdMedicalCondition).toBeNull();
  });

  it('should reset the form when createNewMedicalCondition is called', () => {
    // Simulating the user filling out the form
    component.medicalCondition = { ...newMedicalCondition };
    component.message = 'Staff created successfully!';
    component.createdMedicalCondition = newMedicalCondition;

    // Calling the method to reset the form
    component.createNewMedicalCondition();

    // Expect that the staff is reset to its initial state
    expect(component.medicalCondition).toEqual({
      code: '',
      designation: '',
      description: '',
      commonSymptoms: []
    });
    expect(component.message).toBe('');
    expect(component.createdMedicalCondition).toBeNull();
  });

  it('should toggle expansion state when toggleExpansion is called', () => {
    expect(component.isExpanded).toBe(false);
    component.toggleExpansion();
    expect(component.isExpanded).toBe(true);
    component.toggleExpansion();
    expect(component.isExpanded).toBe(false);
  });
});

