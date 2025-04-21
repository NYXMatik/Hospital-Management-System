using System;
using System.Collections.Generic;
using Domain.Model;

namespace Application.DTO{
public class AppointmentCreateDTO
{
    public string AppointmentDate { get; set; }  // Mantener como string
    public string Description { get; set; }
    public string Doctor { get; set; }
    public string Status { get; set; }

    // Constructor para inicializar las propiedades
    public AppointmentCreateDTO(string description, string doctor, string status, string appointmentDate)
    {
        Description = description;
        Doctor = doctor;
        Status = status;
        AppointmentDate = appointmentDate;
    }
}
}