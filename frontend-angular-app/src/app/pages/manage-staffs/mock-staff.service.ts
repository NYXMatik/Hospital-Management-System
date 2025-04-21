import { Injectable } from '@angular/core';
import { Observable, of, throwError, Subject } from 'rxjs';
import { Staff } from '../../models/staff.model'

@Injectable({ providedIn: 'root' })
export class MockStaffService {
  private mockStaff: Staff[] = [
    {
      id: 'D2000000001',
      fullName: 'Ana Maria',
      licenseNumber: '12345',
      email: 'ana@gmail.com',
      phoneNumber: '+234 5467394700',
      recruitmentYear: 2000,
      category: 'Doctor',
      specialization: 'Orthopedics'
    }
  ];

  staffUpdatedSource = {
    next: jasmine.createSpy('next'),
  };
  // Subject para simular atualizações
  staffUpdated$ = new Subject<void>();

  createStaff = jasmine.createSpy('createStaff').and.callFake((staff: Staff) => {
    // Adiciona o staff aos dados fictícios e retorna um Observable simulando sucesso.
    this.mockStaff.push(staff);
    return of(staff);
  });

  getSpecializations = jasmine
    .createSpy('getSpecializations')
    .and.returnValue(Promise.resolve(['Cardiology', 'Neurology', 'Orthopedics']
  ));

  updateStaff = jasmine.createSpy('updateStaff').and.callFake((staff: Staff) => {
    const index = this.mockStaff.findIndex((s) => s.id === staff.id);
    if (index !== -1) {
      // Atualiza os dados do staff no mock
      this.mockStaff[index] = { ...this.mockStaff[index], ...staff };
      return of(this.mockStaff[index]); // Retorna o staff atualizado
    }
    return throwError(() => new Error('Staff not found')); // Simula erro caso não encontre
  });


  getStaffs = jasmine.createSpy('getStaffs').and.returnValue(of(
    { body: this.mockStaff, status: 200 }
  ));

  filterStaffs = jasmine.createSpy('filterStaffs').and.callFake((name?: string, email?: string, specialization?: string) => {
      let filteredStaff = this.mockStaff;
      if (name) filteredStaff = filteredStaff.filter((staff) => staff.fullName.includes(name));
      if (email) filteredStaff = filteredStaff.filter((staff) => staff.email.includes(email));
      if (specialization)
        filteredStaff = filteredStaff.filter((staff) => staff.specialization.includes(specialization));
      return of({ body: filteredStaff, status: 200 });
  });

  getStaffById = jasmine.createSpy('getStaffById').and.callFake((id: string) => {
    const staff = this.mockStaff.find((s) => s.id === id);
    if (staff) {
      return of({ body: staff, status: 200 });
    }
    return throwError(() => new Error('Staff not found'));
  });

  deactivateStaff = jasmine.createSpy('deactivateStaff').and.callFake((id: string) => {
    const index = this.mockStaff.findIndex((s) => s.id === id);

    if (index !== -1) {
      this.mockStaff.splice(index, 1);  // Remove o staff da lista
      return of({ message: 'Staff deactivated successfully' });  // Retorno de sucesso (200)
    }

    // Caso o staff não seja encontrado, simula erro de servidor 500
    return throwError(() => ({ status: 500, message: 'Server error' }));
  });


}
