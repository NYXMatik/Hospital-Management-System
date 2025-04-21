using Application.DTO;
using Domain.Model;

public class PatientAccountDTO
{
    public string ProfileId { get; set; }
    public string FullName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public string BirthDate { get; set; }
    public bool IsEmailVerified { get; set; }
    public Address Address { get; set; }  
    public bool Active { get; set; }

    public PatientAccountDTO(string profileId, string fullName, string email, string phone, string birthDate, bool isEmailVerified, Address address, bool active)
    {
        ProfileId = profileId;
        FullName = fullName;
        Email = email;
        Phone = phone;
        BirthDate = birthDate;
        IsEmailVerified = isEmailVerified;
        Address = address;
        Active = active;
    }

    public PatientAccountDTO() { }
    static public PatientAccount UpdateToDomain(PatientAccount patient,PatientAccountUpdateDTO patientDTO){
        if (!string.IsNullOrEmpty(patientDTO.FullName))
            patient.UpdateName(patientDTO.FullName);

        if (!string.IsNullOrEmpty(patientDTO.Email))
            patient.UpdateEmail(patientDTO.Email);

        if (!string.IsNullOrEmpty(patientDTO.Phone))
            patient.UpdatePhoneNumber(patientDTO.Phone);

        if (!string.IsNullOrEmpty(patientDTO.Street))
            patient.UpdateStreet(patientDTO.Street);

        if (!string.IsNullOrEmpty(patientDTO.City))
            patient.UpdateCity(patientDTO.City);

        if (!string.IsNullOrEmpty(patientDTO.State))
            patient.UpdateState(patientDTO.State);

        if (!string.IsNullOrEmpty(patientDTO.PostalCode))
            patient.UpdatePostalCode(patientDTO.PostalCode);

        if (!string.IsNullOrEmpty(patientDTO.Country))
            patient.UpdateCountry(patientDTO.Country);

        if (!string.IsNullOrEmpty(patientDTO.BirthDate))
            patient.UpdateBirthDate(patientDTO.BirthDate);

        return patient;
    }
    static public PatientAccountDTO ToDTO(PatientAccount patient) {
         Address ad = new Address(
        patient.GetStreet(),
        patient.GetCity(),
        patient.GetState(),
        patient.GetPostalCode(),
        patient.GetCountry()
    );
		PatientAccountDTO patientDTO = new PatientAccountDTO(patient.GetProfileId(),patient.GetFullName(),patient.GetEmail(),patient.GetPhoneNumber(),patient.GetBirthDate(),patient.GetIsEmailVerified(),ad,patient.GetIsActive());

		return patientDTO;
	}
}
