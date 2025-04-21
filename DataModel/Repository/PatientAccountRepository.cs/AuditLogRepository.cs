using DataModel.Repository; 
using Domain.Model;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

public class AuditLogRepository : IAuditLogRepository
{
    private readonly GenericContext _context; 

    public AuditLogRepository(GenericContext context)
    {
        _context = context;
    }

    public async Task SaveAsync(PatientAccountAuditLog auditLog)
    {
        await _context.Set<PatientAccountAuditLog>().AddAsync(auditLog);

        await _context.SaveChangesAsync();
    }
}
