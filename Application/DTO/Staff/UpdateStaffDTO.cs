using Domain.Model;

public class UpdateStaffDTO
{
	public string Email { get; set; }
	public string PhoneNumber { get; set; }
	public string Specialization { get; set; }
	
	public UpdateStaffDTO() {
	}

	public UpdateStaffDTO(string email, string phoneNumber, string specialization)
	{
		Email = email;
		PhoneNumber = phoneNumber;
		Specialization = specialization;
	}

	static public UpdateStaffDTO ToDTO(Staff staff) {

		UpdateStaffDTO staffDTO = new UpdateStaffDTO(staff.GetEmail(), staff.GetPhoneNumber(), staff.GetSpecialization());

		return staffDTO;
	}
	
}