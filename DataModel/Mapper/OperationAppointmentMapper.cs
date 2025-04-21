namespace DataModel.Mapper;

using DataModel.Model;
using Domain.Model;
using Domain.Factory;
using Domain.Model.OperationType;
using Domain.Model.OperationAppointment;
using Humanizer;

public class OperationAppointmentMapper
{
    private readonly IOperationAppointmentFactory _appointmentFactory;
    private readonly OperationTypeMapper _operationTypeMapper;
    private readonly StaffMapper _staffMapper;

    private readonly PatientMapper _patientMapper;

    public OperationAppointmentMapper(
        IOperationAppointmentFactory appointmentFactory,
        OperationTypeMapper operationTypeMapper)
    {
        _appointmentFactory = appointmentFactory;
        _operationTypeMapper = operationTypeMapper;
    }

    public OperationAppointment ToDomain(OperationAppointmentDataModel appointmentDM)
    {
        var operationType = _operationTypeMapper.ToDomain(appointmentDM.OperationType);
        
        List<Staff> assignedStaff = new List<Staff>();
        foreach(StaffDataModel staffDM in appointmentDM.StaffList)
        {
            Staff staff = _staffMapper.ToDomain(staffDM);
            assignedStaff.Add(staff);
        }

        var patient = _patientMapper.ToDomain(appointmentDM.Patient);

        OperationAppointment appointmentDomain = _appointmentFactory.NewAppointment(
            appointmentDM.AppointmentId,
            assignedStaff,
            operationType,
            patient,
            appointmentDM.Room,
            appointmentDM.AppointmentDateTime);

        return appointmentDomain;
    }

    public IEnumerable<OperationAppointment> ToDomain(IEnumerable<OperationAppointmentDataModel> appointmentsDM)
    {
        List<OperationAppointment> appointmentsDomain = new List<OperationAppointment>();

        foreach(var appointmentDM in appointmentsDM)
        {
            OperationAppointment appointmentDomain = ToDomain(appointmentDM);
            appointmentsDomain.Add(appointmentDomain);
        }

        return appointmentsDomain.AsEnumerable();
    }

    public OperationAppointmentDataModel ToDataModel(OperationAppointment appointment)
    {
        OperationAppointmentDataModel appointmentDataModel = new OperationAppointmentDataModel(appointment);
        return appointmentDataModel;
    }
}