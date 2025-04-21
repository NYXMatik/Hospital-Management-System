using System.Linq;
using DataModel.Model;
using DataModel.Repository;
using Domain.Model;

public class DatabaseInitializerPatientAccount
{
    public static void Initialize(PatientAccountContext context)
    {
        context.Database.EnsureCreated();
        if (context.PatientProfiles.Any())
        {
            return; 
        }

        context.PatientProfiles.Add(new PatientAccountDataModel
        {
            MedicalRecordNum = "202410000005",
            Name = new NameDataModel(new Name("Jane Doe")),
            Contacts = new ContactInfoDataModel
            {
                Email = "jane.doe@example.com",
                PhoneNumber = "+345 123456789"
            },
            Birth = "2020-10-10",
            Gender = Gender.Female,
            EmergencyContact = "+351 987654321", 
            AuditLogs = new List<AuditLogsDataModel>()
        });
        context.SaveChanges();
    }
}
