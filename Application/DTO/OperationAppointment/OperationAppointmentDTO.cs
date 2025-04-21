namespace Domain.Model.OperationAppointment
{
    using Domain.Model.OperationType;
    using Application.DTO;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public class OperationAppointmentDTO
    {
        public Guid AppointmentId { get; set; }
        public List< ListStaffDTO> StaffList { get; set; }
        public OperationTypeDTO OperationType { get; set; }
        public PatientDTO Patient { get; set; }
        public string Room { get; set; }
        public DateTime AppointmentDateTime { get; set; }

        public OperationAppointmentDTO(Guid appointmentId, List< ListStaffDTO> staffList, OperationTypeDTO operationType, PatientDTO patient, string room, DateTime appointmentDateTime)
        {
            AppointmentId = appointmentId;
            StaffList = staffList;
            OperationType = operationType;
            Patient = patient;
            Room = room;
            AppointmentDateTime = appointmentDateTime;
        }

        public OperationAppointmentDTO(OperationAppointment operationAppointment)
        {
            AppointmentId = operationAppointment.AppointmentId;
            StaffList =  ListStaffDTO.ToDTO(operationAppointment.StaffList).ToList();
            OperationType = OperationTypeDTO.ToDTO(operationAppointment.OperationType);
            Patient = PatientDTO.ToDTO(operationAppointment.Patient);
            Room = operationAppointment.Room;
            AppointmentDateTime = operationAppointment.AppointmentDateTime;
        }

        // Convert OperationAppointment to OperationAppointmentDTO
        public static OperationAppointmentDTO ToDTO(OperationAppointment operationAppointment)
        {
            return new OperationAppointmentDTO(
                operationAppointment.AppointmentId,
                ListStaffDTO.ToDTO(operationAppointment.StaffList).ToList(),
                OperationTypeDTO.ToDTO(operationAppointment.OperationType),
                PatientDTO.ToDTO(operationAppointment.Patient),
                operationAppointment.Room,
                operationAppointment.AppointmentDateTime
            );
        }

        // Convert a list of OperationAppointments to a list of OperationAppointmentDTOs
        public static IEnumerable<OperationAppointmentDTO> ToDTO(IEnumerable<OperationAppointment> operationAppointments)
        {
            List<OperationAppointmentDTO> operationAppointmentDTOs = new List<OperationAppointmentDTO>();
            foreach (var operationAppointment in operationAppointments)
            {
                operationAppointmentDTOs.Add(ToDTO(operationAppointment));
            }
            return operationAppointmentDTOs;
        }

        // Convert OperationAppointmentDTO to OperationAppointment
        public static OperationAppointment ToDomain(OperationAppointmentDTO operationAppointmentDTO, List<CreateStaffDTO> createStaffDTOs)
        {
            return new OperationAppointment(
                operationAppointmentDTO.AppointmentId,
                createStaffDTOs.Select(dto => CreateStaffDTO.ToDomain(dto, dto.FullName)).ToList(),
                OperationTypeDTO.ToDomain(operationAppointmentDTO.OperationType, operationAppointmentDTO.OperationType.Name),
                PatientDTO.ToDomain(operationAppointmentDTO.Patient, operationAppointmentDTO.Patient.MedicalRecordNum),
                operationAppointmentDTO.Room,
                operationAppointmentDTO.AppointmentDateTime
            );
        }

        // Convert a list of OperationAppointmentDTOs to a list of OperationAppointments
        public static IEnumerable<OperationAppointment> ToDomain(IEnumerable<OperationAppointmentDTO> operationAppointmentDTOs, List<List<CreateStaffDTO>> createStaffDTOLists)
        {
            List<OperationAppointment> operationAppointments = new List<OperationAppointment>();
            int index = 0;
            foreach (var operationAppointmentDTO in operationAppointmentDTOs)
            {
                operationAppointments.Add(ToDomain(operationAppointmentDTO, createStaffDTOLists[index]));
                index++;
            }
            return operationAppointments;
        }
    }
}