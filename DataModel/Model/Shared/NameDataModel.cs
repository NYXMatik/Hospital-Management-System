namespace DataModel.Model;

using Domain.Model;

public class NameDataModel
{
    public string FirstName {get;set;}
    public string LastName {get;set;}
    public string FullName {get;set;}

    public NameDataModel() {}
    
    public NameDataModel(Name name)
    {
        FirstName = name.FirstName;
        LastName = name.LastName;
        FullName = name.FullName;
    }
    public NameDataModel(string fullName)
        {
            FullName = fullName;
            var nameParts = fullName.Split(' ');
            
            FirstName = nameParts.Length > 0 ? nameParts[0] : string.Empty;
            LastName = nameParts.Length > 1 ? string.Join(" ", nameParts.Skip(1)) : string.Empty;
        }
}