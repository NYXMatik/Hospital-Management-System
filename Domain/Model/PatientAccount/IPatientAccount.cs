using System;

namespace Domain.Model
{
    public interface IPatientAccount
    {
        // Properties
        string ProfileId { get; }
        Name Name { get; }
        ContactInfo ContactInfo { get; }
        string BirthDate { get; }
        bool IsEmailVerified { get; }
        Address Address { get; set; }
        bool Active { get; }

        // Methods
        void VerifyEmail();               // Mark the email as verified
        void MarkAsInactive();            // Mark the patient profile as inactive
        string GetFullName();             // Get the full name of the patient
        string GetEmail();                // Get the email of the patient
        string GetPhone();                // Get the phone number of the patient
        string GetBirthDate();            // Get the birth date of the patient
        bool CanListAppointments();      // Check if the patient can list appointments (based on email verification)
        DateTime GetBirth();             // Get the birth date as a DateTime object
        string? GetEmerPhone();          // Get the emergency contact phone number (if available)
        string? GetMedicalRecordNum();   // Get the patient's medical record number (if available)
    }
}
