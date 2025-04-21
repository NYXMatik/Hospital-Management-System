namespace Domain.Model;

using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using System.Net.Mail;

public class ContactInfo : IContactInfo{
private string _email;
    public string Email
    {
        get { return _email; }
    }
    
    private string _phoneNumber;
    public string PhoneNumber
    {
        get { return _phoneNumber; }
    }


    public ContactInfo(string email, string phoneNumber)
    {
        _email = email;
        _phoneNumber = phoneNumber;
    }

    // from https://mailtrap.io/blog/validate-email-address-c/
	public static bool IsValidEmailAddres(string email)
	{
		var valid = true;

		try
		{
			var emailAddress = new MailAddress(email);
		}
		catch
		{
			valid = false;
		}

		return valid;
	}
    public void SetEmail(string email)
        {
            if (IsValidEmailAddres(email))
            {
                _email = email;
            }
            else
            {
                throw new ArgumentException("Invalid email address: " + email);
            }
        }

        // Método para establecer el número de teléfono
        public void SetPhoneNumber(string phoneNumber)
        {
            if (IsValidPhoneNumber(phoneNumber))
            {
                _phoneNumber = phoneNumber;
            }
            else
            {
                throw new ArgumentException("Invalid phone number: " + phoneNumber);
            }
        }
    public static bool IsValidPhoneNumber(string phone)
    {
        string pattern = @"^\+(\d{1,3})[\s\-]?\(?\d{1,4}\)?[\s\-]?\d{4,14}$";

        return Regex.IsMatch(phone, pattern);
    }

    
    public bool UpdateEmail(string email)
    {
        if ( IsValidEmailAddres(email) ) {
			_email = email;
            return true;
        }
		else {
			throw new ArgumentException("Invalid arguments: " + email);
		}
    }

    public bool UpdatePhoneNumber(string phoneNumber)
    {
         if ( IsValidPhoneNumber(phoneNumber) ) {
			_phoneNumber = phoneNumber;
            return true;
        }
		else {
			throw new ArgumentException("Invalid arguments: " + phoneNumber);
		}
        
    }
}
