import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStaffService } from '../mock-staff.service';
import { CreateStaffComponent } from './create-staff.component';
import { StaffService } from '../../../services/staff.service';
import { throwError } from 'rxjs';

describe('CreateStaffComponent', () => {
  let component: CreateStaffComponent;
  let fixture: ComponentFixture<CreateStaffComponent>;
  let mockService: MockStaffService;

  const newStaff = {
    id: 'D2000000001', 
    fullName: 'Ana Maria', 
    licenseNumber: '12345',
    email: 'ana@gmail.com', 
    phoneNumber: '+234 5467394700', 
    recruitmentYear: 2000,
    category: 'Doctor', 
    specialization: 'Orthopedics'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateStaffComponent],
      providers: [{ provide: StaffService, useClass: MockStaffService }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateStaffComponent);
    component = fixture.componentInstance;
    mockService = TestBed.inject(StaffService) as unknown as MockStaffService; 
    fixture.detectChanges();
  });

  it('should create', async () => {
    await fixture.whenStable();
    expect(component).toBeTruthy();
  });

  it('should create a staff and update the message', async () => {
    await fixture.whenStable();

    component.staff = newStaff;
    component.onSubmit();

    expect(mockService.createStaff).toHaveBeenCalledWith(newStaff);
    expect(component.message).toContain('Staff created successfully!');
    expect(component.createdStaff).toEqual(newStaff);
  });

  it('should display an error message when createStaff fails with 400 status', async () => {
    await fixture.whenStable();

    mockService.createStaff.and.returnValue(
      throwError(() => ({ status: 400, error: 'Error creating Staff' }))
    );

    component.onSubmit();

    expect(component.message).toContain('Error creating Staff profile');
    expect(component.createdStaff).toBeNull();
  });

  it('should display an error message when createStaff fails with 500 status', async () => {
    await fixture.whenStable();

    mockService.createStaff.and.returnValue(
      throwError(() => ({ status: 500, message: 'Server error' }))
    );

    component.onSubmit();

    expect(component.message).toContain('Error creating Staff profile. Connection failed!');
    expect(component.createdStaff).toBeNull();
  });

  it('should reset the form when createNewStaff is called', () => {
    // Simulating the user filling out the form
    component.staff = { ...newStaff };
    component.message = 'Staff created successfully!';
    component.createdStaff = newStaff;

    // Calling the method to reset the form
    component.createNewStaff();

    // Expect that the staff is reset to its initial state
    expect(component.staff).toEqual({
      id: '',
      fullName: '',
      licenseNumber: '',
      email: '',
      phoneNumber: '',
      recruitmentYear: new Date().getFullYear(),
      category: '',
      specialization: ''
    });
    expect(component.message).toBe('');
    expect(component.createdStaff).toBeNull();
  });

  it('should toggle expansion state when toggleExpansion is called', () => {
    expect(component.isExpanded).toBe(false);
    component.toggleExpansion();
    expect(component.isExpanded).toBe(true);
    component.toggleExpansion();
    expect(component.isExpanded).toBe(false);
  });
});

