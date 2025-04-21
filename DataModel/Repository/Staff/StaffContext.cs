namespace DataModel.Repository;

using DataModel.Model;
using Microsoft.EntityFrameworkCore;

using Microsoft.Extensions.Configuration;

public class StaffContext : DbContext
{
	protected readonly IConfiguration Configuration;

	//public AbsanteeContext() {}
	public StaffContext(DbContextOptions<StaffContext> options)
		: base(options)
	{
		Database.EnsureCreated();
	}

	public virtual DbSet<StaffDataModel> Staffs { get; set; } = null!;

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{

		// Mapeamento para StaffDataModel
		modelBuilder.Entity<StaffDataModel>(entity =>
		{
			// Define LicenseNumber como chave primária
			entity.HasKey(s => s.Id);
	
			// Define que LicenseNumber é um Value Object
			entity.Property(s => s.LicenseNumber)
            .IsRequired();

			// Define que Name é um Value Object
			entity.OwnsOne(s => s.Name);

			// Define que Contact é um Value Object
			entity.OwnsOne(s => s.Contact);

			entity.Property(s => s.Specialization);
            
			// Configura a chave estrangeira para Specialization
            /*entity.Property(s => s.SpecializationName)
                .HasColumnName("SpecializationName")
                .IsRequired();*/

            /*entity.HasOne<SpecializationDataModel>()
                .WithMany() // Relação de 1 para muitos, unilateral
                .HasForeignKey(s => s.SpecializationName)
                .IsRequired();*/

			// Relacionamento entre StaffDataModel e StaffAuditLog
        	/*entity.HasMany(s => s.AuditLogs)
              .WithOne()
              .OnDelete(DeleteBehavior.Cascade); */

			entity.Property(s => s.Active);

		});

		base.OnModelCreating(modelBuilder);
	}
}
