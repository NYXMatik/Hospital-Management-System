namespace Domain.Model;

using System.ComponentModel.DataAnnotations;

public class Staff : IStaff
{

	[Key]
	private string _id;
	public string Id
	{
		get { return _id; }
	}

	private string _licenseNumber;
	public string LicenseNumber
	{
		get { return _licenseNumber; }
	}

    private Name _name;
	public Name Name
	{
		get { return _name; }
	}

    private ContactInfo _contact;
	public ContactInfo Contact
	{
		get { return _contact; }
	}

	private string _specialization;
	public string Specialization
	{
		get { return _specialization; }
	}

	public bool _active;
	public bool Active
	{
		get { return _active; }
	}

	private List<StaffAuditLog> _auditLogs;
	public List<StaffAuditLog> AuditLogs
    {
        get { return _auditLogs; }
    } 

	private Staff() {}

    public Staff(string staffId, string fullName, string licenseNumber, string email, string phoneNumber, string specialization) {
		
		if (IsValidParameters(staffId, fullName, licenseNumber, email, phoneNumber, specialization)) 
        {
            _id = staffId;
			_name = new Name(fullName);
			_licenseNumber = licenseNumber;
            _contact = new ContactInfo(email, phoneNumber);
			_specialization = specialization; 
			_active = true;
			_auditLogs = new List<StaffAuditLog>();
        }
        else 
        {
            throw new ArgumentException("Invalid arguments!");
        }
	}

	private bool IsValidParameters(string id, string name, string licenseNumber, string email, string phoneNumber, string specialization) {

		if( !Name.IsValidName(name))
			return false;

		if( !ContactInfo.IsValidEmailAddres( email ) )
			return false;

		if( !ContactInfo.IsValidPhoneNumber( phoneNumber ) )
			return false;

		if( string.IsNullOrEmpty( licenseNumber ) )
			return false;

		if ( string.IsNullOrEmpty( id ) )
        	return false;
		
		if ( !IsSpecializationValid(id, specialization) )
        	return false;
		
		return true;
	}

	public string GetID()
	{
		return _id;
	}

	public string GetFirstName() {
		return _name.FirstName;
	}

	public string GetLastName() {
		return _name.LastName;
	}

	public string GetFullName() {
		return _name.FullName;
	}

	public string GetEmail()
	{
		return _contact.Email;
	}

	public string GetPhoneNumber()
	{
		return _contact.PhoneNumber;
	}

    public string GetLicenseNumber()
	{
		return _licenseNumber;
	}

	public string GetSpecialization()
	{
		return _specialization;
	}
	public bool GetActive() {
		return _active;
	}
	public List<StaffAuditLog> GetAuditLogs() {
		return _auditLogs;
	}

	// soft delete
	public void MarkAsInactive()
    {
        _active = false;
    }

	public bool UpdateEmail(string email)
	{
		return _contact.UpdateEmail(email);
	}

	public bool UpdatePhoneNumber(string phoneNumber)
	{
		return _contact.UpdatePhoneNumber(phoneNumber); 
	}

	public bool UpdateSpecialization(string id, string specialization)
	{
		if ( IsSpecializationValid(id, specialization) ) {
			_specialization = specialization;
            return true;
        }
		else {
			throw new ArgumentException("Invalid arguments: " + specialization);
		} 
	}

	public bool UpdateAuditList(List<StaffAuditLog> auditLogs)
	{
		if(auditLogs != null){
			_auditLogs = auditLogs;
			return true;
		}
		
		return false;
	}

	public void UpdateAuditLogs(List<StaffAuditLog> auditLogs)
	{
		_auditLogs = auditLogs;

	}


	// Specializations Available
    private static readonly List<string> AvailableSpecializations = new List<string>
    {
        "Cardiology",
        "Neurology",
        "Pediatrics",
        "Orthopedics",
        "Dermatology",
        "Gastroenterology",
        "Psychiatry"
    };

    private bool IsSpecializationValid(string id, string specialization)
	{
		return !string.IsNullOrEmpty(specialization) && AvailableSpecializations.Contains(specialization);
	}


}