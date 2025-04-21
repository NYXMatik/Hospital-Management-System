namespace Domain.Model.OperationType;

public class Version : IVersion{

    private int _versionNumber;
    public int VersionNumber
    {
        get { return _versionNumber; }
        set { _versionNumber = value; }

    }

    private DateOnly _date;
    public DateOnly Date
    {
        get { return _date; }
    }

    private bool _status;
    public bool Status
    {
        get { return _status; }
    }

    private bool _pending;
    public bool Pending
    {
        get { return _pending; }
    }

    private SortedSet<Phase> _phases;
    public SortedSet<Phase> Phases
    {
        get { return _phases; }
    }

    private Version(){}

    public Version(DateOnly date, bool status, bool pending ,SortedSet<Phase> phases)
    {
        if(ValidateDate(date))
        {
            _date = date;
        }
        else
        {
            throw new ArgumentException("Date is not valid");
        }

        _status = status;
        _pending = pending;

        if(ValidatePhases(phases))
        {
            _phases = phases;
        }
        else
        {
            throw new ArgumentException("Phases are not valid");
        }
    }

    public Version(int versionNumber, DateOnly date, bool status, bool pending, SortedSet<Phase> phases)
    {
        _versionNumber = versionNumber;

        if(ValidateDate(date))
        {
            _date = date;
        }
        else
        {
            throw new ArgumentException("Date is not valid");
        }

        _status = status;
        _pending = pending;

        if(ValidatePhases(phases))
        {
            _phases = phases;
        }
        else
        {
            throw new ArgumentException("Phases are not valid");
        }
    }
    private bool ValidatePhases(SortedSet<Phase> phases)
    {
        if(phases.Count >= 3)
        {
            return true;
        }
        return false;

    }

    private bool ValidateDate(DateOnly date)
    {
        if(date.CompareTo(DateOnly.FromDateTime(DateTime.Now)) <= 0)
        {
            return true;
        }
        return false;
    }

    public int GetVersion()
    {
        return VersionNumber;
    }
    public void SetVersion(int version)
    {
        VersionNumber = version;
    }
    public void AddPhase(Phase phase)
    {
        Phases.Add(phase);
    }
    public void EditPhases(string oldPhaseName, Phase phase)
    {
        Phases.RemoveWhere(p => p.Name == oldPhaseName);
        Phases.Add(phase);
    }
    public void RemovePhase(Phase phase)
    {
        Phases.Remove(phase);
    }
    public void ChangeStatus(bool status)
    {
        _status = status;
    }
    public void ChangePending(bool status)
    {
        _pending = status;
    }

    public int Compare(IVersion version2)
    {
        return VersionNumber.CompareTo(version2.GetVersion());
    }

    public DateOnly GetStartDate()
    {
        return Date;
    }

    public bool GetStatus()
    {
        return Status;
    }

    public bool GetPending()
    {
        return Pending;
    }
}