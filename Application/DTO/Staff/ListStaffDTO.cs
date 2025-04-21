namespace Application.DTO;

using Domain.Model;

public class ListStaffDTO
{
	public string Id { get; set; }
	public string FullName { get; set; }
	public string Email { get; set; }
	public string Specialization { get; set; }
	
	public ListStaffDTO() {
	}

	public ListStaffDTO(string id, string fullName, string email, string specialization)
	{
		Id = id;
		FullName = fullName;
		Email = email;
		Specialization = specialization;
	}

	static public ListStaffDTO ToDTO(Staff staff) {

		ListStaffDTO staffDTO = new ListStaffDTO(staff.GetID(), staff.GetFullName(), 
			staff.GetEmail(), staff.GetSpecialization());

		return staffDTO;
	}

	static public IEnumerable<ListStaffDTO> ToDTO(IEnumerable<Staff> staffs)
	{
		List<ListStaffDTO> staffsDTO = new List<ListStaffDTO>();

		foreach( Staff staff in staffs ) {
			ListStaffDTO staffDTO = ToDTO(staff);

			staffsDTO.Add(staffDTO);
		}

		return staffsDTO;
	}
	
}