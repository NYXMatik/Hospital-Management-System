namespace Domain.Factory;

using Domain.Model;

public interface IPatientAccountFactory
{
    PatientAccount NewPatientAccount(
        string profileId, 
        string fullName, 
        string email, 
        string phoneNumber, 
        string birthDate, 
        bool isEmailVerified,
        Address address);

    PatientAuditLog NewAuditLog(string fieldName, string oldValue, string newValue);
}
