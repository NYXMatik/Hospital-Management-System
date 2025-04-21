namespace DataModel.Repository;

    using DataModel.Model;
    using Microsoft.EntityFrameworkCore;

    public interface IPatientAccountContext
    {
        DbSet<PatientAccountDataModel> PatientAccounts { get; set; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);

        DbSet<TEntity> Set<TEntity>() where TEntity : class;
        void OnModelCreating(ModelBuilder modelBuilder);
    }

