namespace DataModel.Model;

using Domain.Model;

public class StaffDataModel
{
    public string Id { get; set; }
    public string LicenseNumber { get; set; }
	public NameDataModel Name { get; set; }
    public ContactInfoDataModel Contact { get; set; }
    public string Specialization { get; set; }
    //public StaffSpecializationDataModel Specialization { get; set; }

    public List<StaffAuditLogsDataModel> AuditLogs { get; set; }
    public bool Active { get; set; }
    
    public StaffDataModel() {}

    public StaffDataModel(Staff staff)
    {
        LicenseNumber = staff.LicenseNumber;
        Id = staff.Id;
        Name = new NameDataModel(staff.Name);
        Contact = new ContactInfoDataModel(staff.Contact);
        Specialization = staff.Specialization;
        //Specialization = new StaffSpecializationDataModel(staff.Specialization);

        AuditLogs = staff.AuditLogs
            .Select(log => new StaffAuditLogsDataModel(log))
            .ToList();

        Active = staff.Active;
    }
}