namespace DataModel.Mapper
{
    using DataModel.Model;
    using Domain.Model;
    using Domain.Factory;
    using Domain.IRepository;
    using System.Collections.Generic;
    using System.Linq;

    public class PatientAccountMapper
    {
        private IPatientAccountFactory _patientAccountFactory;

        public PatientAccountMapper(IPatientAccountFactory patientAccountFactory)
        {
            _patientAccountFactory = patientAccountFactory;
        }

        public PatientAccountMapper() { }

        public PatientAccount? ToDomain(PatientAccountDataModel patientAccountDM)
        {
            if (patientAccountDM == null)
                throw new ArgumentNullException(nameof(patientAccountDM));

            if (!patientAccountDM.Active)
                return null;

            Address? address = patientAccountDM.Address != null
                ? new Address(
                    patientAccountDM.Address.Street,
                    patientAccountDM.Address.City,
                    patientAccountDM.Address.State,
                    patientAccountDM.Address.Country,
                    patientAccountDM.Address.PostalCode
                )
                : null;

            PatientAccount patientAccountDomain = _patientAccountFactory.NewPatientAccount(
                patientAccountDM.ProfileId,
                patientAccountDM.Name.FullName,
                patientAccountDM.ContactInfo.Email,
                patientAccountDM.ContactInfo.PhoneNumber,
                patientAccountDM.BirthDate,
                patientAccountDM.IsEmailVerified,
                address
            );

            if (patientAccountDM.Appointments != null && patientAccountDM.Appointments.Any())
            {
                var appointments = AppointmentsToDomain(patientAccountDM.Appointments);
                patientAccountDomain.UpdateAppointments(appointments);
            }

            return patientAccountDomain;
        }

        public void UpdateAppointment(PatientAccount patientAccount, List<AppointmentDataModel> updatedAppointments)
        {
            if (patientAccount != null && updatedAppointments != null)
            {
                var appointments = AppointmentsToDomain(updatedAppointments);

                patientAccount.UpdateAppointments(appointments);
            }
        }
        public PatientAccount ToDomain(PatientAccountDataModel patientAccountDM, List<PatientAuditLogsDataModel> auditLogsDM)
        {
            if (patientAccountDM.Active)
            {
                Address? address = patientAccountDM.Address != null
                    ? new Address(
                        patientAccountDM.Address.Street,
                        patientAccountDM.Address.City,
                        patientAccountDM.Address.State,
                        patientAccountDM.Address.Country,
                        patientAccountDM.Address.PostalCode
                    )
                    : null;

                PatientAccount patientAccountDomain = _patientAccountFactory.NewPatientAccount(
                    patientAccountDM.ProfileId,
                    patientAccountDM.Name.FullName,
                    patientAccountDM.ContactInfo.Email,
                    patientAccountDM.ContactInfo.PhoneNumber,
                    patientAccountDM.BirthDate,
                    patientAccountDM.IsEmailVerified,
                    address
                );

                var auditLogs = AuditLogsToDomain(auditLogsDM);
                patientAccountDomain.UpdateAuditLogs(auditLogs);

                // Mapeo de citas
                var appointments = AppointmentsToDomain(patientAccountDM.Appointments);
                patientAccountDomain.UpdateAppointments(appointments);

                return patientAccountDomain;
            }
            else
            {
                return null;
            }
        }

        public IEnumerable<PatientAccount> ToDomain(IEnumerable<PatientAccountDataModel> patientAccountsDM)
        {
            List<PatientAccount> patientAccountsDomain = new List<PatientAccount>();

            foreach (PatientAccountDataModel patientAccountDM in patientAccountsDM)
            {
                if (patientAccountDM.Active)
                {
                    PatientAccount patientAccountDomain = ToDomain(patientAccountDM);
                    patientAccountsDomain.Add(patientAccountDomain);
                }
            }

            return patientAccountsDomain.AsEnumerable();
        }

        public PatientAccountDataModel ToDataModel(PatientAccount patientAccount)
        {
            AddressDataModel? addressDM = patientAccount.GetAddress() != null
                ? new AddressDataModel(
                    patientAccount.GetAddress().Street,
                    patientAccount.GetAddress().City,
                    patientAccount.GetAddress().State,
                    patientAccount.GetAddress().Country,
                    patientAccount.GetAddress().PostalCode
                )
                : null;

            PatientAccountDataModel patientAccountDM = new PatientAccountDataModel
            {
                ProfileId = patientAccount.GetProfileId(),
                Name = new NameDataModel(patientAccount.GetFullName()),
                ContactInfo = new ContactInfoDataModel(
                    patientAccount.GetEmail(),
                    patientAccount.GetPhoneNumber()
                ),
                BirthDate = patientAccount.GetBirthDate(),
                Address = addressDM,
                Active = patientAccount.GetIsActive(),
                Appointments = AppointmentsToDataModel(patientAccount.GetAppointments())  // Añadido
            };

            return patientAccountDM;
        }

