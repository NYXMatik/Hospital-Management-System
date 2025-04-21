namespace Domain.Model.OperationAppointment;


using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Domain.Model.OperationType;

public class OperationAppointment
{
    [Key]
    public Guid AppointmentId { get; set; }
    public List<Staff> StaffList { get; set; }
    public OperationType OperationType { get; set; }
    public Patient Patient { get; set; }
    public string Room { get; set; }
    public DateTime AppointmentDateTime { get; set; }

    public OperationAppointment(List<Staff> staffList, OperationType operationType, Patient patient, string room, DateTime appointmentDateTime)
    {
        AppointmentId = Guid.NewGuid();
        StaffList = staffList;
        OperationType = operationType;
        Patient = patient;
        Room = room;
        AppointmentDateTime = appointmentDateTime;
    }
    public OperationAppointment(Guid appointmentId, List<Staff> staffList, OperationType operationType, Patient patient, string room, DateTime appointmentDateTime)
    {
        AppointmentId = appointmentId;
        StaffList = staffList;
        OperationType = operationType;
        Patient = patient;
        Room = room;
        AppointmentDateTime = appointmentDateTime;
    }
}