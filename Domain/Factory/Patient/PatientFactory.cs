namespace Domain.Factory;

using Domain.Model;

public class PatientFactory : IPatientFactory
{
    public Patient NewPatient(string strMRN, string strName, string strEmail, string strPhone, string strGender, string strBirth, string strEmerContact)
    {
        return new Patient(strMRN, strName, strEmail, strPhone, strGender, strBirth, strEmerContact);
    }

    public PatientAuditLog NewAuditLog(string fieldName, string oldValue, string newValue)
    {
        return new PatientAuditLog(fieldName, oldValue, newValue);
    }
}