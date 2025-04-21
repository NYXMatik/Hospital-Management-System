namespace DataModel.Model;

using System.ComponentModel.DataAnnotations;
using Domain.Model;

public class SpecializationDataModel
{
    public string Name { get; set; }
	public string Description { get; set; }
    //public long Id { get; set; }
    
    public SpecializationDataModel() {}

    public SpecializationDataModel(Specialization specialization)
    {
        //Id = specialization.Id;
        Name = specialization.Name;
        Description = specialization.Description;
    }
}