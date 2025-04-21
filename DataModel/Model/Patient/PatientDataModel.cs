namespace DataModel.Model;

using DataModel.Model;
using Domain.Model;

public class PatientDataModel
{
    public string MedicalRecordNum { get; set; }
    public string Birth { get; set; }
    public ContactInfoDataModel Contacts { get; set; }
	public NameDataModel Name { get; set; }
    public Gender Gender { get; set; } 
    public string EmergencyContact { get; set; }
    public List<AuditLogsDataModel> AuditLogs { get; set; }
    public bool Active { get; set; }

    
    //Patient user
    //public Address Address { get; set; }

    public PatientDataModel() {}

    public PatientDataModel(Patient patient)
    {
        MedicalRecordNum = patient.MedicalRecordNum;
        Birth = patient.DateOfBirth;
        EmergencyContact = patient.EmergencyContact;
        Gender = patient.Gender;
        Active = patient.Active;

        Name = new NameDataModel(patient.Name);
        Contacts = new ContactInfoDataModel(patient.ContactInfo);
        
        AuditLogs = patient.AuditLogs
            .Select(log => new AuditLogsDataModel(log))
            .ToList();
    }
}