import { Routes } from '@angular/router';

import { SARMHomeComponent } from './pages/sarm-home/sarm-home.component';
import { AdminLayoutComponent } from './pages/admin-home/admin-home.component';

import { ManagePatientComponent } from './pages/manage-patient-profile/manage-patient-profile.component';
import { CreatePatientProfileComponent } from './pages/manage-patient-profile/create-patient-profile/create-patient-profile.component';
import { SearchPatientProfileComponent } from './pages/manage-patient-profile/search-patient-profile/search-patient-profile.component';
import { UpdatePatientProfileComponent } from './pages/manage-patient-profile/update-patient-profile/update-patient-profile.component';

import { ManageStaffsComponent } from './pages/manage-staffs/manage-staffs.component';
import { CreateStaffComponent } from './pages/manage-staffs/create-staff/create-staff.component';
import { SearchStaffComponent } from './pages/manage-staffs/search-staff/search-staff.component';
import { UpdateStaffComponent } from './pages/manage-staffs/update-staff/update-staff.component';

import { LoginPatientAccountComponent } from './pages/manage-patient-account/login-patient-account/login-patient-account.component';  // Import the Login component
import { ManagePatientAccountComponent } from './pages/manage-patient-account/manage-patient-account.component';
import { RegisterPatientComponent } from './pages/manage-patient-account/register-patient-account/register-patient.component'; // Import the new component
import { DeleteAccountComponent } from './pages/manage-patient-account/delete-account/delete-account.component';
import { ManageAccountComponent } from './pages/manage-patient-account/login-patient-account/account-manager.component';
import { UpdateAccountComponent } from './pages/manage-patient-account/update-account/update-account.component';
import { BookAppointmentComponent } from './pages/manage-patient-account/book-appointment/book-appointment.component';

import { ManageOperationTypeComponent } from './pages/manage-operations/manage.operation.type.component';
import { SearchOperationComponent } from './pages/manage-operations/operation-search/operation-search.component';
import { CreateOperationComponent } from './pages/manage-operations/operation-create/create-operation.component';
import { OperationDisableComponent } from './pages/manage-operations/operation-disable/operation-disable.component';
import { UpdateOperationComponent } from './pages/manage-operations/operation-update/operation-update.component';
import { ThreeRendererComponent } from './pages/render-3d/view-port/view-port.component';

import { MedicalConditionsAllergiesComponent } from './pages/medical-conditions-allergies/medical-conditions-allergies.component';
import { ManageAllergiesComponent } from './pages/medical-conditions-allergies/manage-allergies/manage-allergies.component';
import { ManageMedicalConditionsComponent } from './pages/medical-conditions-allergies/manage-medical-conditions/manage-medical-conditions.component';
import { CreateAllergyComponent } from './pages/medical-conditions-allergies/manage-allergies/create-allergy/create-allergy.component';
import { SearchAllergiesComponent } from './pages/medical-conditions-allergies/manage-allergies/search-allergy/search-allergies.component';
import { UpdateAllergyComponent } from './pages/medical-conditions-allergies/manage-allergies/update-allergy/update-allergy.component';

import { CreateMedicalConditionsComponent } from './pages/medical-conditions-allergies/manage-medical-conditions/create-medical-conditions/create-medical-conditions.component';
import { SearchMedicalConditionsComponent } from './pages/medical-conditions-allergies/manage-medical-conditions/search-medical-conditions/search-medical-conditions.component';
import { UpdateMedicalConditionsComponent } from './pages/medical-conditions-allergies/manage-medical-conditions/update-medical-conditions/update-medical-conditions.component';

import { ManageMedicalRecordsComponent } from './pages/manage-medical-records/manage-medical-records.component';
import { ListAllergiesComponent } from './pages/medical-conditions-allergies/list-allergies-to-add/list-allergies.component';
import { ListMedicalConditionsComponent } from './pages/medical-conditions-allergies/list-medical-conditions-to-add/list-medical-conditions.component';
import { Component } from '@angular/core';

