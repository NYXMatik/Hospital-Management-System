export interface PatientAccount {
    profileId: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    gender: string;
    birthDate: string;
    emergencyContact: string;
    address?: Address;
    isEmailVerified: boolean;
    active: boolean; 
  }
  
  // Address interface for the PatientAccount
  export interface Address {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  }
  