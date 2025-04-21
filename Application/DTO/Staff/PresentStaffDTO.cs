namespace Application.DTO;

using Domain.Model;

public class PresentStaffDTO
{
	public string Id { get; set; }
	public string FullName { get; set; }
	public string FirstName { get; set; }
	public string LastName { get; set; }
    public string LicenseNumber { get; set; }
	public string Email { get; set; }
	public string PhoneNumber { get; set; }
	public string Specialization { get; set; }
	
	public PresentStaffDTO() {
	}

	public PresentStaffDTO(string id, string fullName, string firstName, string lastName, string licenseNumber, string email, string phoneNumber, string specialization)
	{
		Id = id;
		FullName = fullName;
		FirstName = firstName;
		LastName = lastName;
        LicenseNumber = licenseNumber;
		Email = email;
		PhoneNumber = phoneNumber;
		Specialization = specialization;
	}

	static public PresentStaffDTO ToDTO(Staff staff) {

		PresentStaffDTO staffDTO = new PresentStaffDTO(staff.GetID(), staff.GetFullName(), staff.GetFirstName(), staff.GetLastName(), 
								staff.GetLicenseNumber(), staff.GetEmail(), staff.GetPhoneNumber(), staff.GetSpecialization());

		return staffDTO;
	}

	static public IEnumerable<PresentStaffDTO> ToDTO(IEnumerable<Staff> staffs)
	{
		List<PresentStaffDTO> staffsDTO = new List<PresentStaffDTO>();

		foreach( Staff staff in staffs ) {
			PresentStaffDTO staffDTO = ToDTO(staff);

			staffsDTO.Add(staffDTO);
		}

		return staffsDTO;
	}

	static public Staff UpdateToDomain(Staff staff, UpdateStaffDTO staffDTO, string id, List<StaffAuditLog> auditLogs) {
		
		if (!string.IsNullOrEmpty(staffDTO.Email))
			staff.UpdateEmail(staffDTO.Email);
	
		if (!string.IsNullOrEmpty(staffDTO.PhoneNumber))
			staff.UpdatePhoneNumber(staffDTO.PhoneNumber);

		if (!string.IsNullOrEmpty(staffDTO.Specialization))
			staff.UpdateSpecialization(id, staffDTO.Specialization);

		//staff.UpdateAuditList(auditLogs);

		return staff;

	}
	
}