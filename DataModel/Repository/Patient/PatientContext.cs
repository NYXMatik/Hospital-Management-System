namespace DataModel.Repository;

using DataModel.Model;
using Domain.Model;
using Microsoft.EntityFrameworkCore;

using Microsoft.Extensions.Configuration;

public class PatientContext : DbContext
{
	protected readonly IConfiguration Configuration;

	//public PatientContext() {}
	public PatientContext(DbContextOptions<PatientContext> options)
		: base(options)
	{
		Database.EnsureCreated();
	}

	public virtual DbSet<PatientDataModel> Patients { get; set; } = null!;

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		// Mapeamento para PatientDataModel
		modelBuilder.Entity<PatientDataModel>(entity =>
		{
			//entity.ToTable("Patients"); // Isso define explicitamente o nome da tabela

			// Define Name como chave primária
       		entity.HasKey(p => p.MedicalRecordNum);

			// Define que Name é um Value Object
			entity.OwnsOne(s => s.Name/*, name =>
			{
				name.Property(n => n.FirstName).HasColumnName("FirstName");
				name.Property(n => n.LastName).HasColumnName("LastName");
				name.Property(n => n.FullName).HasColumnName("FullName");
			}*/);

			// Define que ContactInfo é um Value Object
			entity.OwnsOne(p => p.Contacts/*, contact =>
			{
				contact.Property(c => c.Email).HasColumnName("Email");
				contact.Property(c => c.PhoneNumber).HasColumnName("PhoneNumber");
			}*/);

			// Configurando o relacionamento de PatientDataModel com PatientAuditLog
        	entity.HasMany(p => p.AuditLogs)
              .WithOne()
              .OnDelete(DeleteBehavior.Cascade); 

		});

		base.OnModelCreating(modelBuilder);
	}
}
