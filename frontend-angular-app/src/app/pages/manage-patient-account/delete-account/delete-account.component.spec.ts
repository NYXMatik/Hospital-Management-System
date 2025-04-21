import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DeleteAccountComponent } from './delete-account.component';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

describe('DeleteAccountComponent', () => {
  let component: DeleteAccountComponent;
  let fixture: ComponentFixture<DeleteAccountComponent>;
  let httpTestingController: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteAccountComponent],
      imports: [HttpClientTestingModule, RouterTestingModule], // Import HttpClientTestingModule for HTTP testing
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteAccountComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    httpTestingController = TestBed.inject(HttpTestingController); // Inject HttpTestingController for HTTP requests
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call onDeleteAccount and navigate to login on success', () => {
    // Spy on the router's navigate method
    spyOn(router, 'navigate');

    // Mocking the HTTP delete request response
    spyOn(window, 'confirm').and.returnValue(true); // Simulating confirmation

    component.onDeleteAccount();

    // Simulate a successful response from the HTTP request
    const req = httpTestingController.expectOne('http://localhost:5005/api/v1/PatientAccount/someUserId'); // Replace with actual userId
    expect(req.request.method).toBe('DELETE');
    req.flush({}); // Respond with empty body for success

    // Check if the router navigates to the login page
    expect(router.navigate).toHaveBeenCalledWith(['/login']);

    // Check if success message is set
    expect(component.deletionSuccess).toBe('Your account and all associated data have been deleted successfully.');
    expect(component.isDeleting).toBeFalse(); // Ensure deletion process finished
  });

  it('should show an error message if deletion fails', () => {
    // Spy on the router's navigate method
    spyOn(router, 'navigate');

    // Mocking the HTTP delete request failure
    spyOn(window, 'confirm').and.returnValue(true); // Simulating confirmation

    component.onDeleteAccount();

    // Simulate an error response from the HTTP request
    const req = httpTestingController.expectOne('http://localhost:5005/api/v1/PatientAccount/someUserId');
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Error deleting account' }, { status: 500, statusText: 'Server Error' });

    // Check if the error message is set
    expect(component.deletionError).toBe('An error occurred while trying to delete your account. Please try again later.');
    expect(component.isDeleting).toBeFalse(); // Ensure deletion process finished
  });

  it('should show alert if user ID is missing', () => {
    spyOn(window, 'alert'); // Spy on the alert method
    spyOn(window, 'confirm').and.returnValue(true); // Simulate confirmation

    // Clear user data in localStorage to simulate missing user ID
    localStorage.removeItem('user');

    component.onDeleteAccount();

    // Verify alert was called
    expect(window.alert).toHaveBeenCalledWith('User ID is missing. Please log in again or contact support.');
  });

  it('should not delete account if user cancels the confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(false); // Simulating cancel confirmation

    component.onDeleteAccount();

    // Ensure HTTP request is not made
    httpTestingController.expectNone('http://localhost:5005/api/v1/PatientAccount/someUserId');
  });
});
