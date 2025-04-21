namespace Application.DTO;

using Domain.Model;

public class AuditLogDTO
{
    public string Operation { get; set; }
    public string Date { get; set; }
    public string ChangedBy { get; set; }
    public string FieldName { get; set; }
    public string OldValue { get; set; }
    public string NewValue { get; set; }

    public AuditLogDTO() { }

    public AuditLogDTO(string operation, string date, /*string changedBy,*/ string fieldName, string oldValue, string newValue)
    {
        Operation = operation;
        Date = date;
        //ChangedBy = changedBy;
        FieldName = fieldName;
        OldValue = oldValue;
        NewValue = newValue;
    }

    // Método de conversão de PatientAuditLog para AuditLogDTO
    public static AuditLogDTO FromDomain(PatientAuditLog log)
    {
        return new AuditLogDTO(
            log.Operation.ToString(),
            log.Date,
            //log.ChangedBy,
            log.FieldName,
            log.OldValue,
            log.NewValue
        );
    }

    // To convert StaffAuditLog to AuditLogDTO
    public static AuditLogDTO FromDomain_Staff(StaffAuditLog log)
    {
        return new AuditLogDTO(
            log.Operation.ToString(),
            log.Date,
            //log.ChangedBy,
            log.FieldName,
            log.OldValue,
            log.NewValue
        );
    }
}
