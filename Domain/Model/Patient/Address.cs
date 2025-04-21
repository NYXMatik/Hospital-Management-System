public class Address
{
    public string Street { get; set; }
    public string City { get; set; }
    public string State { get; set; }
    public string PostalCode { get; set; }
    public string Country { get; set; }

    public Address() { }

    public Address(string street, string city, string state, string postalCode, string country)
    {
        Street = street;
        City = city;
        State = state;
        PostalCode = postalCode;
        Country = country;
    }

   
    public bool IsValidAddress()
    {
        return !string.IsNullOrEmpty(Street) && 
               !string.IsNullOrEmpty(City) && 
               !string.IsNullOrEmpty(Country);
    }
    public bool SetStreet(string street)
    {
        if (!string.IsNullOrEmpty(street))
        {
            Street = street;
            return true;
        }
        return false;
    }

    public bool SetCity(string city)
    {
        if (!string.IsNullOrEmpty(city))
        {
            City = city;
            return true;
        }
        return false;
    }

    public bool SetState(string state)
    {
        if (!string.IsNullOrEmpty(state))
        {
            City = state;
            return true;
        }
        return false;
    }

    public bool SetPostalCode(string postalCode)
    {
        if (!string.IsNullOrEmpty(postalCode))
        {
            PostalCode = postalCode;
            return true;
        }
        return false;
    }

    public bool SetCountry(string country)
    {
        if (!string.IsNullOrEmpty(country))
        {
            Country = country;
            return true;
        }
        return false;
    }
}
