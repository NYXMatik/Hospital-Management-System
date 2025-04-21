namespace DataModel.Repository;

using Microsoft.EntityFrameworkCore;

using DataModel.Model;

public interface IGenericContext
{
	DbSet<StaffDataModel> Staffs { get; set; }
	DbSet<PatientDataModel> Patients { get; set; }
	DbSet<OperationTypeDataModel> Operations { get; set; }

	//PatientAccount
	DbSet<PatientAccountDataModel> PatientAccounts { get; set; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
	DbSet<TEntity> Set<TEntity>() where TEntity : class;
    
}