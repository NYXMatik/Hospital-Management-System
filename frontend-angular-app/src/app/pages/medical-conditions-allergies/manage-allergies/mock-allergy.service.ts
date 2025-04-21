import { Injectable } from '@angular/core';
import { Observable, of, throwError, Subject } from 'rxjs';
import { Allergy } from '../../../models/allergy';

@Injectable({ providedIn: 'root' })
export class MockAllergyService {
  private mockAllergy: Allergy[] = [
    {
      code: 'A123',
      designation: 'Marisco',
      description: 'Provoca falta de ar e comichao'
    }
  ];

  allergyUpdatedSource = {
    next: jasmine.createSpy('next'),
  };

  // Subject para simular atualizações
  allergyUpdated$ = new Subject<void>();

  createAllergy = jasmine.createSpy('createAllergy').and.callFake((allergy: Allergy) => {
    // Adiciona a Alergia aos dados fictícios e retorna um Observable simulando sucesso.
    this.mockAllergy.push(allergy);
    return of(allergy);
  });

  updateAllergy = jasmine.createSpy('updateAllergy').and.callFake((allergy: Allergy) => {
    const index = this.mockAllergy.findIndex((m) => m.code === allergy.code);
    if (index !== -1) {
      // Atualiza os dados da allergy no mock
      this.mockAllergy[index] = { ...this.mockAllergy[index], ...allergy };
      return of(this.mockAllergy[index]); // Retorna a allergy atualizado
    }
    return throwError(() => new Error('Allergy not found')); // Simula erro caso não encontre
  });

  filterAllergies = jasmine.createSpy('filterAllergies').and.callFake((code?: string, designation?: string) => {
      let filteredAllergy = this.mockAllergy;
      if (code) filteredAllergy = filteredAllergy.filter((allergy) => allergy.code.includes(code));
      if (designation) filteredAllergy = filteredAllergy.filter((allergy) => allergy.designation.includes(designation));

      return of({ body: filteredAllergy, status: 200 });

  });

}
