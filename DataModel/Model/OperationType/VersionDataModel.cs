namespace DataModel.Model;

using DataModel.Model;
using Domain.Model;
using Domain.Model.OperationType;
using Microsoft.CodeAnalysis.FlowAnalysis.DataFlow;
using System.ComponentModel.DataAnnotations;

public class VersionDataModel : IComparable<VersionDataModel>
{
    [Key]
    public Guid Id { get; set; }
    public int VersionNumber { get; set; }
    public DateOnly Date { get; set; }
    public bool Status { get; set; }
    public bool Pending { get; set; }
    public SortedSet<PhaseDataModel> Phases { get; set; }

    public VersionDataModel() {}

    public VersionDataModel(Version version)
    {
        Id = new Guid();
        VersionNumber = version.VersionNumber;
        Date = version.Date;
        Status = version.Status;
        Pending = version.Pending;
        Phases = new SortedSet<PhaseDataModel>();
        foreach (var phase in version.Phases)
        {
            Phases.Add(new PhaseDataModel(phase));
        }
    }

    public int CompareTo(VersionDataModel? other)
    {
        if(other == null)
        {
            return 1;
        }
        if(VersionNumber > other.VersionNumber)
        {
            return 1;
        }
        else if(VersionNumber < other.VersionNumber)
        {
            return -1;
        }
        else
        {
            return 0;
        }
    }
}