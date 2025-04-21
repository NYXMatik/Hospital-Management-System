import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { RegisterPatientComponent } from './register-patient.component';

describe('RegisterPatientComponent', () => {
  let component: RegisterPatientComponent;
  let fixture: ComponentFixture<RegisterPatientComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule],
      declarations: [RegisterPatientComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPatientComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify(); // Ensure no outstanding requests remain
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize patient object with empty fields', () => {
    expect(component.patient).toEqual({
      fullName: '',
      email: '',
      phone: '',
      birthDate: '',
      address: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      },
    });
  });

  it('should validate email addresses correctly', () => {
    expect(component.isValidEmail('test@example.com')).toBeTrue();
    expect(component.isValidEmail('invalid-email')).toBeFalse();
  });

  it('should validate address object correctly', () => {
    const validAddress = {
      street: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      postalCode: '62701',
      country: 'USA',
    };

    const invalidAddress = {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    };

    expect(component.isValidAddress(validAddress)).toBeTrue();
    expect(component.isValidAddress(invalidAddress)).toBeFalse();
  });

  it('should validate patient data correctly', () => {
    const validPatient = {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '123456789',
      birthDate: '1990-01-01',
      address: {
        street: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        postalCode: '62701',
        country: 'USA',
      },
    };

    const invalidPatient = {
      fullName: '',
      email: '',
      phone: '',
      birthDate: '',
      address: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      },
    };

    expect(component.isValidPatient(validPatient)).toBeTrue();
    expect(component.isValidPatient(invalidPatient)).toBeFalse();
  });

  it('should reset the form fields correctly', () => {
    component.patient.fullName = 'John Doe';
    component.patient.address.street = '123 Main St';

    component.resetForm();

    expect(component.patient).toEqual({
      fullName: '',
      email: '',
      phone: '',
      birthDate: '',
      address: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      },
    });
  });

  it('should send patient data to the backend', () => {
    const validPatient = {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '123456789',
      birthDate: '1990-01-01',
      address: {
        street: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        postalCode: '62701',
        country: 'USA',
      },
    };

    component.patient = validPatient;
    component.onSubmit();

    const req = httpTestingController.expectOne('http://localhost:5005/api/v1/PatientAccount/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(validPatient);

    req.flush({ message: 'Patient registered successfully' });
  });

  it('should handle backend errors correctly', () => {
    spyOn(window, 'alert');
    component.patient = {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '123456789',
      birthDate: '1990-01-01',
      address: {
        street: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        postalCode: '62701',
        country: 'USA',
      },
    };

    component.onSubmit();

    const req = httpTestingController.expectOne('http://localhost:5005/api/v1/PatientAccount/register');
    expect(req.request.method).toBe('POST');

    req.flush({ Errors: ['Email is already in use.'] }, { status: 400, statusText: 'Bad Request' });

    expect(window.alert).toHaveBeenCalledWith('Email is already in use.');
  });
});
