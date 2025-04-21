namespace DataModel.Repository
{
    using DataModel.Mapper;
    using DataModel.Model;
    using Domain.Model;
    using Microsoft.EntityFrameworkCore;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public class PatientAccountRepository : GenericRepository<PatientAccount>, IPatientAccountRepository
    {
        PatientAccountMapper _patientProfileMapper;

        public PatientAccountRepository(GenericContext context, PatientAccountMapper mapper) : base(context!)
        {
            _patientProfileMapper = mapper;
        }

        public async Task<PatientAccount> GetByIdAsync(string id)
        {
            try
            {
                var patientAccountDataModel = await _context.Set<PatientAccountDataModel>()
                    .Include(p => p.ContactInfo) // Eager load related ContactInfo
                    .Include(p => p.Appointments) // Eager load related Appointments
                    .FirstOrDefaultAsync(p => p.ProfileId == id);

                if (patientAccountDataModel == null)
                    return null;

                return _patientProfileMapper.ToDomain(patientAccountDataModel);
            }
            catch
            {
                return null;
            }
        }

        public async Task<IEnumerable<PatientAccount>> GetAllAsync()
        {
            try
            {
                IEnumerable<PatientAccountDataModel> accountDataModel = await _context.Set<PatientAccountDataModel>()
                        .Include(p => p.Appointments) // Eager load related Appointments
                        .ToListAsync();

                IEnumerable<PatientAccount> accounts = _patientProfileMapper.ToDomain(accountDataModel);

                return accounts;
            }
            catch
            {
                throw;
            }
        }

        public async Task<PatientAccount> GetByEmailAsync(string email)
        {
            try
            {
                var patientAccountDataModel = await _context.Set<PatientAccountDataModel>()
                    .Include(p => p.ContactInfo) // Ensure ContactInfo is loaded
                    .Include(p => p.Appointments) // Eager load related Appointments
                    .FirstOrDefaultAsync(p => p.ContactInfo.Email == email);

                if (patientAccountDataModel == null)
                    return null;

                return _patientProfileMapper.ToDomain(patientAccountDataModel);
            }
            catch
            {
                return null;
            }
        }

        public async Task<PatientAccount> AddAsync(PatientAccount patientProfile)
        {
            try
            {
                var patientAccountDataModel = _patientProfileMapper.ToDataModel(patientProfile);

                var entityEntry = await _context.Set<PatientAccountDataModel>().AddAsync(patientAccountDataModel);
                await _context.SaveChangesAsync();

                return _patientProfileMapper.ToDomain(entityEntry.Entity);
            }
            catch
            {
                throw;
            }
        }

        public async Task<bool> PatientAccountExists(string id)
        {
            return await _context.Set<PatientAccountDataModel>().AnyAsync(e => e.ProfileId == id);
        }
        public async Task UpdateIsEmailVerifiedAsync(string profileId, bool isEmailVerified, List<string> errorMessages)
    {
        try
        {
            var patientAccountDataModel = await _context.Set<PatientAccountDataModel>()
                .FirstOrDefaultAsync(p => p.ProfileId == profileId);

            if (patientAccountDataModel == null)
            {
                errorMessages.Add("Patient account not found.");
                return;
            }

            patientAccountDataModel.IsEmailVerified = isEmailVerified;

            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            errorMessages.Add($"An error occurred while updating the email verification status: {ex.Message}");
        }
    }
        public async Task<PatientAccount> UpdateAsync(PatientAccount patientAccount, List<string> errorMessages)
        {
            try
            {
                var patientAccountDataModel = await _context.Set<PatientAccountDataModel>()
                    .Include(p => p.Appointments) 
                    .FirstOrDefaultAsync(p => p.ProfileId == patientAccount.ProfileId);

                if (patientAccountDataModel == null)
                {
                    errorMessages.Add("Patient account not found.");
                    return null;
                }
                
                _patientProfileMapper.UpdateDataModel(patientAccountDataModel, patientAccount);

                if (patientAccount.Appointments != null && patientAccount.Appointments.Any())
                {
                    foreach (var appointment in patientAccount.Appointments)
                    {
                        var existingAppointment = patientAccountDataModel.Appointments
                            .FirstOrDefault(a => a.AppointmentId == appointment.AppointmentId);

                        if (existingAppointment != null)
                        {
                            existingAppointment.AppointmentDate = appointment.AppointmentDate;
                            existingAppointment.Description = appointment.Description;
                            existingAppointment.Doctor = appointment.Doctor;
                            existingAppointment.Status = appointment.Status;
                        }
                        else
                        {
                            var newAppointment = new AppointmentDataModel
                            {
                                AppointmentId = appointment.AppointmentId ?? Guid.NewGuid().ToString(), // Genera ID si no existe
                                PatientId = patientAccount.ProfileId,
                                AppointmentDate = appointment.AppointmentDate,
                                Description = appointment.Description,
                                Doctor = appointment.Doctor,
                                Status = appointment.Status
                            };

                            patientAccountDataModel.Appointments.Add(newAppointment);
                        }
                    }
                }
                 Console.WriteLine($"Email verification status for {patientAccountDataModel.ContactInfo.Email}: {patientAccountDataModel.IsEmailVerified}");
                await _context.SaveChangesAsync();

                return patientAccount;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await PatientAccountExists(patientAccount.ProfileId))
                {
                    errorMessages.Add("Patient account not found during update.");
                    return null;
                }
                else
                {
                    throw; // Relanzar la excepción si no es por ausencia
                }
            }
            catch (Exception ex)
            {
                errorMessages.Add($"An error occurred while updating the patient account: {ex.Message}");
                return null;
            }
        }



        public async Task DeleteAsync(PatientAccount profile)
        {
            try
            {
                var patientAccountDataModel = await _context.Set<PatientAccountDataModel>()
                    .FirstOrDefaultAsync(p => p.ProfileId == profile.ProfileId);

                if (patientAccountDataModel == null)
                    return;

                _context.Set<PatientAccountDataModel>().Remove(patientAccountDataModel);
                await _context.SaveChangesAsync();
            }
            catch
            {
                throw;
            }
        }
        public async Task<PatientAccount> AddAppointmentAsync(string patientId, Appointment appointment)
        {
            if (appointment == null)
                throw new ArgumentNullException(nameof(appointment), "Appointment cannot be null.");

            try
            {
                using (var transaction = await _context.Database.BeginTransactionAsync())
                {
                    var patientAccountDataModel = await _context.Set<PatientAccountDataModel>()
                        .Include(p => p.Appointments)
                        .FirstOrDefaultAsync(p => p.ProfileId == patientId);

                    if (patientAccountDataModel == null)
                        throw new InvalidOperationException("Patient not found.");

                    if (patientAccountDataModel.Appointments == null)
                        patientAccountDataModel.Appointments = new List<AppointmentDataModel>();

                    var appointmentDataModel = new AppointmentDataModel
                    {
                        AppointmentId = Guid.NewGuid().ToString(),
                        PatientId = patientId,
                        AppointmentDate = appointment.AppointmentDate,
                        Description = appointment.Description,
                        Doctor = appointment.Doctor,
                        Status = appointment.Status
                    };

                    patientAccountDataModel.Appointments.Add(appointmentDataModel);

                    var entry = _context.Entry(patientAccountDataModel);
                    if (entry.State == EntityState.Detached)
                        _context.Attach(patientAccountDataModel);

                    entry.State = EntityState.Modified;

                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();

                    var domainResult = _patientProfileMapper.ToDomain(patientAccountDataModel);
                    if (domainResult == null)
                        throw new InvalidOperationException("Mapping error: Resulting domain object is null.");

                    return domainResult;
                }
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Error adding appointment: {ex.Message}", ex);
            }
        }

        public async Task<IEnumerable<Appointment>> GetAppointmentsByIdAsync(string profileId)
        {
            if (string.IsNullOrWhiteSpace(profileId))
                throw new ArgumentException("Profile ID cannot be null or empty.", nameof(profileId));

            try
            {
                var patientAccountDataModel = await _context.Set<PatientAccountDataModel>()
                    .Include(p => p.Appointments)
                    .FirstOrDefaultAsync(p => p.ProfileId == profileId);

                if (patientAccountDataModel == null)
                    throw new InvalidOperationException("Patient not found.");

                if (patientAccountDataModel.Appointments == null || !patientAccountDataModel.Appointments.Any())
                    return Enumerable.Empty<Appointment>();

                return patientAccountDataModel.Appointments
                    .Select(a => new Appointment(
                        appointmentId: a.AppointmentId,
                        patientId: a.PatientId,
                        appointmentDate: a.AppointmentDate,
                        description: a.Description,
                        doctor: a.Doctor,
                        status: a.Status
                    ));
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Error retrieving appointments: {ex.Message}", ex);
            }
        }


    }
}
