namespace Application.DTO;

using Domain.Model;

public class CreateStaffDTO
{
	public string FullName { get; set; }
    public string LicenseNumber { get; set; }
	public string Email { get; set; }
	public string PhoneNumber { get; set; }
    public int RecruitmentYear { get; set; }
	public string Category { get; set; }
	public string Specialization { get; set; }
	
	public CreateStaffDTO() {
	}

	public CreateStaffDTO(string fullName, string licenseNumber, string email, string phoneNumber, int recruitmentYear, 
						string category, string specialization)
	{
		FullName = fullName;
        LicenseNumber = licenseNumber;
		Email = email;
		PhoneNumber = phoneNumber;
        RecruitmentYear = recruitmentYear;
		Category = category;
		Specialization = specialization;
	}

	static public Staff ToDomain(CreateStaffDTO staffDTO, string staffId/*, string specialization*/) {
		
        Staff staff = new Staff(staffId, staffDTO.FullName, staffDTO.LicenseNumber, 
		staffDTO.Email, staffDTO.PhoneNumber, /*specialization*/ staffDTO.Specialization);

		return staff;
	}

	
}