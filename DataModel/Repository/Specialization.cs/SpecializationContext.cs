namespace DataModel.Repository;

using DataModel.Model;
using Microsoft.EntityFrameworkCore;

using Microsoft.Extensions.Configuration;

public class SpecializationContext : DbContext
{
	protected readonly IConfiguration Configuration;

	//public AbsanteeContext() {}
	public SpecializationContext(DbContextOptions<SpecializationContext> options)
		: base(options)
	{
		Database.EnsureCreated();
	}

	public virtual DbSet<SpecializationDataModel> Specializations { get; set; } = null!;

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{

		// Mapeamento para StaffDataModel
		modelBuilder.Entity<SpecializationDataModel>(entity =>
		{
			// Configurações para a entidade Specialization
			entity.HasKey(s => s.Name);
			
			entity.Property(s => s.Name)
				.IsRequired()
				.HasMaxLength(50);

			entity.Property(s => s.Description)
				.IsRequired()
				.HasMaxLength(500);
		});

		base.OnModelCreating(modelBuilder);
	}
}
