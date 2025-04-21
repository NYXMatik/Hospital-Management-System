namespace Domain.Factory;

using Domain.Model;

public interface IStaffFactory
{
    Staff NewStaff(string id, string fullName, string licenseNumber, string email, string phoneNumber, string specialization);

    StaffAuditLog NewAuditLog(string fieldName, string oldValue, string newValue);
}