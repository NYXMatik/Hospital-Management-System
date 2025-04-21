namespace DataModel.Repository
{
    using DataModel.Model;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Configuration;

    public class PatientAccountContext : DbContext
    {
        protected readonly IConfiguration Configuration;

        public PatientAccountContext(DbContextOptions<PatientAccountContext> options)
            : base(options)
        {
            Database.EnsureCreated();
        }

        public virtual DbSet<PatientAccountDataModel> PatientAccounts { get; set; } = null!;
        public virtual DbSet<AppointmentDataModel> Appointments { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<PatientAccountDataModel>(entity =>
            {
                entity.HasKey(p => p.ProfileId);

                entity.Property(p => p.BirthDate).IsRequired();
                entity.Property(p => p.IsEmailVerified).IsRequired();
                entity.Property(p => p.Active).IsRequired();

                entity.OwnsOne(p => p.Address, address =>
                {
                    address.Property(a => a.Street).HasColumnName("Address_Street");
                    address.Property(a => a.City).HasColumnName("Address_City");
                    address.Property(a => a.State).HasColumnName("Address_State");
                    address.Property(a => a.PostalCode).HasColumnName("Address_PostalCode");
                    address.Property(a => a.Country).HasColumnName("Address_Country");
                });

                entity.OwnsOne(p => p.Name, name =>
                {
                    name.Property(n => n.FirstName).HasColumnName("Name_FirstName");
                    name.Property(n => n.LastName).HasColumnName("Name_LastName");
                });

                entity.OwnsOne(p => p.ContactInfo, contact =>
                {
                    contact.Property(c => c.Email).HasColumnName("Contact_Email");
                    contact.Property(c => c.PhoneNumber).HasColumnName("Contact_PhoneNumber");
                });

                entity.HasMany(p => p.Appointments)
                      .WithOne(a => a.PatientAccount)
                      .HasForeignKey(a => a.PatientId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<PatientAuditLogsDataModel>(entity =>
            {
                entity.HasKey(e => e.LogId);
            });

            modelBuilder.Entity<AppointmentDataModel>(entity =>
            {
                entity.HasKey(a => a.AppointmentId);

                entity.Property(a => a.AppointmentDate).IsRequired();
                entity.Property(a => a.Description).IsRequired();
                entity.Property(a => a.Doctor).IsRequired();
                entity.Property(a => a.Status).IsRequired();

                entity.HasOne(a => a.PatientAccount)
                      .WithMany(p => p.Appointments)
                      .HasForeignKey(a => a.PatientId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            base.OnModelCreating(modelBuilder);
        }
    }
}
