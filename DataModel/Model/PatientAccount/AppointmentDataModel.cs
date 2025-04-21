using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DataModel.Model
{
    public class AppointmentDataModel
    {
        [Key]
        public string AppointmentId { get; set; }
        public string AppointmentDate { get; set; }

        public string Description { get; set; }
        public string Doctor { get; set; }
        public string Status { get; set; }

        public string PatientId { get; set; }

        [ForeignKey("PatientId")]
        public PatientAccountDataModel PatientAccount { get; set; }

        // Default constructor
        public AppointmentDataModel() {}

        // Constructor that accepts an Appointment domain model
        public AppointmentDataModel(Appointment appointment)
        {
            AppointmentId = Guid.NewGuid().ToString(); // Ensure ID is set
            AppointmentDate = appointment.AppointmentDate; 
            Description = appointment.Description;
            Doctor = appointment.Doctor;
            Status = appointment.Status;
        }

        // Additional constructor
        public AppointmentDataModel(string appointmentDate, string description, string doctor, string status)
        {
            AppointmentId = Guid.NewGuid().ToString(); // Ensure ID is set
            AppointmentDate = appointmentDate; // If string, convert to DateTime
            Description = description;
            Doctor = doctor;
            Status = status;
        }
    }
}
