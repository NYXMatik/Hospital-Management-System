namespace Application.DTO;

using Domain.Model;

public class PatientInformationDTO
{
    
	public string FullName { get; set; }
	public string Email { get; set; }
	public string Birth { get; set; }
	public PatientInformationDTO() {
	}

	public PatientInformationDTO(string fullName, string email, string birth)
	{
		FullName = fullName;
		Email = email;
		Birth = birth;
	}

	static public PatientInformationDTO ToDTO(Patient patient) {

		PatientInformationDTO patientDTO = new PatientInformationDTO(patient.GetFullName(), patient.GetEmail(), patient.GetBirth());

		return patientDTO;
	}

}