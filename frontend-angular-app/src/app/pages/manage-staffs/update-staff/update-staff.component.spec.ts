import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateStaffComponent } from './update-staff.component';
import { MockStaffService } from '../mock-staff.service';
import { StaffService } from '../../../services/staff.service';
import { ActivatedRoute, Router } from '@angular/router';
import { throwError } from 'rxjs';

describe('UpdateStaffComponent', () => {
  let component: UpdateStaffComponent;
  let fixture: ComponentFixture<UpdateStaffComponent>;
  let mockService: MockStaffService;

  const mockActivatedRoute = {
    snapshot: {
      params: {},
    },
    getCurrentNavigation: () => ({
      extras: {
        state: {
          staff: {
            id: 'D2000000001',
            fullName: 'Ana Maria',
            licenseNumber: '12345',
            email: 'ana@gmail.com',
            phoneNumber: '+234 5467394700',
            recruitmentYear: 2000,
            category: 'Doctor',
            specialization: 'Orthopedics',
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
      imports: [UpdateStaffComponent],
      providers: [
        { provide: StaffService, useClass: MockStaffService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateStaffComponent);
    component = fixture.componentInstance;
    mockService = TestBed.inject(StaffService) as unknown as MockStaffService;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update staff successfully', () => {
    const updatedStaff = {
      id: 'D2000000001',
      fullName: 'Ana Maria Silva', // Atualização do nome
      licenseNumber: '12345',
      email: 'ana@gmail.com',
      phoneNumber: '+234 5467394700',
      recruitmentYear: 2000,
      category: 'Doctor',
      specialization: 'Orthopedics',
    };

    expect(component.staff.fullName).toBe('Ana Maria');

    component.staff = updatedStaff;
    component.onSubmit();

    expect(mockService.updateStaff).toHaveBeenCalledWith(updatedStaff);
    expect(component.message).toBe('Staff updated successfully!');
    expect(component.updatedStaff).toEqual(updatedStaff);
    expect(component.staff.fullName).toBe('Ana Maria Silva');
    expect(mockService.staffUpdatedSource.next).toHaveBeenCalled();
  });

  it('should show error message when email is invalid', () => {
    const updatedStaff = {
      id: 'D2000000001',
      fullName: 'Ana Maria Silva',
      licenseNumber: '12345',
      email: 'invalid-email', // Email inválido
      phoneNumber: '+234 5467394700',
      recruitmentYear: 2000,
      category: 'Doctor',
      specialization: 'Orthopedics',
    };

    // Inicializa com dados válidos
    component.staff = { ...updatedStaff, email: 'ana@gmail.com' };

    // Simula erro no serviço para o email
    mockService.updateStaff.and.returnValue(throwError(() => ({
      status: 400,
      error: { errors: ['Invalid email format'] }
    })));

    component.onSubmit();

    // Verifica se a mensagem de erro foi configurada corretamente
    expect(component.message).toBe('Error updating Staff profile. Please verify the following:<br>- Invalid email format');
  });

  it('should show error message when phone number is invalid', () => {
    const updatedStaff = {
      id: 'D2000000001',
      fullName: 'Ana Maria Silva',
      licenseNumber: '12345',
      email: 'ana@gmail.com',
      phoneNumber: 'invalid-phone', // Número de telefone inválido
      recruitmentYear: 2000,
      category: 'Doctor',
      specialization: 'Orthopedics',
    };

    // Inicializa com dados válidos
    component.staff = { ...updatedStaff, phoneNumber: '+234 5467394700' };

    // Simula erro no serviço para o telefone
    mockService.updateStaff.and.returnValue(throwError(() => ({
      status: 400,
      error: { errors: ['Invalid phone number format'] }
    })));

    component.onSubmit();

    expect(component.message).toBe('Error updating Staff profile. Please verify the following:<br>- Invalid phone number format');
  });

  it('should display an error message when updateStaff fails', () => {
    mockService.updateStaff.and.returnValue(
      throwError(() => ({
        status: 400,
        error: { errors: ['Invalid email format', 'Phone number is required'] }
      }))
    );

    component.staff = { id: '12345', fullName: '', licenseNumber: '', email: '', phoneNumber: '', recruitmentYear: 0, category: '', specialization: '' };
    component.onSubmit();
    //console.log("Message", component.message);

    expect(mockService.updateStaff).toHaveBeenCalled();
    expect(component.message).toContain('Error updating Staff profile'); // Mensagem geral
    expect(component.message).toContain('Error updating Staff profile. Please verify the following:<br>- Invalid email format<br>- Phone number is required'); // Detalhes do erro
    expect(component.message).toContain('Invalid email format');
    expect(component.message).toContain('Phone number is required');
    expect(component.updatedStaff).toBeNull();
  });

});


