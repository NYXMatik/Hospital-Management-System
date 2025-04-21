import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { environment } from './environment';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    
    {
      provide: 'API_URL',
      useValue: environment.apiUrl,
    },
    {
      provide: 'STAFF_API_URL',
      useValue: `${environment.apiUrl}${environment.endpoints.staff}`,
    },
    {
      provide: 'PATIENT_PROFILE_API_URL',
      useValue: `${environment.apiUrl}${environment.endpoints.patient_profile}`,
    },
    {
      provide: 'OPERATION_TYPE_API_URL',
      useValue: `${environment.apiUrl}${environment.endpoints.operation_type}`,
    },
    {
      provide: 'PATIENT_ACCOUNT_API_URL',
      useValue: `${environment.apiUrl}${environment.endpoints.patient_account}`,
    },
    {
      provide: 'ALLERGY_API_URL',
      useValue: `${environment.apiUrl}${environment.endpoints.allergy}`,
    },
    {
      provide: 'MEDICAL_CONDITIONS_API_URL',
      useValue: `${environment.apiUrl}${environment.endpoints.medicalCondition}`,
    },
    {
      provide: 'MEDICAL_RECORDS_API_URL',
      useValue: `${environment.apiUrl}${environment.endpoints.medicalRecord}`,
    },
  ]
};