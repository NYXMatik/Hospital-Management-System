using Domain.Model.OperationType;
using Version = Domain.Model.OperationType.Version;


namespace Application.DTO;

public class VersionDTO
{
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
        set { _date = value; }
    }

    private bool _status;
    public bool Status
    {
        get { return _status; }
        set { _status = value; }
    }

    private bool _pending;
    public bool Pending
    {
        get { return _pending; }
        set { _pending = value; }
    }

    private List<PhaseDTO> _phases;
    public List<PhaseDTO> Phases
    {
        get { return _phases; }
        set { _phases = value; }
    }

    public VersionDTO(){}

    public VersionDTO(int versionNumber, DateOnly date, bool status, bool pending, List<PhaseDTO> phases)
    {
        _versionNumber = versionNumber;
        _date = date;
        _status = status;
        _pending = pending;
        _phases = phases;
    }

    static public VersionDTO ToDTO(Version version)
    {
        List<PhaseDTO> phases = new List<PhaseDTO>();
        foreach (Phase phase in version.Phases)
        {
            phases.Add(PhaseDTO.ToDTO(phase));
        }

        return new VersionDTO(version.GetVersion(), version.GetStartDate(), version.GetStatus(), version.Pending, phases);
    }

    static public IEnumerable<VersionDTO> ToDTO(IEnumerable<Version> versions)
    {
        List<VersionDTO> versionsDTO = new List<VersionDTO>();

        foreach( Version version in versions ) {
            VersionDTO versionDTO = ToDTO(version);

            versionsDTO.Add(versionDTO);
        }

        return versionsDTO;
    }

    static public Version ToDomain(VersionDTO versionDTO)
    {
        SortedSet<Phase> phases = new SortedSet<Phase>(new PhaseComparer());
        foreach (PhaseDTO phaseDTO in versionDTO.Phases)
        {
            phases.Add(PhaseDTO.ToDomain(phaseDTO));
        }

        Version version = new Version(versionDTO.Date, versionDTO.Status, versionDTO.Pending, phases);
        version.SetVersion(versionDTO.VersionNumber);

        return version;
    }
}