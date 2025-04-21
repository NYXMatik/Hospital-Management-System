namespace Domain.Model;

public interface IStaff 
{
	string GetID();
	string GetEmail();
	string GetFirstName();
	string GetLastName();
	string GetFullName();
	string GetPhoneNumber();
	string GetLicenseNumber();
}