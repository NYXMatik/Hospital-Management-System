# US 5124

## 1. Context

- As a Patient, I want to update my user profile, so that I can change my personal
details and preferences.

## 2. Requirements

- Patients can log in and update their profile details (e.g., name, contact information,
preferences).
- Changes to sensitive data, such as email, trigger an additional verification step (e.g.,
confirmation email).
- All profile updates are securely stored in the system.
- The system logs all changes made to the patient's profile for audit purposes.

## 3. Analysis
- The system will allow patients to securely log in and update their profile details, such as name, contact information, and preferences, with all changes stored safely.
- Any updates to sensitive data, like email, will trigger a verification step through a confirmation email to ensure data integrity and prevent unauthorized changes.
- The system will also maintain comprehensive audit logs, recording the date, time, and details of each modification for transparency and compliance with GDPR. Encryption will be applied to data in transit and at rest, and access to profile updates will be restricted to authenticated users.
## 4. Design
flowchart TD
    A[Patient Login] --> B{Successful Authentication?}
    B -- Yes --> C[Access Profile Page]
    B -- No --> D[Display Error Message]
    C --> E[Modify Profile Data]
    E --> F{Sensitive Data Modified?}
    F -- Yes --> G[Send Verification Email]
    G --> H[Confirm Verification]
    H --> I[Save Changes]
    F -- No --> I
    I --> J[Store Changes in Database]
    I --> K[Log Changes for Audit]
    J --> L[Confirmation to Patient]

### 4.1. Realization

### 4.2. Class Diagram
@startuml
rectangle "User Aggregate" #babfdd {
  class User <<AggregateRoot>> <<Entity>> {
    + userID : String
    + role : String
    + email : String
  }
}

rectangle "Patient Aggregate" #fabfdd {
  class Patient <<AggregateRoot>> <<Entity>> {
    + patientID : String
    + firstName : String
    + lastName : String
    + contactInfo : ContactInformation
    + preferences : Preferences
    + medicalRecordNumber : String
  }

  class ContactInformation <<ValueObject>> {
    + email : String
    + phone : String
  }

  class Preferences <<ValueObject>> {
    + notifications : Boolean
    + language : String
  }

  class AuditLog <<Entity>> {
    + logID : String
    + patientID : String
    + modifiedField : String
    + oldValue : String
    + newValue : String
    + timestamp : DateTime
  }

  Patient "1" --> "0..*" AuditLog : logs
}

User "0..1" -left-> "0..1" Patient : links to
Patient "1" --> "1" ContactInformation : has
Patient "1" --> "1" Preferences : has

@enduml

### 4.4. Applied Patterns

### 4.4. Tests

## 5. Implementation

## 6. Integration/Demonstration

N/A

## 7. Observations
