namespace Domain.IRepository;

using Domain.Model;

public interface IStaffRepository : IGenericRepository<Staff>
{
    Task<Staff> Add(Staff staff);
    Task<int> GetMaxStaffIDNumberAsync(string category_recruitmentYear);

    Task<IEnumerable<Staff>> GetStaffsAsync();
    Task<Staff> GetStaffByIdAsync(string id);
    Task<Staff> GetStaffByEmailAsync(string email);
    Task<IEnumerable<Staff>> GetStaffByNameAsync(string fullName);
    Task<IEnumerable<Staff>> GetStaffBySpecializationAsync(string specialization);

    Task<Staff> Update(Staff staff, List<string> errorMessages);
    Task<Staff> GetStaffWithLogsAsync(string id);

    Task<Staff> InactivateAsync(Staff staff);

    Task<bool> StaffExists(string licenseNumber);
    Task<bool> EmailAndPhoneExists(string email, string phoneNumber);
    Task<bool> EmailExists(string email);
    Task<bool> PhoneExists(string phoneNumber);

    Task<IEnumerable<Staff>> GetFilteredStaffsAsync(string? name, string? email, string? specialization);

}