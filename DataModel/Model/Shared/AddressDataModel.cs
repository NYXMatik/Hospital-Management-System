namespace DataModel.Model
{
    using Domain.Model;

    public class AddressDataModel
    {
        public string Street { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string PostalCode { get; set; }
        public string Country { get; set; }

        public AddressDataModel(object street) {}

        public AddressDataModel(Address address)
        {
            Street = address.Street;
            City = address.City;
            State = address.State;
            PostalCode = address.PostalCode;
            Country = address.Country;
        }
        public AddressDataModel(string street, string city, string state, string postalCode, string country)
        {
            Street = street;
            City = city;
            State = state;
            PostalCode = postalCode;
            Country = country;
        }
    }
}
