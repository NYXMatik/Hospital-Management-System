using Domain.Model.OperationAppointment;

public interface IOperationAppointmentRepository
{
    Task<IEnumerable<OperationAppointment>> GetAppointmentsAsync();
    Task AddAppointmentAsync(OperationAppointment appointment);
    Task<OperationAppointment> GetAppointmentByIdAsync(int id);
    Task UpdateAppointmentAsync(OperationAppointment appointment);
    Task DeleteAppointmentAsync(int id);
}