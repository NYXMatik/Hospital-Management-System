namespace DataModel.Model;

using System.ComponentModel.DataAnnotations;
using DataModel.Model;
using Domain.Model;
using Domain.Model.OperationType;

public class OperationTypeDataModel
{
    [Key]
    public string Name { get; set; }

    public SortedSet<VersionDataModel> Versions { get; set; }

    public OperationTypeDataModel() {}
    
    public OperationTypeDataModel(OperationType operation)
    {
        Name = operation.Name;
        Versions = new SortedSet<VersionDataModel>();
        foreach (var version in operation.Versions)
        {
            Versions.Add(new VersionDataModel(version));
        }
    }
}