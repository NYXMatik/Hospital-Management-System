import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockAllergyService } from '../mock-allergy.service';
import { UpdateAllergyComponent } from './update-allergy.component';
import { AllergyService } from '../../../../services/allergy.service';
import { ActivatedRoute, Router } from '@angular/router';
import { throwError } from 'rxjs';

describe('UpdateAllergyComponent', () => {
  let component: UpdateAllergyComponent;
  let fixture: ComponentFixture<UpdateAllergyComponent>;
  let mockService: MockAllergyService;

  const mockActivatedRoute = {
    snapshot: {
      params: {},
    },
    getCurrentNavigation: () => ({
      extras: {
        state: {
          allergy: {
            code: 'A123',
            designation: 'Marisco',
            description: 'Provoca falta de ar e comichao'
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
      imports: [UpdateAllergyComponent],
      providers: [
        { provide: AllergyService, useClass: MockAllergyService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateAllergyComponent);
    component = fixture.componentInstance;
    mockService = TestBed.inject(AllergyService) as unknown as MockAllergyService;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update allergy successfully', () => {
    const updatedAllergy = {
      code: 'A123',
      designation: 'Camarao',
      description: 'Provoca falta de ar e comichao'
    };

    expect(component.allergy.designation).toBe('Marisco');

    component.allergy = updatedAllergy;
    component.onSubmit();

    expect(mockService.updateAllergy).toHaveBeenCalledWith(updatedAllergy);
    expect(component.message).toBe('Allergy updated successfully!');
    expect(component.updatedAllergy).toEqual(updatedAllergy);
    expect(component.allergy.designation).toBe('Camarao');
    expect(mockService.allergyUpdatedSource.next).toHaveBeenCalled();
  });

  it('should show error message when designation is invalid', () => {
    const updatedAllergy = {
      code: 'A123',
      designation: '234',
      description: 'Provoca falta de ar e comichao'
    };

    // Inicializa com dados válidos
    component.allergy = { ...updatedAllergy, designation: 'Marisco' };

    mockService.updateAllergy.and.returnValue(throwError(() => ({
      status: 400,
      error: 'Designation must contain at least one letter and only alphanumeric characters and spaces.'}
    )));

    component.onSubmit();

    // Verifica se a mensagem de erro foi configurada corretamente
    expect(component.message).toBe('Designation must contain at least one letter and only alphanumeric characters and spaces.');
  });

  it('should show error message when description is invalid', () => {
    const updatedAllergy = {
      code: 'A123',
      designation: 'Camarao',
      description: '123'
    };

    // Inicializa com dados válidos
    component.allergy = { ...updatedAllergy, description: 'Provoca falta de ar e comichao.' };

    mockService.updateAllergy.and.returnValue(throwError(() => ({
      status: 400,
      error: 'Description cannot contain only numbers.'
    })));

    component.onSubmit();

    expect(component.message).toBe('Description cannot contain only numbers.');
  });

  it('should display an error message when designation and description are not provided', () => {
    mockService.updateAllergy.and.returnValue(
      throwError(() => ({
        status: 400,
        error: 'At least one field (designation or description) must be provided.'
      }))
    );

    component.allergy = {
      code: '',
      designation: '',
      description: ''
    };
    component.onSubmit();

    expect(mockService.updateAllergy).toHaveBeenCalled();
    expect(component.message).toContain('At least one field (designation or description) must be provided.'); // Mensagem geral
    expect(component.updatedAllergy).toBeNull();
  });

});


