namespace Domain.Model;

using System.ComponentModel.DataAnnotations;

public class Specialization : ISpecialization
{

	[Key]
	private string _name;
	public string Name
	{
		get { return _name; }
	}

    /*private long _id;
    public long Id
    {
        get { return _id; }
    }*/

    private string _description;
	public string Description
	{
		get { return _description; }
	}

	private Specialization() {}

    public Specialization(/*long id,*/ string name, string description) {

		if ( IsValidName(name) || IsValidDescription(description) ) {
			//_id = id;
			_name = name;
			_description = description;
        }
		else {
			throw new ArgumentException("Invalid arguments: " + name + ", " + description);
		}
	}

    private bool IsValidName(string name)
	{
        if (string.IsNullOrWhiteSpace(name) || name.Length > 50 || name.Any(char.IsDigit))
                return false;
        
        return true;
	}

	private bool IsValidDescription(string description)
	{
		//verifies if description is null or empty
		if (string.IsNullOrWhiteSpace(description))
		{
			return false;
		}

		//verifies if the size is between 10 and 500 caracters
		if (description.Length < 10 || description.Length > 500)
		{
			return false;
		}

		// description can not have special caracters 
		var invalidChars = new[] { '@', '#', '$', '%', '^', '&', '*' };
		if (description.Any(c => invalidChars.Contains(c)))
		{
			return false;
		}
		
		return true;
	}


    /*public long getId()
	{
	    return _id;
	}*/

	public string GetName() {
		return _name;
	}

    public string GetDescription() {
		return _description;
	}

}