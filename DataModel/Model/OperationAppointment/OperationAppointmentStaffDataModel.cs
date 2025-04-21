using DataModel.Model;

public class OperationAppointmentStaffDataModel
{
    public Guid OperationAppointmentId { get; set; }
    public string StaffId { get; set; }
    
    public OperationAppointmentDataModel OperationAppointment { get; set; }
    public StaffDataModel Staff { get; set; }
}