namespace Domain.Factory;


using Domain.Model;


public interface IPatientFactory
{
    Patient NewPatient(string strMRN, string strName, string strEmail, string strPhone, string strGender, string strBirth, string strEmerContact);
    PatientAuditLog NewAuditLog(string fieldName, string oldValue, string newValue);
}