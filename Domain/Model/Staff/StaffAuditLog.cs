namespace Domain.Model;

public class StaffAuditLog : IStaffAuditLog{
    
    public long Id;
    private AuditOperation _operation;
    public AuditOperation Operation
    {
        get { return _operation; }
    }
    
    private string _date;
    public string Date
    {
        get { return _date; }
    }

    private string _changedBy;
    public string ChangedBy
    {
        get { return _changedBy; }
    }

    private string _fieldName;
    public string FieldName
    {
        get { return _fieldName; }
    }

    private string _oldValue;
    public string OldValue
    {
        get { return _oldValue; }
    }

    private string _newValue;
    public string NewValue
    {
        get { return _newValue; }
    }

    public StaffAuditLog()
    {
        _operation = AuditOperation.Create;
        _date = DateTime.UtcNow.ToString();

    }
    

    public StaffAuditLog(string fieldName, string oldValue, string newValue)
    {
        _operation = AuditOperation.Update;
        _date = DateTime.UtcNow.ToString();
        _fieldName = fieldName;
        _oldValue = oldValue;
        _newValue = newValue;

    }
}