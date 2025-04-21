namespace DataModel.Repository;

using DataModel.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

public class OperationTypeContext : DbContext
{
    protected readonly IConfiguration Configuration;

    public OperationTypeContext(DbContextOptions<OperationTypeContext> options)
        : base(options)
    {
        Database.EnsureCreated();
    }

    public virtual DbSet<OperationTypeDataModel> OperationType { get; set; } = null!;
    
    public virtual DbSet<VersionDataModel> Versions { get; set; } = null!;
    
    public virtual DbSet<PhaseDataModel> Phases { get; set; } = null!;
    public virtual DbSet<RequiredStaffDataModel> RequiredStaffs { get; set; } = null!;
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        //modelBuilder.Entity<OperationTypeDataModel>().HasKey(p => p.Name);

        // Mapping for OperationDataModel
        modelBuilder.Entity<OperationTypeDataModel>(entity =>
        {
            entity.HasKey(p => p.Name);

            // Define relationship with VersionDataModel
            entity.HasMany(o => o.Versions)
                  .WithOne()
                  .HasForeignKey("OperationName")
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Mapping for VersionDataModel
        modelBuilder.Entity<VersionDataModel>(entity =>
        {
            entity.ToTable("Versions");
            entity.HasKey(v => v.Id);

            // Define relationship with PhaseDataModel
            entity.HasMany(v => v.Phases)
                  .WithOne()
                  .HasForeignKey("VersionId")
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Mapping for PhaseDataModel
        modelBuilder.Entity<PhaseDataModel>(entity =>
        {
            entity.ToTable("Phases");
            entity.HasKey(p => p.Id);

            // Define relationship with RequiredStaffDataModel
            entity.HasMany(p => p.StaffList)
                  .WithOne()
                  .HasForeignKey("PhaseId")
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Mapping for RequiredStaffDataModel
        modelBuilder.Entity<RequiredStaffDataModel>(entity =>
        {
            entity.ToTable("RequiredStaffs");
            entity.HasKey(rs => rs.Id);
        
        });
        
        base.OnModelCreating(modelBuilder);
    }
}
