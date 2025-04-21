namespace Domain.Model;

public interface IPatient
{
	public string GetMRN();
	//string GetName();
	public string GetFullName();
	public string GetFirstName();
	public string GetLastName();
	//string GetContactInfo();
	public string GetEmail();
	public string GetPhone();
	public Gender GetGender();
	public string GetBirth();
	public string GetEmerPhone();

}