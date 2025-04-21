import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockAllergyService } from '../mock-allergy.service';
import { SearchAllergiesComponent } from './search-allergies.component';
import { AllergyService } from '../../../../services/allergy.service';
import { of, throwError }from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('SearchAllergiesComponent', () => {
  let component: SearchAllergiesComponent;
  let fixture: ComponentFixture<SearchAllergiesComponent>;
  let mockAllergyService: MockAllergyService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchAllergiesComponent],
      providers: [
        { provide: AllergyService, useClass: MockAllergyService }, // Usando o mock
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 'some-id' }),
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchAllergiesComponent);
    component = fixture.componentInstance;
    mockAllergyService = TestBed.inject(AllergyService) as unknown as MockAllergyService; // Injetando o mock
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return allergies when search is successful', () => {
    const mockAllergyList = [
      {
        code: 'A123',
        designation: 'Marisco',
        description: 'Provoca falta de ar e comichao'
      },
    ];

    component.code = 'A123';
    component.designation = 'Marisco';

    const searchValues = { code: 'A123', designation: 'Marisco' };

    component.handleSearch(searchValues);
    fixture.detectChanges();

    expect(component.allergyList).toEqual(mockAllergyList);
    expect(component.error).toBe('');
    expect(component.isLoading).toBeFalse();
  });


  it('should set error message when no allergies are found', () => {

    component.code = 'Al456';
    const searchValues = { code: 'Al456'};

    component.handleSearch(searchValues);

    fixture.detectChanges();

    expect(component.allergyList).toEqual([]);
    expect(component.error).toBe('');
  });

  it('should handle errors when allergy search fails', () => {
    mockAllergyService.filterAllergies.and.returnValue(throwError(() => ({ status: 500 })));

    const searchValues = { designation: 'Nonexistent' };

    component.handleSearch(searchValues);
    fixture.detectChanges();

    expect(component.error).toBe('Connection failed.');
    expect(component.isLoading).toBeFalse();
    expect(component.allergyList).toEqual([]);
  });

  it('should load all allergies', () => {
    component.code = '';
    component.designation = '';

    component.getAllergies();

    fixture.detectChanges();

    expect(component.allergyList.length).toBe(1);
    expect(component.allergyList[0].code).toBe('A123');
    expect(component.allergyList[0].designation).toBe('Marisco');
    expect(component.allergyList[0].description).toBe('Provoca falta de ar e comichao');

  });

  it('should show error message if no allergies are found on init', () => {
    mockAllergyService.filterAllergies.and.returnValue(of([]));

    component.ngOnInit();
    fixture.detectChanges();

    expect(mockAllergyService.filterAllergies).toHaveBeenCalled();
    expect(component.allergyList.length).toBe(0);
    expect(component.error).toBe('');
    expect(component.isLoading).toBeFalse();
  });

});

