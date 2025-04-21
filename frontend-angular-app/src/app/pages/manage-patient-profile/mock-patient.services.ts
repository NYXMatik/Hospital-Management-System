import { Injectable } from '@angular/core';
import { Observable, of, throwError, Subject } from 'rxjs';
import { PatientProfile } from '../../models/patient-profile';

@Injectable({ providedIn: 'root' })
export class MockPatientService {
  private mockPatient: PatientProfile[] = [
    {
      medicalRecordNum: '202411000001',
      fullName: 'Ana Sousa',
      email: 'ana@example.com',
      phoneNumber: '+351 987654321',
      gender: 'Female',
      birth: '1990-01-01',
      emergencyContact: '+351 966222111'
    }
  ];

  patientUpdatedSource = {
    next: jasmine.createSpy('next'),
  };
  // Subject para simular atualizações
  patientUpdated$ = new Subject<void>();

  createPatient = jasmine.createSpy('createPatient').and.callFake((patient: PatientProfile) => {
    // Adiciona o patient aos dados fictícios e retorna um Observable simulando sucesso.
    this.mockPatient.push(patient);
    return of(patient);
  });

  updatePatient = jasmine.createSpy('updatePatient').and.callFake((patient: PatientProfile) => {
    const index = this.mockPatient.findIndex((p) => p.medicalRecordNum === patient.medicalRecordNum);
    if (index !== -1) {
      // Atualiza os dados do patient no mock
      this.mockPatient[index] = { ...this.mockPatient[index], ...patient };
      return of(this.mockPatient[index]); // Retorna o patient atualizado
    }
    return throwError(() => new Error('Patient not found')); // Simula erro caso não encontre
  });

  getPatients = jasmine.createSpy('getPatients').and.returnValue(of(
    { body: this.mockPatient, status: 200 }
  ));

  filterPatients = jasmine.createSpy('filterPatients').and.callFake((name?: string, email?: string, phoneNumber?: string, birth?: string, gender?: string) => {
    let filteredPatient = this.mockPatient;
    if (name) filteredPatient = filteredPatient.filter((patient) => patient.fullName.includes(name));
    if (email) filteredPatient = filteredPatient.filter((patient) => patient.email.includes(email));
    if (phoneNumber) filteredPatient = filteredPatient.filter((patient) => patient.phoneNumber.includes(phoneNumber));
    if (birth) filteredPatient = filteredPatient.filter((patient) => patient.birth.includes(birth));
    if (gender) filteredPatient = filteredPatient.filter((patient) => patient.gender.includes(gender));
    return of({ body: filteredPatient, status: 200 });
  });

  getPatientById = jasmine.createSpy('getPatientById').and.callFake((id: string) => {
    const patient = this.mockPatient.find((p) => p.medicalRecordNum === id);
    if (patient) {
      return of({ body: patient, status: 200 });
    }
    return throwError(() => new Error('Patient not found'));
  });

  deactivatePatient = jasmine.createSpy('deactivatePatient').and.callFake((id: string) => {
    const index = this.mockPatient.findIndex((p) => p.medicalRecordNum === id);

    if (index !== -1) {
      this.mockPatient.splice(index, 1);  // Remove o patient da lista
      return of({ message: 'Patient deactivated successfully' });  // Retorno de sucesso (200)
    }

    // Caso o patient não seja encontrado, simula erro de servidor 500
    return throwError(() => ({ status: 500, message: 'Server error' }));
  });


}
