import { Injectable } from '@angular/core';
import { Observable, of, throwError, Subject } from 'rxjs';
import { MedicalCondition } from '../../../models/medical-condition.model'

@Injectable({ providedIn: 'root' })
export class MockMedicalConditionsService {
  private mockMedicalCondition: MedicalCondition[] = [
    {
      code: 'MIG007',
      designation: 'Migraine',
      description: 'A neurological condition characterized by recurrent headaches that are often accompanied by other symptoms such as nausea, sensitivity to light, and visual disturbances.',
      commonSymptoms: ['Moderate to severe headache, often on one side of the head',
        'Sensitivity to light and sound', 'Nausea and vomiting']
    }
  ];

  medicalConditionUpdatedSource = {
    next: jasmine.createSpy('next'),
  };

  // Subject para simular atualizações
  medicalConditionUpdated$ = new Subject<void>();

  createMedicalCondition = jasmine.createSpy('createMedicalCondition').and.callFake((medicalCondition: MedicalCondition) => {
    // Adiciona o Medical Condition aos dados fictícios e retorna um Observable simulando sucesso.
    this.mockMedicalCondition.push(medicalCondition);
    return of(medicalCondition);
  });

  updateMedicalCondition = jasmine.createSpy('updateMedicalCondition').and.callFake((medicalCondition: MedicalCondition) => {
    const index = this.mockMedicalCondition.findIndex((m) => m.code === medicalCondition.code);
    if (index !== -1) {
      // Atualiza os dados do staff no mock
      this.mockMedicalCondition[index] = { ...this.mockMedicalCondition[index], ...medicalCondition };
      return of(this.mockMedicalCondition[index]); // Retorna o staff atualizado
    }
    return throwError(() => new Error('Medical Condition not found')); // Simula erro caso não encontre
  });

  listAndfilterMedicalConditions = jasmine.createSpy('listAndfilterMedicalConditions').and.callFake((code?: string, designation?: string) => {
      let filteredMedicalCondition = this.mockMedicalCondition;
      if (code) filteredMedicalCondition = filteredMedicalCondition.filter((medicalCondition) => medicalCondition.code.includes(code));
      if (designation) filteredMedicalCondition = filteredMedicalCondition.filter((medicalCondition) => medicalCondition.designation.includes(designation));
      
      return of({ body: filteredMedicalCondition, status: 200 });
    
  });
    
}
