public class PatientAccountCreateDTO
{
    public string FullName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public string BirthDate { get; set; }
    public Address Address { get; set; }

    public PatientAccountCreateDTO(string fullName, string email, string phone, string birthDate, Address address)
    {
        FullName = fullName;
        Email = email;
        Phone = phone;
        BirthDate = birthDate;
        Address = address;
    }

    public PatientAccountCreateDTO() { }
}
