namespace Domain.IRepository;

using Domain.Model;

public interface IPatientRepository : IGenericRepository<Patient>
{
    Task<IEnumerable<Patient>> GetPatientsAsync();

    Task<IEnumerable<Patient>> GetPatientsInactiveAsync();

    Task<Patient> GetPatientByEmailAsync(string email);

    Task<Patient> GetPatientByPhoneAsync(string phone);

    Task<IEnumerable<Patient>> GetPatientByNameAsync(string name);

    Task<IEnumerable<Patient>> GetPatientByGenderAsync(string gender);

    Task<IEnumerable<Patient>> GetPatientByBirthAsync(string birth);
    
    Task<Patient> GetPatientWithLogsAsync(string medicalRecordNum);

    Task<Patient> GetPatientByIdAsync(string medicalRecordNumber);

    Task<Patient> Add(Patient patient);

    Task<Patient> Update(Patient patient, List<string> errorMessages);

    Task<bool> PatientExists(string id);

    Task<bool> EmailExists(string email);

    Task<bool> PhoneExists(string phoneNumber);
    
    Task<int> GetMaxMedicalRecordNumberAsync(string yearMonth);

    Task<Patient> InactivateAsync(Patient patient);

    Task<bool> DeleteAsync(Patient patient);

    Task<IEnumerable<Patient>> GetFilteredPatientsAsync(string? name, string? email, string? phone, string? birth, string? gender);

}

