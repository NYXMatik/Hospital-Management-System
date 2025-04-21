namespace Domain.Factory;

using Domain.Model;

public class StaffFactory : IStaffFactory
{
    public Staff NewStaff(string id, string fullName, string licenseNumber, string email, string phoneNumber, string specialization)
    {
        return new Staff(id, fullName, licenseNumber, email, phoneNumber, specialization);
    }

    public StaffAuditLog NewAuditLog(string fieldName, string oldValue, string newValue)
    {
        return new StaffAuditLog(fieldName, oldValue, newValue);
    }
    
}