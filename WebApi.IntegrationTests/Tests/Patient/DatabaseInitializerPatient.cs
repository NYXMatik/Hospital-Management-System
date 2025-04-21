using System.Linq;
using DataModel.Model;
using DataModel.Repository;
using Domain.Model;

public class DatabaseInitializerPatient
{
    public static void Initialize(PatientContext context)
    {
        context.Database.EnsureCreated();

        // Verifique se já existem registros
        if (context.Patients.Any())
        {
            return; // O banco de dados já foi populado
        }

        // Adicione um Patient para o teste GET
        context.Patients.Add(new PatientDataModel
        {
            MedicalRecordNum = "202410000005",
            Name = new NameDataModel(new Name("Jane Doe")),
            Contacts = new ContactInfoDataModel
            {
                Email = "jane.doe@example.com",
                PhoneNumber = "+345 123456789"
            },
            Birth = "2020-10-10",
            Gender = Gender.Male,
            EmergencyContact = "+351 987654321", // Ajustado para o campo correto
            AuditLogs = new List<AuditLogsDataModel>()
        });

        // Salve as mudanças
        context.SaveChanges();
    }
}