        public bool UpdateDataModel(PatientAccountDataModel patientAccountDM, PatientAccount patientAccount)
        {
            patientAccountDM.ContactInfo.Email = patientAccount.GetEmail();
            patientAccountDM.ContactInfo.PhoneNumber = patientAccount.GetPhoneNumber();
            patientAccountDM.Address = patientAccount.GetAddress() != null
                ? new AddressDataModel(
                    patientAccount.GetAddress().Street,
                    patientAccount.GetAddress().City,
                    patientAccount.GetAddress().State,
                    patientAccount.GetAddress().Country,
                    patientAccount.GetAddress().PostalCode
                )
                : null;
            patientAccountDM.Name.FullName = patientAccount.GetFullName();
            patientAccountDM.BirthDate = patientAccount.GetBirthDate();
            patientAccountDM.IsEmailVerified = patientAccount.GetIsEmailVerified(); 
            patientAccountDM.AuditLogs = patientAccount.GetAuditLogs()
                .Select(log => new PatientAuditLogsDataModel(log))
                .ToList();

            patientAccountDM.Appointments = AppointmentsToDataModel(patientAccount.GetAppointments());

            return true;
        }

        public bool DeactivateDataModel(PatientAccountDataModel patientAccountDM, PatientAccount patientAccount)
        {
            patientAccountDM.Active = patientAccount.GetIsActive();
            return true;
        }

        public List<Domain.Model.PatientAccountAuditLog> AuditLogsToDomain(List<PatientAuditLogsDataModel> auditLogsDM)
        {
            List<Domain.Model.PatientAccountAuditLog> auditLogs = auditLogsDM
                .Select(log => new Domain.Model.PatientAccountAuditLog(
                    log.ProfileId,       
                    log.FieldName,        
                    log.OldValue,         
                    log.NewValue,        
                    log.ChangedBy ?? "Unknown",
                    log.Operation ?? "Update"  
                ))
                .ToList();

            return auditLogs;
        }

        public List<Appointment> AppointmentsToDomain(List<AppointmentDataModel> appointmentsDM)
        {
            if (appointmentsDM == null)
                throw new ArgumentNullException(nameof(appointmentsDM), "Appointment data models cannot be null.");

            return appointmentsDM
                .Select(appointment => new Appointment(
                    appointmentId: appointment.AppointmentId ?? Guid.NewGuid().ToString(), 
                    patientId: appointment.PatientId,
                    appointmentDate: appointment.AppointmentDate,
                    description: appointment.Description,
                    doctor: appointment.Doctor,
                    status: appointment.Status
                ))
                .ToList();
        }

        // Convertir de dominio a modelo de datos
        public List<AppointmentDataModel> AppointmentsToDataModel(List<Appointment> appointments)
        {
            if (appointments == null)
                throw new ArgumentNullException(nameof(appointments), "Appointments cannot be null.");

            return appointments
                .Select(appointment => new AppointmentDataModel
                {
                    AppointmentId = appointment.AppointmentId ?? Guid.NewGuid().ToString(), 
                    PatientId = appointment.PatientId,
                    AppointmentDate = appointment.AppointmentDate,
                    Description = appointment.Description,
                    Doctor = appointment.Doctor,
                    Status = appointment.Status
                })
                .ToList();
        }


        public void UpdateToDomain(PatientAccount existingAccount, string name, string email, string phone, string street, string city, string state, string postalCode, string country, string birthDate)
        {
            if (existingAccount == null) throw new ArgumentNullException(nameof(existingAccount));

            existingAccount.Name.UpdateFullName(name); 
            existingAccount.ContactInfo.SetEmail(email);
            existingAccount.ContactInfo.SetPhoneNumber(phone); 

            if (existingAccount.Address == null)
                existingAccount.SetAddress(new Address(street, city, state, postalCode, country)); 
            else
            {
                existingAccount.Address.SetStreet(street);
                existingAccount.Address.SetCity(city);
                existingAccount.Address.SetState(state);
                existingAccount.Address.SetPostalCode(postalCode);
                existingAccount.Address.SetCountry(country);
            }

            existingAccount.SetBirthDate(birthDate); 
        }
    }
}
