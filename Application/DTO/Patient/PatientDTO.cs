namespace Application.DTO;

using Domain.Model;

public class PatientDTO
{
	public string MedicalRecordNum { get; set; }     
	public string FullName { get; set; }
	public string FirstName { get; set; }
	public string LastName { get; set; }
	public string Email { get; set; }
	public string PhoneNumber { get; set; }
	public string Gender { get; set; }
	public string Birth { get; set; }
    public string EmergencyContact { get; set; }
	
	public PatientDTO() {
	}

	public PatientDTO(string mrn, string fullName, string firstName, string lastName, string email, string phoneNumber, string gender, string birth, string emerContact)
	{
		MedicalRecordNum = mrn;
		FullName = fullName;
		FirstName = firstName;
		LastName = lastName;
		Email = email;
		PhoneNumber = phoneNumber;
		Gender = gender;
		Birth = birth; 
		EmergencyContact = emerContact;
	}

	static public PatientDTO ToDTO(Patient patient) {

		PatientDTO patientDTO = new PatientDTO(patient.GetMRN(), patient.GetFullName(), patient.GetFirstName(), patient.GetLastName(), patient.GetEmail(), patient.GetPhone(), patient.GetGender().ToString(), patient.GetBirth(), patient.GetEmerPhone());

		return patientDTO;
	}

	static public IEnumerable<PatientDTO> ToDTO(IEnumerable<Patient> patients)
	{
		List<PatientDTO> patientsDTO = new List<PatientDTO>();

		foreach( Patient patient in patients ) {
			PatientDTO patientDTO = ToDTO(patient);

			patientsDTO.Add(patientDTO);
		}

		return patientsDTO;
	}

	static public Patient ToDomain(PatientDTO patientDTO, string medicalRecordNum) {
		
		Patient patient = new Patient(medicalRecordNum, patientDTO.FullName, patientDTO.Email, patientDTO.PhoneNumber, patientDTO.Gender, patientDTO.Birth, patientDTO.EmergencyContact);

		return patient;
	}

	static public Patient UpdateToDomain(Patient patient, PatientUpdateDTO patientDTO) {
		
		if (!string.IsNullOrEmpty(patientDTO.FullName))
			patient.UpdateName(patientDTO.FullName);

		if (!string.IsNullOrEmpty(patientDTO.Email))
			patient.UpdateEmail(patientDTO.Email);
	
		if (!string.IsNullOrEmpty(patientDTO.PhoneNumber))
			patient.UpdatePhoneNumber(patientDTO.PhoneNumber);

		if (!string.IsNullOrEmpty(patientDTO.Birth))
		patient.setDateOfBirth(patientDTO.Birth);

		if (!string.IsNullOrEmpty(patientDTO.EmergencyContact))
			patient.setEmerContact(patientDTO.EmergencyContact);

		return patient;

	}
}