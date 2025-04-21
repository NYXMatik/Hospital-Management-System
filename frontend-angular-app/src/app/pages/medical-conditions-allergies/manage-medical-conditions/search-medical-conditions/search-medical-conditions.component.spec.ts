import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockMedicalConditionsService } from '../mock-medical-conditions.service';
import { SearchMedicalConditionsComponent } from './search-medical-conditions.component';
import { MedicalConditionService } from '../../../../services/medical-condition.service';
import { of, throwError }from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('SearchMedicalConditionsComponent', () => {
  let component: SearchMedicalConditionsComponent;
  let fixture: ComponentFixture<SearchMedicalConditionsComponent>;
  let mockMedicalConditionsService: MockMedicalConditionsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchMedicalConditionsComponent],
      providers: [
        { provide: MedicalConditionService, useClass: MockMedicalConditionsService }, // Usando o mock
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 'some-id' }), 
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchMedicalConditionsComponent);
    component = fixture.componentInstance;
    mockMedicalConditionsService = TestBed.inject(MedicalConditionService) as unknown as MockMedicalConditionsService; // Injetando o mock
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return medical conditions when search is successful', () => {
    const mockMedicalConditionList = [
      {
        code: 'MIG007',
        designation: 'Migraine',
        description: 'A neurological condition characterized by recurrent headaches that are often accompanied by other symptoms such as nausea, sensitivity to light, and visual disturbances.',
        commonSymptoms: ['Moderate to severe headache, often on one side of the head',
          'Sensitivity to light and sound', 'Nausea and vomiting']
      },
    ];

    component.code = 'MIG007';
    component.designation = 'Migraine';

    const searchValues = { code: 'MIG007', designation: 'Migraine' };

    component.handleSearch(searchValues);
    fixture.detectChanges();

    expect(component.medicalConditionList).toEqual(mockMedicalConditionList); 
    expect(component.error).toBe(''); 
    expect(component.isLoading).toBeFalse(); 
  });


  it('should set error message when no medical conditions are found', () => {
    
    component.code = 'A539203765';
    const searchValues = { code: 'A539203765'};

    component.handleSearch(searchValues);

    fixture.detectChanges();

    expect(component.medicalConditionList).toEqual([]);
    expect(component.error).toBe('');
  });

  it('should handle errors when medical conditions search fails', () => {
    mockMedicalConditionsService.listAndfilterMedicalConditions.and.returnValue(throwError(() => ({ status: 500 })));

    const searchValues = { designation: 'Nonexistent' };

    component.handleSearch(searchValues);
    fixture.detectChanges();

    expect(component.error).toBe('Connection failed.'); 
    expect(component.isLoading).toBeFalse();
    expect(component.medicalConditionList).toEqual([]);
  });

  it('should load all medical conditions', () => {
    component.code = '';
    component.designation = '';

    component.getMedicalConditions();

    fixture.detectChanges();

    expect(component.medicalConditionList.length).toBe(1);
    expect(component.medicalConditionList[0].code).toBe('MIG007');
    expect(component.medicalConditionList[0].designation).toBe('Migraine');
    expect(component.medicalConditionList[0].description).toBe('A neurological condition characterized by recurrent headaches that are often accompanied by other symptoms such as nausea, sensitivity to light, and visual disturbances.');
    expect(component.medicalConditionList[0].commonSymptoms.length).toBe(3);
    expect(component.medicalConditionList[0].commonSymptoms[0]).toBe('Moderate to severe headache, often on one side of the head');
    expect(component.medicalConditionList[0].commonSymptoms[1]).toBe('Sensitivity to light and sound');
    expect(component.medicalConditionList[0].commonSymptoms[2]).toBe('Nausea and vomiting');

  });

  it('should show error message if no medical conditions are found on init', () => {
    mockMedicalConditionsService.listAndfilterMedicalConditions.and.returnValue(of([]));

    component.ngOnInit();
    fixture.detectChanges();

    expect(mockMedicalConditionsService.listAndfilterMedicalConditions).toHaveBeenCalled();
    expect(component.medicalConditionList.length).toBe(0);
    expect(component.error).toBe('');
    expect(component.isLoading).toBeFalse();
  });

});

