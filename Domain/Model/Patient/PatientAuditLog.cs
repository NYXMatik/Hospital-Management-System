namespace Domain.Model;

using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using System.Net.Mail;


public class PatientAuditLog : IPtientAuditLog{
    
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

    public PatientAuditLog()
    {
        _operation = AuditOperation.Create;
        _date = DateTime.UtcNow.ToString();

    }
    

    public PatientAuditLog(string fieldName, string oldValue, string newValue)
    {
        _operation = AuditOperation.Update;
        _date = DateTime.UtcNow.ToString();
        _fieldName = fieldName;
        _oldValue = oldValue;
        _newValue = newValue;

    }
}
