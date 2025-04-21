namespace DataModel.Model;

using Domain.Model;

public class AuditLogsDataModel
{
    public long Id { get; set; }
    public string FieldName { get; set; }
    public string OldValue { get; set; }
    public string NewValue { get; set; }
    public string Date { get; set; }
    public AuditOperation Operation { get; set; }
    public string ChangedBy { get; set; }

    public AuditLogsDataModel() {}
    
    public AuditLogsDataModel(PatientAuditLog auditLog)
    {
        Id = auditLog.Id;
        FieldName = auditLog.FieldName;
        OldValue = auditLog.OldValue;
        NewValue = auditLog.NewValue;
        Date = auditLog.Date;
        Operation = auditLog.Operation;
        //ChangedBy = auditLog.ChangedBy;
    }
}