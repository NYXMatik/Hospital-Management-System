namespace Domain.Model;

using System.ComponentModel.DataAnnotations;
using System.Globalization;
using Domain.Factory;

public class Patient : IPatient
{
    [Key]
    private string _medicalNum;
    public string MedicalRecordNum
    {
        get { return _medicalNum; }
    }

    private Name _name;
    public Name Name
    {
        get { return _name; }
    }

    private ContactInfo _contacts;
    public ContactInfo ContactInfo
    {
        get { return _contacts; }
    }

    private Gender _gender;
    public Gender Gender
    {
        get { return _gender; }
    }

    private string _birth;
    public string DateOfBirth
    {
        get { return _birth; }
    }

    private string _emergencyContact;
    public string EmergencyContact
    {
        get { return _emergencyContact; }
    }

	private List<PatientAuditLog> _auditLogs;
	public List<PatientAuditLog> AuditLogs
    {
        get { return _auditLogs; }
    }

	private bool _active;
	public bool Active
    {
        get { return _active; }
    }

	public bool IsEmailVerified { get; set; }

    private Patient() {}

    public Patient(string medicalRecordNum, string strName, string strEmail, string strPhone, string gender, string strBirth, string strEmerContact)
    {
        Gender genderAssigned = ValidateAndAssignGender(gender);
        if (IsValidParameters(strName, strEmail, strPhone, strBirth, strEmerContact))
        {
            _medicalNum = medicalRecordNum;
            _name = new Name(strName);
            _contacts = new ContactInfo(strEmail, strPhone);
            _gender = genderAssigned;
            _birth = strBirth;
            _emergencyContact = strEmerContact;
			_auditLogs = new List<PatientAuditLog>();
			_active = true;

        }
        else
        {
            throw new ArgumentException("Invalid arguments!");
        }
    }

	public Gender ValidateAndAssignGender(string gender){

		Gender genderAssigned;

		if(gender == "Male")
			genderAssigned = Gender.Male;
		else if(gender == "Female")
			genderAssigned = Gender.Female;
		else
			throw new ArgumentException("Invalid gender!");

		return genderAssigned;
	}

	private bool IsValidParameters(string strName, string strEmail, string strPhone, string strBirth, string strEmerContact) {

		if( !Name.IsValidName(strName))
			throw new ArgumentException("Invalid Name!");
		if( !ContactInfo.IsValidEmailAddres( strEmail ) )
			throw new ArgumentException("Invalid email!");
		if( !ContactInfo.IsValidPhoneNumber( strPhone ) )
			throw new ArgumentException("Invalid phoneNumer!");
		if( !ContactInfo.IsValidPhoneNumber( strEmerContact ) )
			throw new ArgumentException("Invalid emergency contact!");
		if (!IsValidISO8601Date(strBirth))
        	throw new ArgumentException("Invalid date of birth!");
			
		return true;
	}

	public static bool IsValidISO8601Date(string dateString)
    {
        if (string.IsNullOrWhiteSpace(dateString))
            return false;

        string iso8601Format = "yyyy-MM-dd";

        return DateTime.TryParseExact(dateString, iso8601Format,
                                      CultureInfo.InvariantCulture,
                                      DateTimeStyles.None,
                                      out _);
    }


	public string GetMRN() {
		return _medicalNum;
	}

	public string GetFullName() {
		return _name.FullName;
	}

	public string GetFirstName() {
		return _name.FirstName;
	}

	public string GetLastName() {
		return _name.LastName;
	}

	public string GetEmail() {
		return _contacts.Email;
	}

	public string GetPhone() {
		return _contacts.PhoneNumber;
	}

	public Gender GetGender() {
		return _gender;
	}

	public string GetBirth() {
		return _birth;
	}

	public string GetEmerPhone() {
		return _emergencyContact;
	}

	public bool GetActive() {
		return _active;
	}

	public bool UpdateName(string fullName)
	{
		if(!Name.IsValidName(fullName)){
			return false;
		} else {
			// Divide fullName
			var names = fullName.Split(' ', StringSplitOptions.RemoveEmptyEntries);

			var firstName = "";
			var lastName = "";

			// First and Last Names
			if (names.Length > 0){
				firstName = names[0];
				lastName = names[names.Length - 1];
			}

			bool bFullName = _name.UpdateFullName(fullName);
			bool bFirstName = _name.UpdateFirstName(firstName);
			bool bLastName = _name.UpdateLastName(lastName);

			return bFullName && bFirstName && bLastName;
		}
	}

	public bool UpdateEmail(string email)
	{
		return _contacts.UpdateEmail(email);
	}

	public bool UpdatePhoneNumber(string phoneNumber)
	{
		return _contacts.UpdatePhoneNumber(phoneNumber);
	}

	public void setDateOfBirth(string birth)
	{
		if ( IsValidISO8601Date(birth) ) {
			_birth = birth;
        }
		else {
			throw new ArgumentException("Invalid arguments: " + birth);
		}

	}

	public void setEmerContact(string emerContact)
	{
		if ( ContactInfo.IsValidPhoneNumber(emerContact) )
			_emergencyContact = emerContact;
	}

	public void setAuditLogs(List<PatientAuditLog> auditLogs)
	{
		_auditLogs = auditLogs;

	}

	public void MarkAsInative()
    {
        _active = false;
    }

}