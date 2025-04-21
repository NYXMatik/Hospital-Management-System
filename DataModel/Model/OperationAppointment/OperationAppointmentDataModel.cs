namespace DataModel.Model;

using System.ComponentModel.DataAnnotations;
using Domain.Model.OperationAppointment;
using Domain.Model.OperationType;


public class OperationAppointmentDataModel
{

    [Key]
    public Guid AppointmentId { get; set; }
    // Add this property as an alias for AppointmentId
    public Guid Id { get => AppointmentId; set => AppointmentId = value; }

    public OperationTypeDataModel OperationType { get; set; }
    public PatientDataModel Patient { get; set; }
    public string Room { get; set; }
    public DateTime AppointmentDateTime { get; set; }
    public ICollection<StaffDataModel> StaffList { get; set; }

    public OperationAppointmentDataModel() {}

    public OperationAppointmentDataModel(OperationAppointment operationAppointment)
    {
        AppointmentId = operationAppointment.AppointmentId;
        OperationType = new OperationTypeDataModel(operationAppointment.OperationType);
        Patient = new PatientDataModel(operationAppointment.Patient);
        Room = operationAppointment.Room;
        AppointmentDateTime = operationAppointment.AppointmentDateTime;
        StaffList = new List<StaffDataModel>();
        foreach (var staff in operationAppointment.StaffList)
        {
            StaffList.Add(new StaffDataModel(staff));
        }
    }
}