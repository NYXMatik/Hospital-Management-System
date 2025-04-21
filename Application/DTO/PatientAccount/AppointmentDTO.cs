namespace Application.DTO
{
    public class AppointmentDTO
    {
        public string AppointmentId { get; set; }
        public string PatientId { get; set; }
        public string AppointmentDate { get; set; }  
        public string Description { get; set; }
        public string Doctor { get; set; }
        public string Status { get; set; }

        public AppointmentDTO(string appointmentId, string patientId, string appointmentDate, string description, string doctor, string status)
        {
            AppointmentId = appointmentId;
            PatientId = patientId;
            AppointmentDate = appointmentDate;
            Description = description;
            Doctor = doctor;
            Status = status;
        }

        public static AppointmentDTO FromAppointment(Appointment appointment)
        {
            return new AppointmentDTO(
                appointment.AppointmentId,
                appointment.PatientId,
                appointment.AppointmentDate,
                appointment.Description,
                appointment.Doctor,
                appointment.Status
            );
        }
    }
}
