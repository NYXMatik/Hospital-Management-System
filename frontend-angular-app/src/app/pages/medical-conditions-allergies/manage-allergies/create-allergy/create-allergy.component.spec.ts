import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockAllergyService } from '../mock-allergy.service';
import { CreateAllergyComponent } from './create-allergy.component';
import { AllergyService } from '../../../../services/allergy.service';
import { throwError } from 'rxjs';

describe('CreateAllergyComponent', () => {
  let component: CreateAllergyComponent;
  let fixture: ComponentFixture<CreateAllergyComponent>;
  let mockService: MockAllergyService;

  const newAllergy = {
    code: 'A123',
    designation: 'Marisco',
    description: 'Provoca falta de ar e comichao'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAllergyComponent],
      providers: [{ provide: AllergyService, useClass: MockAllergyService }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAllergyComponent);
    component = fixture.componentInstance;
    mockService = TestBed.inject(AllergyService) as unknown as MockAllergyService;
    fixture.detectChanges();
  });

  it('should create', async () => {
    await fixture.whenStable();
    expect(component).toBeTruthy();
  });

  it('should create an allergy and update the message', async () => {
    await fixture.whenStable();

    component.allergy = newAllergy;
    component.onSubmit();

    expect(mockService.createAllergy).toHaveBeenCalledWith(newAllergy);
    expect(component.message).toContain('Allergy created successfully!');
    expect(component.createdAllergy).toEqual(newAllergy);
  });

  it('should display an error message when create Allergy fails with 400 status', async () => {
    await fixture.whenStable();

    mockService.createAllergy.and.returnValue(
      throwError(() => ({ status: 400, error: 'Error creating Allergy' }))
    );

    component.onSubmit();

    expect(component.message).toContain('Error creating Allergy');
    expect(component.createdAllergy).toBeNull();
  });

  it('should display an error message when create Allergy fails with 500 status', async () => {
    await fixture.whenStable();

    mockService.createAllergy.and.returnValue(
      throwError(() => ({ status: 500, message: 'Server error' }))
    );

    component.onSubmit();

    expect(component.message).toContain('An unknown error occurred.');
    expect(component.createdAllergy).toBeNull();
  });

  it('should reset the form when createNewAllergy is called', () => {
    // Simulating the user filling out the form
    component.allergy = { ...newAllergy };
    component.message = 'Allergy created successfully!';
    component.createdAllergy = newAllergy;

    // Calling the method to reset the form
    component.createNewAllergy();

    // Expect that the Allergy is reset to its initial state
    expect(component.allergy).toEqual({
      code: '',
      designation: '',
      description: ''
    });
    expect(component.message).toBe('');
    expect(component.createdAllergy).toBeNull();
  });

  it('should toggle expansion state when toggleExpansion is called', () => {
    expect(component.isExpanded).toBe(false);
    component.toggleExpansion();
    expect(component.isExpanded).toBe(true);
    component.toggleExpansion();
    expect(component.isExpanded).toBe(false);
  });
});

