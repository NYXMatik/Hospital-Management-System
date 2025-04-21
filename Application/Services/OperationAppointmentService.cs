namespace Application.Services;

using Domain.Model;
using Application.DTO;

using Microsoft.EntityFrameworkCore;
using Domain.IRepository;
using Domain.Model.OperationAppointment;

public class OperationAppointmentService
{
    private readonly IOperationAppointmentRepository _operationAppointmentRepository;

    // Constructor to initialize the repository
    public OperationAppointmentService(IOperationAppointmentRepository operationRepository)
    {
        _operationAppointmentRepository = operationRepository;
    }

    // Method to get all operation appointments
    public async Task<IEnumerable<OperationAppointmentDTO>> GetAll()
    {
        // Fetch all appointments from the repository
        IEnumerable<OperationAppointment> appointments = await _operationAppointmentRepository.GetAppointmentsAsync();

        // Convert to DTOs
        IEnumerable<OperationAppointmentDTO> appointmentsDTO = OperationAppointmentDTO.ToDTO(appointments);
        return appointmentsDTO;
    }

    // Method to add a new operation appointment
    public async Task AddAppointment(OperationAppointment appointment)
    {
        await _operationAppointmentRepository.AddAppointmentAsync(appointment);
    }

    // Method to get an operation appointment by ID
    public async Task<OperationAppointment> GetAppointmentById(int id)
    {
        return await _operationAppointmentRepository.GetAppointmentByIdAsync(id);
    }

    // Method to update an existing operation appointment
    public async Task UpdateAppointment(int id, OperationAppointment updatedAppointment)
    {
        var appointment = await _operationAppointmentRepository.GetAppointmentByIdAsync(id);
        if (appointment != null)
        {
            appointment.StaffList = updatedAppointment.StaffList;
            appointment.OperationType = updatedAppointment.OperationType;
            appointment.Patient = updatedAppointment.Patient;
            appointment.Room = updatedAppointment.Room;
            appointment.AppointmentDateTime = updatedAppointment.AppointmentDateTime;

            await _operationAppointmentRepository.UpdateAppointmentAsync(appointment);
        }
    }

    // Method to delete an operation appointment by ID
    public async Task DeleteAppointment(int id)
    {
        var appointment = await _operationAppointmentRepository.GetAppointmentByIdAsync(id);
        if (appointment != null)
        {
            await _operationAppointmentRepository.DeleteAppointmentAsync(id);
        }
    }
}