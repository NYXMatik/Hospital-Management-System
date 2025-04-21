import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListMedicalConditionsComponent } from './list-medical-conditions.component';
import { MedicalConditionService } from '../../../services/medical-condition.service';
import { MockMedicalConditionsService } from '../manage-medical-conditions/mock-medical-conditions.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('ListMedicalConditionComponent', () => {
  let component: ListMedicalConditionsComponent;
  let fixture: ComponentFixture<ListMedicalConditionsComponent>;
  let mockMedicalConditionService: MockMedicalConditionsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListMedicalConditionsComponent],
      providers: [
        { provide: MedicalConditionService, useClass: MockMedicalConditionsService },
        {
          provide: ActivatedRoute,
          useValue: { params: of({ id: 'some-id' }) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListMedicalConditionsComponent);
    component = fixture.componentInstance;
    mockMedicalConditionService = TestBed.inject(MedicalConditionService) as unknown as MockMedicalConditionsService;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load all medical conditions on init', () => {
    const mockMedicalConditionList = [
      { code: 'MIG007',
        designation: 'Migraine',
        description: 'A neurological condition characterized by recurrent headaches that are often accompanied by other symptoms such as nausea, sensitivity to light, and visual disturbances.',
        commonSymptoms: ['Moderate to severe headache, often on one side of the head',
          'Sensitivity to light and sound', 'Nausea and vomiting'] },
    ];

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.medicalConditionsList).toEqual(mockMedicalConditionList);
    expect(component.isLoading).toBeFalse();
    expect(component.error).toBe('');
  });

  it('should return medical conditions when search is successful', () => {
    const mockMedicalConditionList = [
      { code: 'MIG007',
        designation: 'Migraine',
        description: 'A neurological condition characterized by recurrent headaches that are often accompanied by other symptoms such as nausea, sensitivity to light, and visual disturbances.',
        commonSymptoms: ['Moderate to severe headache, often on one side of the head',
          'Sensitivity to light and sound', 'Nausea and vomiting'] },
    ];

    const searchValues = { code: 'MIG007', designation: 'Migraine' };

    component.handleSearch(searchValues);
    fixture.detectChanges();

    expect(component.medicalConditionsList).toEqual(mockMedicalConditionList);
    expect(component.error).toBe('');
    expect(component.isLoading).toBeFalse();
  });

  it('should set error message when no medical conditions are found', () => {
    const searchValues = { code: 'Nonexistent' };

    mockMedicalConditionService.listAndfilterMedicalConditions.and.returnValue(of({ body: [], status: 200 }));
    component.handleSearch(searchValues);
    fixture.detectChanges();

    expect(component.medicalConditionsList).toEqual([]);
    expect(component.error).toBe('');
    expect(component.isLoading).toBeFalse();
  });

  it('should handle errors when medical condition search fails', () => {
    mockMedicalConditionService.listAndfilterMedicalConditions.and.returnValue(throwError(() => ({ status: 500 })));

    const searchValues = { designation: 'Nonexistent' };

    component.handleSearch(searchValues);
    fixture.detectChanges();

    expect(component.error).toBeTruthy();
    expect(component.isLoading).toBeFalse();
    expect(component.medicalConditionsList).toEqual([]);
  });

  it('should show medical condition details when "viewDetails" action is triggered', () => {
    const mockMedicalCondition = { 
      code: 'MIG007',
      designation: 'Migraine',
      description: 'A neurological condition characterized by recurrent headaches that are often accompanied by other symptoms such as nausea, sensitivity to light, and visual disturbances.',
      commonSymptoms: ['Moderate to severe headache, often on one side of the head',
        'Sensitivity to light and sound', 'Nausea and vomiting'] };

    component.handleAction({ action: 'viewDetails', item: mockMedicalCondition });
    fixture.detectChanges();

    expect(component.selectedMedicalCondition).toEqual(mockMedicalCondition);
  });

  it('should close modal when "closeModal" is called', () => {
    component.selectedMedicalCondition = { 
      code: 'MIG007',
      designation: 'Migraine',
      description: 'A neurological condition characterized by recurrent headaches that are often accompanied by other symptoms such as nausea, sensitivity to light, and visual disturbances.',
      commonSymptoms: ['Moderate to severe headache, often on one side of the head',
        'Sensitivity to light and sound', 'Nausea and vomiting'] };

    component.closeModal();
    fixture.detectChanges();

    expect(component.selectedMedicalCondition).toBeNull();
  });
});
