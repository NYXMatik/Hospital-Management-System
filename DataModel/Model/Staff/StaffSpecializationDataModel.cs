using Domain.Model;

public class StaffSpecializationDataModel
{
    public string Name { get; set; }
    public Specialization Specialization1 { get; set; }
    
    public StaffSpecializationDataModel() {}

    public StaffSpecializationDataModel(Specialization specialization)
    {
        Name = specialization.Name;
        Specialization1 = specialization;
    }
}