namespace Application.DTO;

using Domain.Model;

public class PatientUpdateDTO
{
    
	public string FullName { get; set; }
	public string Email { get; set; }
	public string PhoneNumber { get; set; }
	public string Birth { get; set; }
    public string EmergencyContact { get; set; }
	public PatientUpdateDTO() {
	}

	public PatientUpdateDTO(string fullName, string email, string phoneNumber, string birth, string emerContact)
	{
		FullName = fullName;
		Email = email;
		PhoneNumber = phoneNumber;
		Birth = birth;
		EmergencyContact = emerContact;
	}

	static public PatientUpdateDTO ToDTO(Patient patient) {

		PatientUpdateDTO patientDTO = new PatientUpdateDTO(patient.GetFullName(), patient.GetEmail(), patient.GetPhone(), patient.GetBirth(), patient.GetEmerPhone());

		return patientDTO;
	}

	static public Patient ToDomain(PatientCreateDTO patientDTO, string medicalRecordNum, string gender) {
		
		Patient patient = new Patient(medicalRecordNum, patientDTO.FullName, patientDTO.Email, patientDTO.PhoneNumber, gender, patientDTO.Birth, patientDTO.EmergencyContact);

		return patient;
	}

}