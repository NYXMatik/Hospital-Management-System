import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListAllergiesComponent } from './list-allergies.component';
import { AllergyService } from '../../../services/allergy.service';
import { MockAllergyService } from './../manage-allergies/mock-allergy.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('ListAllergiesComponent', () => {
  let component: ListAllergiesComponent;
  let fixture: ComponentFixture<ListAllergiesComponent>;
  let mockAllergyService: MockAllergyService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAllergiesComponent],
      providers: [
        { provide: AllergyService, useClass: MockAllergyService },
        {
          provide: ActivatedRoute,
          useValue: { params: of({ id: 'some-id' }) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListAllergiesComponent);
    component = fixture.componentInstance;
    mockAllergyService = TestBed.inject(AllergyService) as unknown as MockAllergyService;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load all allergies on init', () => {
    const mockAllergyList = [
      { code: 'A123', designation: 'Marisco', description: 'Provoca falta de ar e comichao' },
    ];

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.allergyList).toEqual(mockAllergyList);
    expect(component.isLoading).toBeFalse();
    expect(component.error).toBe('');
  });

  it('should return allergies when search is successful', () => {
    const mockAllergyList = [
      { code: 'A123', designation: 'Marisco', description: 'Provoca falta de ar e comichao' },
    ];

    const searchValues = { code: 'A123', designation: 'Marisco' };

    component.handleSearch(searchValues);
    fixture.detectChanges();

    expect(component.allergyList).toEqual(mockAllergyList);
    expect(component.error).toBe('');
    expect(component.isLoading).toBeFalse();
  });

  it('should set error message when no allergies are found', () => {
    const searchValues = { code: 'Nonexistent' };

    mockAllergyService.filterAllergies.and.returnValue(of({ body: [], status: 200 }));
    component.handleSearch(searchValues);
    fixture.detectChanges();

    expect(component.allergyList).toEqual([]);
    expect(component.error).toBe('');
    expect(component.isLoading).toBeFalse();
  });

  it('should handle errors when allergy search fails', () => {
    mockAllergyService.filterAllergies.and.returnValue(throwError(() => ({ status: 500 })));

    const searchValues = { designation: 'Nonexistent' };

    component.handleSearch(searchValues);
    fixture.detectChanges();

    expect(component.error).toBeTruthy();
    expect(component.isLoading).toBeFalse();
    expect(component.allergyList).toEqual([]);
  });

  it('should show allergy details when "viewDetails" action is triggered', () => {
    const mockAllergy = { code: 'A123', designation: 'Marisco', description: 'Provoca falta de ar e comichao' };

    component.handleAction({ action: 'viewDetails', item: mockAllergy });
    fixture.detectChanges();

    expect(component.selectedAllergy).toEqual(mockAllergy);
  });

  it('should close modal when "closeModal" is called', () => {
    component.selectedAllergy = { code: 'A123', designation: 'Marisco', description: 'Provoca falta de ar e comichao' };

    component.closeModal();
    fixture.detectChanges();

    expect(component.selectedAllergy).toBeNull();
  });
});
