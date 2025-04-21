import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ManageAccountComponent } from './account-manager.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

describe('ManageAccountComponent', () => {
  let component: ManageAccountComponent;
  let fixture: ComponentFixture<ManageAccountComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageAccountComponent],
      imports: [RouterTestingModule, CommonModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageAccountComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load account details from localStorage', () => {
    const mockUser = {
      fullName: 'John Doe',
      email: 'john@example.com',
      phoneNumber: '1234567890',
      profileId: 1,
      isEmailVerified: true,
      appointments: [{ date: '2024-11-25', time: '10:00 AM' }]
    };

    localStorage.setItem('user', JSON.stringify(mockUser));
    component.loadAccountDetails();
    expect(component.accountDetails).toEqual(mockUser);
    expect(component.appointments).toEqual(mockUser.appointments);
  });

  it('should handle missing user in localStorage gracefully', () => {
    localStorage.removeItem('user');
    component.loadAccountDetails();
    expect(component.accountDetails.fullName).toBe('Unknown User');
    expect(component.appointments).toEqual([]);
  });

  it('should update the account and navigate to the update page', () => {
    spyOn(localStorage, 'setItem');
    spyOn(router, 'navigate');
    component.updateAccount();
    expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(component.accountDetails));
    expect(router.navigate).toHaveBeenCalledWith(['/manage-patient-account/update']);
  });

  it('should navigate to delete page with profile ID', () => {
    component.accountDetails.profileId = 1;
    spyOn(router, 'navigate');
    component.deleteAccount();
    expect(router.navigate).toHaveBeenCalledWith(['/manage-patient-account/delete', 1]);
  });

  it('should alert if profile ID is missing during account deletion', () => {
    spyOn(window, 'alert');
    component.accountDetails.profileId = null;
    component.deleteAccount();
    expect(window.alert).toHaveBeenCalledWith('User ID is missing. Cannot delete the account.');
  });

  it('should navigate to book appointment page', () => {
    component.accountDetails.profileId = 1;
    spyOn(router, 'navigate');
    component.bookAppointment();
    expect(router.navigate).toHaveBeenCalledWith(['/manage-patient-account/book-appointment', 1]);
  });
});
