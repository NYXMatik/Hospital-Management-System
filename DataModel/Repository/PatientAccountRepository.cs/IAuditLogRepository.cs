using Domain.Model;

public interface IAuditLogRepository
{
    Task SaveAsync(PatientAccountAuditLog auditLog);
}
