namespace DataModel.Repository;

using DataModel.Model;
using Domain.Model;
using Microsoft.EntityFrameworkCore;

using Microsoft.Extensions.Configuration;

public class GenericContext : DbContext
{
	protected readonly IConfiguration Configuration;

	public GenericContext(DbContextOptions<GenericContext> options)
		: base(options)
	{
		Database.EnsureCreated();
	}

	public virtual DbSet<PatientDataModel> Patients { get; set; } = null!;
    public virtual DbSet<StaffDataModel> Staffs { get; set; } = null!;
	
	public virtual DbSet<OperationTypeDataModel> OperationType { get; set; } = null!;
    public virtual DbSet<VersionDataModel> Versions { get; set; } = null!;
    public virtual DbSet<PhaseDataModel> Phases { get; set; } = null!;
    public virtual DbSet<RequiredStaffDataModel> RequiredStaffs { get; set; } = null!;
    
    public virtual DbSet<PatientAccountDataModel> PatientAccounts { get; set; } = null!;
    

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		// Mapeamento para PatientDataModel
		modelBuilder.Entity<PatientDataModel>(entity =>
		{
       		entity.HasKey(p => p.MedicalRecordNum);

			entity.OwnsOne(s => s.Name);

			entity.OwnsOne(p => p.Contacts);

        	entity.HasMany(p => p.AuditLogs)
              .WithOne()
              .OnDelete(DeleteBehavior.Cascade); 

		});

        // Mapeamento para StaffDataModel
		modelBuilder.Entity<StaffDataModel>(entity =>
		{
			entity.HasKey(s => s.Id);
	
			entity.Property(s => s.LicenseNumber).IsRequired();

			entity.OwnsOne(s => s.Name);

			entity.OwnsOne(s => s.Contact);

			entity.Property(s => s.Specialization);
            
			entity.Property(s => s.Active);

		});

        // Mapping for OperationTypeDataModel
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

        // Mapeamento para PatientAccountDataModel
            modelBuilder.Entity<PatientAccountDataModel>(entity =>
            {
                // Define ProfileId como chave primária
                entity.HasKey(p => p.ProfileId);

                // Define BirthDate como un campo requerido
                entity.Property(p => p.BirthDate)
                    .IsRequired();

                // Define IsEmailVerified como un campo requerido
                entity.Property(p => p.IsEmailVerified)
                    .IsRequired();

                // Define Active como un campo requerido
                entity.Property(p => p.Active)
                    .IsRequired();

                // Mapeo explícito para Address
                entity.OwnsOne(p => p.Address, address =>
                {
                    address.Property(a => a.Street).HasColumnName("Address_Street");
                    address.Property(a => a.City).HasColumnName("Address_City");
                    address.Property(a => a.State).HasColumnName("Address_State");
                    address.Property(a => a.PostalCode).HasColumnName("Address_PostalCode");
                    address.Property(a => a.Country).HasColumnName("Address_Country");
                });

                // Mapeo explícito para Name (si es necesario)
                entity.OwnsOne(p => p.Name, name =>
                {
                    name.Property(n => n.FirstName).HasColumnName("Name_FirstName");
                    name.Property(n => n.LastName).HasColumnName("Name_LastName");
                });

                // Mapeo explícito para ContactInfo (si es necesario)
                entity.OwnsOne(p => p.ContactInfo, contact =>
                {
                    contact.Property(c => c.Email).HasColumnName("Contact_Email");
                    contact.Property(c => c.PhoneNumber).HasColumnName("Contact_PhoneNumber");
                });
            });

            // Mapeo para PatientAuditLogsDataModel
            modelBuilder.Entity<PatientAuditLogsDataModel>(entity =>
            {
                entity.HasKey(e => e.LogId); // Define LogId como clave primaria
            });

            modelBuilder.Entity<OperationAppointmentDataModel>(entity =>
            {
                entity.HasKey(e => e.AppointmentId);

                entity.Property(e => e.Room)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.AppointmentDateTime)
                    .IsRequired();

                // Configure many-to-many relationship
                entity.HasMany(e => e.StaffList)
                    .WithMany()
                    .UsingEntity<OperationAppointmentStaffDataModel>(
                        l => l.HasOne(x => x.Staff)
                                .WithMany()
                                .HasForeignKey(x => x.StaffId),
                        r => r.HasOne(x => x.OperationAppointment)
                                .WithMany()
                                .HasForeignKey(x => x.OperationAppointmentId)
                    );

                entity.ToTable("OperationAppointments");
            });


		base.OnModelCreating(modelBuilder);
	}
}
