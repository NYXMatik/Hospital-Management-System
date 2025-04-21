namespace DataModel.Repository;

using Microsoft.EntityFrameworkCore;

using DataModel.Model;

public interface IOperationTypeContext{
	DbSet<OperationTypeDataModel> Operations { get; set; }
	/*DbSet<VersionDataModel> Versions { get; set; }
	DbSet<PhaseDataModel> Phases { get; set; }
	DbSet<RequiredStaffDataModel> RequiredStaffs { get; set; }*/
}