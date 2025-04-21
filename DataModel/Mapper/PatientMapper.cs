namespace DataModel.Mapper;

using DataModel.Model;

using Domain.Model;
using Domain.Factory;

public class PatientMapper
{
    private IPatientFactory _patientFactory;

    public PatientMapper(IPatientFactory patientFactory)
    {
        _patientFactory = patientFactory;
    }

    public Patient ToDomain(PatientDataModel patientDM)
    {
        Patient patientDomain = _patientFactory.NewPatient(patientDM.MedicalRecordNum, patientDM.Name.FullName, patientDM.Contacts.Email, patientDM.Contacts.PhoneNumber, patientDM.Gender.ToString(), patientDM.Birth, patientDM.EmergencyContact);

        return patientDomain;
    }

    public Patient ToDomain(PatientDataModel patientDM, List<AuditLogsDataModel> auditLogsDM)
    {
        Patient patientDomain = _patientFactory.NewPatient(patientDM.MedicalRecordNum, patientDM.Name.FullName, patientDM.Contacts.Email, patientDM.Contacts.PhoneNumber, patientDM.Gender.ToString(), patientDM.Birth, patientDM.EmergencyContact);
        var al = AuditLogsToDomain(auditLogsDM);
        patientDomain.setAuditLogs(al);

        return patientDomain;
    }

    public IEnumerable<Patient> ToDomain(IEnumerable<PatientDataModel> patientsDataModel)
    {

        List<Patient> patientsDomain = new List<Patient>();

        foreach(PatientDataModel patientDataModel in patientsDataModel)
        {
            if(patientDataModel.Active){
                Patient patientDomain = ToDomain(patientDataModel);
                patientsDomain.Add(patientDomain);
            }
            
        }

        return patientsDomain.AsEnumerable();
    }

    public IEnumerable<Patient> PInactiveToDomain(IEnumerable<PatientDataModel> patientsDataModel)
    {

        List<Patient> patientsDomain = new List<Patient>();

        foreach(PatientDataModel patientDataModel in patientsDataModel)
        {
            if(!patientDataModel.Active){
                Patient patientDomain = ToDomain(patientDataModel);
                patientsDomain.Add(patientDomain);
            }
            
        }

        return patientsDomain.AsEnumerable();
    }

    public PatientDataModel ToDataModel(Patient patient)
    {
        PatientDataModel patientDataModel = new PatientDataModel(patient);

        return patientDataModel;
    }


    public bool UpdateDataModel(PatientDataModel patientDataModel, Patient patientDomain)
    {
        patientDataModel.Name.FullName = patientDomain.GetFullName();
        patientDataModel.Name.FirstName = patientDomain.GetFirstName();
        patientDataModel.Name.LastName = patientDomain.GetLastName();
        patientDataModel.Contacts.Email = patientDomain.GetEmail();
        patientDataModel.Contacts.PhoneNumber = patientDomain.GetPhone();
        patientDataModel.Birth = patientDomain.GetBirth();
        patientDataModel.EmergencyContact = patientDomain.GetEmerPhone();

        return true;
    }

    public bool DeactivatedDataModel(PatientDataModel patientDataModel, Patient patientDomain)
    {
        patientDataModel.Active = patientDomain.Active;

        return true;
    }

    public List<PatientAuditLog> AuditLogsToDomain(List<AuditLogsDataModel> auditLogsDM)
    {
        List<PatientAuditLog> auditLogs = auditLogsDM
            .Select(log => _patientFactory.NewAuditLog(log.FieldName, log.OldValue, log.NewValue))
            .ToList();

        return auditLogs;
    }


    /*public bool UpdateDataModel(PatientDataModel patientDataModel, Patient patientDomain)
    {
        if (patientDataModel == null || patientDomain == null)
        {
            return false; // Handle null cases appropriately
        }

        // Update the PatientDataModel fields with values from the Patient domain object
        patientDataModel.MedicalRecordNum = patientDomain.MedicalRecordNum; // Assuming you have this property in PatientDataModel
        patientDataModel.Name.FullName = patientDomain.GetFullName(); // Assuming you have access to FullName
        patientDataModel.Contacts.Email = patientDomain.GetEmail();
        patientDataModel.Contacts.PhoneNumber = patientDomain.GetPhone();
        patientDataModel.Gender = patientDomain.GetGender(); // Update based on your Gender type
        patientDataModel.Birth = patientDomain.DateOfBirth; // Update birth date
        patientDataModel.EmergencyContact = patientDomain.GetEmerPhone(); // Emergency contact number

        // If Address or other additional fields are needed, update them accordingly
        patientDataModel.Address = patientDomain.Address; // Assuming you want to copy the Address

        // If you have any additional logic for updating specific fields, include it here.

        return true; // Return true to indicate the update was successful
    }*/

}