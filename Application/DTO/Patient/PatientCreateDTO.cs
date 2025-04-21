namespace Application.DTO;

using Domain.Model;

public class PatientCreateDTO
{
    
	public string FullName { get; set; }
	public string Email { get; set; }
	public string PhoneNumber { get; set; }
	public string Gender { get; set; }
	public string Birth { get; set; }
    public string EmergencyContact { get; set; }
	public PatientCreateDTO() {
	}

	public PatientCreateDTO(string fullName, string email, string phoneNumber, string gender, string birth, string emerContact)
	{
		FullName = fullName;
		Email = email;
		PhoneNumber = phoneNumber;
		Gender = gender;
		Birth = birth;
		EmergencyContact = emerContact;
	}

	/*static public PatientCreateDTO ToDTO(Patient patient) {

		PatientCreateDTO patientDTO = new PatientCreateDTO(patient.GetFullName(), patient.GetEmail(), patient.GetPhone(), patient.GetGender().ToString(), patient.GetBirth(), patient.GetEmerPhone());

		return patientDTO;
	}*/

	static public Patient ToDomain(PatientCreateDTO patientDTO, string medicalRecordNum) {
		
		Patient patient = new Patient(medicalRecordNum, patientDTO.FullName, patientDTO.Email, patientDTO.PhoneNumber, patientDTO.Gender, patientDTO.Birth, patientDTO.EmergencyContact);

		return patient;
	}

}