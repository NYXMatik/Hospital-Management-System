namespace DataModel.Model;

using Domain.Model;

public class ContactInfoDataModel
{
    public string Email {get;set;}
    public string PhoneNumber {get;set;}

    public ContactInfoDataModel() {}
    
    public ContactInfoDataModel(ContactInfo info)
    {
        Email = info.Email;
        PhoneNumber = info.PhoneNumber;
    }
    public ContactInfoDataModel(string email, string phoneNumber)
        {
            Email = email;
            PhoneNumber = phoneNumber;
        }
}