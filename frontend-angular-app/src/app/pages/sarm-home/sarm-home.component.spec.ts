import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SARMHomeComponent } from './sarm-home.component';

describe('SARMHomeComponent', () => {
  let component: SARMHomeComponent;
  let fixture: ComponentFixture<SARMHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SARMHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SARMHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
