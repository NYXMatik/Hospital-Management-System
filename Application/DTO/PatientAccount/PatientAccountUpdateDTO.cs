namespace Application.DTO
{
    public class PatientAccountUpdateDTO
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }

        public string Street { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string PostalCode { get; set; }
        public string Country { get; set; }
        public string BirthDate { get; set; }

        public PatientAccountUpdateDTO(
            string fullName, 
            string email, 
            string phone, 
            string street, 
            string city, 
            string state, 
            string postalCode, 
            string country, 
            string birthDate)
        {
            FullName = fullName;
            Email = email;
            Phone = phone;
            Street = street;
            City = city;
            State = state;
            PostalCode = postalCode;
            Country = country;
            BirthDate = birthDate;
        }

        // Constructor por defecto
        public PatientAccountUpdateDTO() { }
    }
}
