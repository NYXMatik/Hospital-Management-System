namespace Domain.Factory;

using Domain.Model;

public class PatientAccountFactory : IPatientAccountFactory
{
    public PatientAccount NewPatientAccount(
        string profileId, 
        string fullName, 
        string email, 
        string phoneNumber, 
        string birthDate,
        bool isEmailVerified,
        Address address)
    {
        return new PatientAccount(profileId, fullName, email, phoneNumber, birthDate,isEmailVerified, address);
    }

    public PatientAuditLog NewAuditLog(string fieldName, string oldValue, string newValue)
    {
        return new PatientAuditLog(fieldName, oldValue, newValue);
    }
}
