using System;

public class Appointment
{
    public string AppointmentId { get; set; } 
    public string AppointmentDate { get; set; } // Consider validating date format if needed
    public string PatientId { get; set; }
    public string Description { get; set; }
    public string Doctor { get; set; }
    public string Status { get; set; }

    public Appointment(string appointmentId, string patientId, string appointmentDate, string description, string doctor, string status)
    {
        AppointmentId = appointmentId ?? throw new ArgumentNullException(nameof(appointmentId)); // Ensures AppointmentId is not null
        PatientId = patientId ?? throw new ArgumentNullException(nameof(patientId)); // Ensures PatientId is not null
        AppointmentDate = appointmentDate ?? throw new ArgumentNullException(nameof(appointmentDate)); // Ensures AppointmentDate is not null
        Description = description ?? throw new ArgumentNullException(nameof(description)); // Ensures Description is not null
        Doctor = doctor ?? throw new ArgumentNullException(nameof(doctor)); // Ensures Doctor is not null
        Status = status ?? throw new ArgumentNullException(nameof(status)); // Ensures Status is not null
    }
}
