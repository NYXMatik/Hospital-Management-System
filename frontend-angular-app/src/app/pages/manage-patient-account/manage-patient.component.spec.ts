import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ManagePatientAccountComponent } from './manage-patient-account.component';
import { Router } from '@angular/router';

describe('ManagePatientAccountComponent', () => {
  let component: ManagePatientAccountComponent;
  let fixture: ComponentFixture<ManagePatientAccountComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagePatientAccountComponent],
      imports: [RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ManagePatientAccountComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to login route when redirectToLogin is called', () => {
    spyOn(router, 'navigate');
    component.redirectToLogin();
    expect(router.navigate).toHaveBeenCalledWith(['/manage-patient-account/login']);
  });

  it('should navigate to register route when redirectToRegister is called', () => {
    spyOn(router, 'navigate');
    component.redirectToRegister();
    expect(router.navigate).toHaveBeenCalledWith(['/manage-patient-account/register']);
  });
});
