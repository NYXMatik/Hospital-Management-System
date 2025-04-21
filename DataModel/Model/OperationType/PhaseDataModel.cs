namespace DataModel.Model;

using System.ComponentModel.DataAnnotations;
using DataModel.Model;
using Domain.Model;
using Domain.Model.OperationType;
using Microsoft.CodeAnalysis.FlowAnalysis.DataFlow;

public class PhaseDataModel : IComparable<PhaseDataModel>
{   
    [Key]
    public Guid Id { get; set; }

    public string Name { get; set; }

    public int PhaseStep { get; set; }
    public string Description { get; set; }
    public TimeSpan Duration { get; set; }
    public List<RequiredStaffDataModel> StaffList { get; set; }

    public PhaseDataModel() {}

    public PhaseDataModel(Phase phase)
    {
        Name = phase.Name;
        Id = new Guid();
        PhaseStep = phase.PhaseStep;
        Description = phase.Description;
        Duration = phase.Duration;
        StaffList = new List<RequiredStaffDataModel>();
        foreach (var requiredStaff in phase.StaffList)
        {
            StaffList.Add(new RequiredStaffDataModel(requiredStaff));
        }
    }

    public int CompareTo(PhaseDataModel? other)
    {
        if(other == null)
        {
            return 1;
        }
        if(PhaseStep > other.PhaseStep)
        {
            return 1;
        }
        else if(PhaseStep < other.PhaseStep)
        {
            return -1;
        }
        else
        {
            return 0;
        }
    }
}