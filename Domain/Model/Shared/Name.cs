namespace Domain.Model;

public class Name : IName
{    
     private string _firstName;
	public string FirstName
	{
		get { return _firstName; }
	}

    private string _lastName;
	public string LastName
	{
		get { return _lastName; }
	}

    private string _fullName;
	public string FullName
	{
		get { return _fullName; }
	}

    public Name(string fullName){
		_fullName = fullName;

    	// Divide fullName
		var names = fullName.Split(' ', StringSplitOptions.RemoveEmptyEntries);

		// First and Last Names
		if (names.Length > 0){
			_firstName = names[0]; 
			_lastName = names[names.Length - 1]; 
		}
		        
    }

	public bool UpdateFullName(string fullName)
    {
        _fullName = fullName;

        return true;
    }

	public bool UpdateFirstName(string firstName)
    {
        _firstName = firstName;

        return true;
    }

	public bool UpdateLastName(string lastName)
    {
        _lastName = lastName;

        return true;
    }

	public static bool IsValidName(string name){
		if(name==null || name.Length > 50 
			|| string.IsNullOrWhiteSpace(name)  
			|| ContainsAny(name, ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]))
			return false;
		else
			return true;
	}

	private static bool ContainsAny(string stringToCheck, params string[] parameters){
		return parameters.Any(parameter => stringToCheck.Contains(parameter));
	}

}