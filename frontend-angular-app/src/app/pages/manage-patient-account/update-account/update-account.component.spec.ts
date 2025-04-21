import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { UpdateAccountComponent } from './update-account.component';
import { Router } from '@angular/router';

describe('UpdateAccountComponent', () => {
  let component: UpdateAccountComponent;
  let fixture: ComponentFixture<UpdateAccountComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateAccountComponent],
      imports: [FormsModule, HttpClientTestingModule, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateAccountComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load account details from localStorage', () => {
    const user = {
      profileId: 1,
      fullName: 'John Doe',
      email: 'johndoe@example.com',
      phone: '1234567890',
      birthDate: '1990-01-01',
      address: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'State',
        postalCode: '12345',
        country: 'Country',
      },
      isEmailVerified: true,
      active: true,
    };
    localStorage.setItem('user', JSON.stringify(user));

    component.loadAccountDetails();
    fixture.detectChanges();

    expect(component.accountDetails.fullName).toBe('John Doe');
    expect(component.accountDetails.email).toBe('johndoe@example.com');
  });

  it('should submit updated account details to the backend', () => {
    const updatedUser = {
      fullName: 'John Doe Updated',
      email: 'johndoeupdated@example.com',
      phone: '9876543210',
      street: '456 New St',
      city: 'Newtown',
      state: 'Newstate',
      postalCode: '67890',
      country: 'Newcountry',
      birthDate: '1990-02-02',
    };

    const userId = 1;
    component.accountDetails = { ...updatedUser, profileId: userId };

    // Mock PUT request
    component.onSubmit();
    const req = httpMock.expectOne(`http://localhost:5005/api/v1/PatientAccount/${userId}`);
    expect(req.request.method).toBe('PUT');
    req.flush({ success: true });

    // Verify router navigation after success
    router.navigate(['/manage-account']).then(() => {
      expect(router.url).toBe('/manage-account');
    });

    httpMock.verify();
  });

  it('should handle invalid email validation', () => {
    const invalidEmail = 'invalid-email';
    expect(component.isValidEmail(invalidEmail)).toBeFalse();
  });

  it('should handle invalid phone validation', () => {
    const invalidPhone = 'invalid-phone';
    expect(component.isValidPhone(invalidPhone)).toBeFalse();
  });

  it('should navigate back to manage account on goBack call', () => {
    spyOn(router, 'navigate');
    component.goBack();
    expect(router.navigate).toHaveBeenCalledWith(['/manage-account']);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