import { RecordAddComponent } from './pages/manage-medical-records/record-add/record-add.component';
import { RecordListComponent } from './pages/manage-medical-records/record-list/record-list.component';

import { RecordListConditionComponent } from './pages/manage-medical-record-condition/record-list-condition/record-list-condition.component';
import { RecordAddConditionComponent } from './pages/manage-medical-record-condition/record-add-condition/record-add-condition.component';
import { RecordSearchConditionComponent } from './pages/manage-medical-record-condition/record-search-condition/record-search-condition.component';
import { RecordUpdateConditionComponent } from './pages/manage-medical-record-condition/record-update-condition/record-update-condition.component';

import { RecordListAllergyComponent } from './pages/manage-medical-record-allergy/record-list-allergy/record-list-allergy.component';
import { RecordAddAllergyComponent } from './pages/manage-medical-record-allergy/record-add-allergy/record-add-allergy.component';
import { RecordUpdateAllergyComponent } from './pages/manage-medical-record-allergy/record-update-allergy/record-update-allergy.component';
import { ManagePlanningComponent } from './pages/manage-planning/manage-planning.component';

export const routes: Routes = [

  { path: '', component: SARMHomeComponent },
  //{ path: '', component: ListAllergiesComponent },
  //{ path: '', component: ListMedicalConditionsComponent },

  {
    path: 'admin', component: AdminLayoutComponent, // Layout principal do Admin
    children: [

      {
        path: 'three-renderer', component: ThreeRendererComponent
      },

      { path: '', redirectTo: 'manage-patient-profile', pathMatch: 'full' },

      { path: 'medical-conditions-allergies', component: MedicalConditionsAllergiesComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'dual-view',
          },
          // Rota auxiliar que configura os outlets nomeados
          {
            path: 'dual-view',
            children: [
              { path: '', outlet: 'manage-allergies', component: ManageAllergiesComponent,
                children: [
                  //{ path: '', redirectTo: 'search', pathMatch: 'full' },
                  {
                    path: '',
                    pathMatch: 'full',
                    redirectTo: 'dual-view',
                  },
                  // Rota auxiliar que configura os outlets nomeados
                  {
                    path: 'dual-view',
                    children: [
                      { path: '', outlet: 'create', component: CreateAllergyComponent },
                      { path: '', outlet: 'search', component: SearchAllergiesComponent,
                        children:[
                          { path: 'update', component: UpdateAllergyComponent },
                        ]
                      },
                    ],
                  },
                ]
              },

              { path: '', outlet: 'manage-medical-conditions', component: ManageMedicalConditionsComponent,
                children: [
                  //{ path: '', redirectTo: 'search', pathMatch: 'full' },
                  {
                    path: '',
                    pathMatch: 'full',
                    redirectTo: 'dual-view',
                  },
                  // Rota auxiliar que configura os outlets nomeados
                  {
                    path: 'dual-view',
                    children: [
                      { path: '', outlet: 'create', component: CreateMedicalConditionsComponent },
                      { path: '', outlet: 'search', component: SearchMedicalConditionsComponent,
                        children:[
                          { path: 'update', component: UpdateMedicalConditionsComponent },
                        ]
                      },
                    ],
                  },
                ]
              },
            ]
          },
        ]
      },

      {
        path: 'manage-planning', component: ManagePlanningComponent,
      },

      { path: 'manage-patient-profile', component: ManagePatientComponent,
        children: [
          //{ path: '', redirectTo: 'search', pathMatch: 'full' },
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'dual-view',
          },
          // Rota auxiliar que configura os outlets nomeados
          {
            path: 'dual-view',
            children: [
              { path: '', outlet: 'create', component: CreatePatientProfileComponent },
              { path: '', outlet: 'search', component: SearchPatientProfileComponent,
                children:[
                  { path: 'update', component: UpdatePatientProfileComponent },
                ]
              },
            ],
          },
        ]
      },
      {
        path: 'manage-operations',
        component: ManageOperationTypeComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'dual-view',
          },
          {
            path: 'dual-view',
            children: [
              {
                path: '',
                outlet: 'create',
                component: CreateOperationComponent
              },
              {
                path: '',
                outlet: 'search',
                component: SearchOperationComponent,
                children: [
                  {
                    path: 'update',
                    component: UpdateOperationComponent
                  },
                  {
                    path: 'disable',
                    component: OperationDisableComponent
                  }
                ]
              }
            ]
          }
        ]
      },

      { path: 'manage-operations', component: ManageOperationTypeComponent },
      { path: 'manage-operations/add-operation', component: CreateOperationComponent },
      { path: 'manage-operations/disable-operation', component: OperationDisableComponent },
      { path: 'manage-operations/update-operation', component: UpdateOperationComponent },
      { path: 'manage-operations/:name', component: SearchOperationComponent },

      {
        path: 'manage-staffs',
        component: ManageStaffsComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'dual-view',
          },
          // Rota auxiliar que configura os outlets nomeados
          {
            path: 'dual-view',
            children: [
            {path: '', outlet: "create", component: CreateStaffComponent},

            {path: '', outlet: "search", component: SearchStaffComponent,
              children: [
              {path: 'update', component: UpdateStaffComponent}
            ]
          },
        ],
      },
    ]
  },

  { path: 'manage-staffs', component: ManageStaffsComponent },
      { path: 'manage-staffs/search', component: SearchStaffComponent },
      { path: 'manage-staffs/create', component: CreateStaffComponent },
      { path: 'manage-staffs/update', component: UpdateStaffComponent },
]},

  { path: 'patient', component: ManagePatientAccountComponent }, // Adjust for patient component
  { path: 'manage-patient-account', component: ManagePatientAccountComponent },
  { path: 'manage-patient-account/login', component: LoginPatientAccountComponent },
  { path: 'manage-patient-account/register', component: RegisterPatientComponent },
  { path: 'manage-patient-account/delete/:profileId', component: DeleteAccountComponent },  // Ruta de eliminación
  { path: 'manage-patient-account/update', component: UpdateAccountComponent },
  { path: 'manage-account', component: ManageAccountComponent },
  { path: 'manage-patient-account/book-appointment/:profileId', component: BookAppointmentComponent },
  { path: 'doctor/manage-medical-records', component: ManageMedicalRecordsComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dual-view',
      },
      {
        path: 'dual-view',
        children: [
          {
            path: '',
            outlet: 'create',
            component: RecordAddComponent
          },
          {
            path: '',
            outlet: 'list',
            component: RecordListComponent,
            children: [
              {
                path: '',
                outlet: 'medical-conditions',
                component: RecordListConditionComponent,
                children: [{
                  path: '',
                  outlet: 'add',
                  component: RecordAddConditionComponent
                },
                {
                  path: '',
                  outlet: 'search',
                  component: RecordSearchConditionComponent
                },
                {
                  path: '',
                  outlet: 'update',
                  component: RecordUpdateConditionComponent
                }
                ]
              },
              {
                path: '',
                outlet: 'allergy',
                component: RecordListAllergyComponent,
                children: [{
                  path: '',
                  outlet: 'add',
                  component: RecordAddAllergyComponent
                },
                {
                  path: '',
                  outlet: 'update',
                  component: RecordUpdateAllergyComponent
                }
                ]
              },
            ]
          }
        ]
      }
    ]
  },
  
  { path: 'admin/medical-conditions-allergies/manage-allergies/create',component: CreateAllergyComponent },
  { path: 'admin/medical-conditions-allergies/manage-allergies/search',component: SearchAllergiesComponent },
  { path: 'admin/medical-conditions-allergies/manage-allergies/update',component: UpdateAllergyComponent },

  { path: 'admin/medical-conditions-allergies/manage-medical-conditions/create',component: CreateMedicalConditionsComponent },
  { path: 'admin/medical-conditions-allergies/manage-medical-conditions/search',component: SearchMedicalConditionsComponent },
  { path: 'admin/medical-conditions-allergies/manage-medical-conditions/update',component: UpdateMedicalConditionsComponent }
];


