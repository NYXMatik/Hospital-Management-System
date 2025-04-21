
namespace Domain.Model;
using System.Collections.Generic;
using System.Threading.Tasks;


using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Model;

public interface IPatientAccountRepository
{
    Task<PatientAccount> GetByIdAsync(string id);
    Task<IEnumerable<PatientAccount>> GetAllAsync();
    Task<PatientAccount> GetByEmailAsync(string email);
    Task<PatientAccount> AddAsync(PatientAccount patientProfile);
    Task<PatientAccount> UpdateAsync(PatientAccount patientAccount, List<string> errorMessages);
    Task DeleteAsync(PatientAccount profile);
    Task<bool>PatientAccountExists(string id);
    Task<PatientAccount> AddAppointmentAsync(string patientId, Appointment appointment);

    Task<IEnumerable<Appointment>> GetAppointmentsByIdAsync(string profileId);
    Task UpdateIsEmailVerifiedAsync(string profileId, bool v, List<string> errorMessages);
}

