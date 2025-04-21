// OperationAppointmentFactory.cs
namespace Domain.Factory;

using Domain.Model;
using Domain.Model.OperationType;
using Domain.Model.OperationAppointment;

public class OperationAppointmentFactory : IOperationAppointmentFactory
{
    public OperationAppointment NewAppointment(
        Guid appointmentId,
        List<Staff> staffList,
        OperationType operationType,
        Patient patient,
        string room,
        DateTime appointmentDateTime)
    {
        return new OperationAppointment(
            appointmentId,
            staffList,
            operationType,
            patient,
            room,
            appointmentDateTime);
    }
}