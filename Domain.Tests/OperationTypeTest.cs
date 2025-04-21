namespace Domain.Tests;

using Domain.Model;
using Domain.Model.OperationType;

public class OperationTypeTest{

    [Theory]
    [InlineData("Consultation")]
    [InlineData("Surgery")]
    public void CreateOperationTypeSuccess(string name){
        SortedSet<Version> versions = new SortedSet<Version>(new VersionComparer());
        var operationType = new OperationType(name, versions);
        Assert.Equal(name, operationType.Name);
    }

    [Fact]
    public void CreateOperationTypeFailure(){

        Assert.Throws<System.ArgumentNullException>(() => new OperationType(null, new SortedSet<Version>(new VersionComparer())));
        Assert.Throws<System.ArgumentNullException>(() => new OperationType("", new SortedSet<Version>(new VersionComparer())));
    }

    [Theory]
    [InlineData("Bones","Doctor",1)]
    [InlineData("Cardio","Nurse",2)]
    public void CreateRequiredStaffSuccess(string speciality, string role, int quantity){
        // string specialty, string role, int quantity
        var requiredStaff = new RequiredStaff(speciality, role, quantity);
        Assert.Equal(role, requiredStaff.Role);
    }

    [Theory]
    [InlineData("Bones","Doctor",0)]
    [InlineData("Cardio","Nurse",-1)]
    public void CreateRequiredStaffFailure(string speciality, string role, int quantity){
        Assert.Throws<System.ArgumentNullException>(() => new RequiredStaff(speciality, role, quantity));
    }

    [Theory]
    [InlineData("Phase 1", "Description", 1, "01:00:00")]
    [InlineData("Phase 2", "Description", 1, "01:00:00")]
    public void CreatePhaseSuccess(string name, string description, int phaseStep, string duration){
        // string name, string description, int phaseStep, TimeSpan duration
        var phase = new Phase(name, description, phaseStep, TimeSpan.Parse(duration));
        Assert.Equal(name, phase.Name);
    }

    [Theory]
    [InlineData("Phase 1", "Description", 1, null)]
    [InlineData("Phase 2", "Description", 1, "00:00:00")]
    public void CreatePhaseFailure(string name, string description, int phaseStep, string duration){
        // string name, string description, int phaseStep, TimeSpan duration
        Assert.Throws<System.ArgumentNullException>(() => new Phase(name, description, phaseStep, TimeSpan.Parse(duration)));
    }


    [Theory]
    [InlineData(1)]
    public void AddVersionSuccess(int count){
        SortedSet<Version> versions = new SortedSet<Version>();
        var operationType = new OperationType("Consultation", versions);
        SortedSet<Phase> phases = new SortedSet<Phase>(new PhaseComparer());
        var phase = new Phase("Phase 1", "Description", 1, new TimeSpan(1, 0, 0));
        phases.Add(phase);
        phase = new Phase("Phase 2", "Description", 2, new TimeSpan(1, 0, 0));
        phases.Add(phase);
        phase = new Phase("Phase 3", "Description", 3, new TimeSpan(1, 0, 0));
        phases.Add(phase);

        var version = new Version(new DateOnly(2021, 10, 10), true, true, phases);
        operationType.AddVersion(version);
        Assert.Equal(count, operationType.Versions.Count);
    }

}