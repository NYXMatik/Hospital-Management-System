namespace DataModel.Mapper;

using DataModel.Model;

using Domain.Model;
using Domain.Factory;
using Domain.IRepository;

public class StaffMapper
{
    private IStaffFactory _staffFactory;
    private ISpecializationRepository _specializationRepository;

    public StaffMapper(IStaffFactory staffFactory, ISpecializationRepository specializationRepository)
    {
        _staffFactory = staffFactory;
        _specializationRepository = specializationRepository;
    }

    public Staff ToDomain(StaffDataModel staffDM)
    {

        if(staffDM.Active){
            Staff staffDomain = _staffFactory.NewStaff(staffDM.Id, staffDM.Name.FullName, 
            staffDM.LicenseNumber, staffDM.Contact.Email, staffDM.Contact.PhoneNumber, staffDM.Specialization);

            return staffDomain;
        }else{
            return null;
        }

    }

    public Staff ToDomain(StaffDataModel staffDM, List<StaffAuditLogsDataModel> auditLogsDM)
    {

        if(staffDM.Active){
            Staff staffDomain = _staffFactory.NewStaff(staffDM.Id, staffDM.Name.FullName, 
            staffDM.LicenseNumber, staffDM.Contact.Email, staffDM.Contact.PhoneNumber, staffDM.Specialization);
            
            var auditLogs = AuditLogsToDomain(auditLogsDM);
            staffDomain.UpdateAuditLogs(auditLogs);

            return staffDomain;
        }else{
            return null;
        }

    }

    public IEnumerable<Staff> ToDomain(IEnumerable<StaffDataModel> staffsDataModel)
    {
        List<Staff> staffsDomain = new List<Staff>();

        foreach(StaffDataModel staffDataModel in staffsDataModel)
        {
            if(staffDataModel.Active){
                
                Staff staffDomain = ToDomain(staffDataModel);

                staffsDomain.Add(staffDomain);
            }
        }

        return staffsDomain.AsEnumerable();
    }

       public StaffDataModel ToDataModel(Staff staff)
    {
        StaffDataModel staffDataModel = new StaffDataModel(staff);

        return staffDataModel;
    }

    public bool UpdateDataModel(StaffDataModel staffDataModel, Staff staffDomain)
    {
        staffDataModel.Contact.Email = staffDomain.GetEmail();
        staffDataModel.Contact.PhoneNumber = staffDomain.GetPhoneNumber();
        staffDataModel.Specialization = staffDomain.GetSpecialization();
        
         // Converte cada StaffAuditLog do domínio para StaffAuditLogsDataModel
        staffDataModel.AuditLogs = staffDomain.GetAuditLogs()
            .Select(log => new StaffAuditLogsDataModel(log))
            .ToList();

        return true;
    }

    public bool DeactivatedDataModel(StaffDataModel staffDataModel, Staff staffDomain)
    {
        staffDataModel.Active = staffDomain.Active;

        return true;
    }

    public List<StaffAuditLog> AuditLogsToDomain(List<StaffAuditLogsDataModel> auditLogsDM)
    {
        List<StaffAuditLog> auditLogs = auditLogsDM
            .Select(log => _staffFactory.NewAuditLog(log.FieldName, log.OldValue, log.NewValue))
            .ToList();

        return auditLogs;
    }


}