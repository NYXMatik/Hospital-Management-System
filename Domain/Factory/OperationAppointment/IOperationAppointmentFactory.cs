// IOperationAppointmentFactory.cs
namespace Domain.Factory;

using Domain.Model;
using Domain.Model.OperationType;
using Domain.Model.OperationAppointment;

public interface IOperationAppointmentFactory
{
    OperationAppointment NewAppointment(
        Guid appointmentId,
        List<Staff> staffList, 
        OperationType operationType, 
        Patient patient, 
        string room, 
        DateTime appointmentDateTime);
}