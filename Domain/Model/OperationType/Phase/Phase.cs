namespace Domain.Model.OperationType;

public class Phase : IPhase
{
    private string _name;
    public string Name
    {
        get { return _name; }
    }

    private string _description;
    public string Description
    {
        get { return _description; }
    }

    private TimeSpan _duration;
    public TimeSpan Duration
    {
        get { return _duration; }
    }

    private int _phaseStep;
    public int PhaseStep
    {
        get { return _phaseStep; }
        set { _phaseStep = value; }
    }

    List<RequiredStaff> _requiredStaff;
    public List<RequiredStaff> StaffList
    {
        get { return _requiredStaff; }
    }
    //Clear Constructor
    private Phase(){}

    //General Constructor
    public Phase(string name, string description, int phaseStep, TimeSpan duration)
    {
        _name = name;
        _description = description;
        _phaseStep = phaseStep;

        if(duration == null || duration == TimeSpan.Zero)
        {
            throw new ArgumentNullException("Duration must be greater than 0");
        }

        _duration = duration;
        _requiredStaff = new List<RequiredStaff>();
    }

    //DTO to Domain
    public Phase(string name, string description, int phaseStep, TimeSpan duration, List<RequiredStaff> requiredStaff)
    {
        _name = name;
        _description = description;
        _phaseStep = phaseStep;
        _duration = duration;
        _requiredStaff = requiredStaff;
    }

    public void AddRequiredStaff(RequiredStaff requiredStaff)
    {
        _requiredStaff.Add(requiredStaff);
    }

    public void ClearRequiredStaff(RequiredStaff requiredStaff)
    {
        _requiredStaff = new List<RequiredStaff>();
    }

    public int Compare(IPhase y)
    {
        return _phaseStep.CompareTo(y.GetPhaseStep());
    }

    public int GetPhaseStep()
    {
        return _phaseStep;
    }
}