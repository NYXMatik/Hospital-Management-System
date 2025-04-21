namespace DataModel.Model;

    using Domain.Model;
    using System.Collections.Generic;
    using System.Linq;

    public class PatientAccountDataModel
    {
        public string ProfileId { get; set; }
        public NameDataModel Name { get; set; }
        public ContactInfoDataModel ContactInfo { get; set; }
        public string BirthDate { get; set; }
        public bool IsEmailVerified { get; set; }
        public AddressDataModel? Address { get; set; }
        public bool Active { get; set; }
        public List<PatientAuditLogsDataModel> AuditLogs { get; set; } // Agregado AuditLogs
        public List<AppointmentDataModel> Appointments { get; set; } // Agregado Appointments

        // Constructor vacío
        public PatientAccountDataModel() {}

        // Constructor que mapea un PatientAccount a PatientAccountDataModel
        public PatientAccountDataModel(PatientAccount profile)
        {
            ProfileId = profile.ProfileId;
            Name = new NameDataModel(profile.Name); // Mapeo de Name
            ContactInfo = new ContactInfoDataModel(profile.ContactInfo); // Mapeo de ContactInfo
            BirthDate = profile.BirthDate;
            IsEmailVerified = profile.IsEmailVerified;
            Address = profile.Address != null ? new AddressDataModel(profile.Address) : null; // Mapeo de Address
            Active = profile.Active;
            AuditLogs = profile.GetAuditLogs().Select(log => new PatientAuditLogsDataModel(log)).ToList(); 
            Appointments = profile.Appointments?.Select(app => new AppointmentDataModel(app)).ToList() ?? new List<AppointmentDataModel>();
        }
    }

