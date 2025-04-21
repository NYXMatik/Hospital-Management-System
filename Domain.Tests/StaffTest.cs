namespace Domain.Tests;

using Domain.Model;

public class StaffTest
{
    [Theory]
    [InlineData("D2020000001", "Marta Silva", "12345", "martasilva@gmail.pt", "+351 929952439", "Cardiology")]
    [InlineData("N2015000001", "João Neves", "98765", "joaoneves@gmail.pt", "+351 123456789", "Dermatology")]
    public void WhenPassingCorrectData_ThenStaffIsInstantiated(string id, string FullName, string licenseNumber, string email, string phoneNumber, string specialization)
    {
        new Staff(id, FullName, licenseNumber, email, phoneNumber, specialization);
    
    }

    
    [Theory]
    [InlineData("D202000001", "", "12345", "martasilva@gmail.pt", "+351 929952439", "Cardiology")]
    [InlineData("N2015000001", "João 8Neves", "98765", "joaoneves@gmail.pt", "+351 123456789", "Dermatology")]
    [InlineData("D201700001", null, "45623", "joanapaiva@email.pt", "+351 987654321", "Pediatrics")]
    [InlineData("N201900009", "       \r\n \t ", "98714","janegrace@email.pt", "+36 12342348769346", "Psychiatry")]
    public void WhenPassingInvalidName_ThenThrowsException(string id, string FullName, string licenseNumber, string email, string phoneNumber, string specialization)
    {
        // arrange

        // assert
        Assert.Throws<ArgumentException>(() =>
        
            // act
            new Staff(id, FullName, licenseNumber, email, phoneNumber, specialization)
        );
    }


    [Theory]
    [InlineData("D202000001", "Marta Silva", "12345", "", "+351 929952439", "Cardiology")]
    [InlineData("N2015000001", "João Neves", "98765", "joaonevesgmail.pt", "+351 123456789", "Dermatology")]
    [InlineData("D201700001", "Joana Paiva Neves", "45623", "null", "+351 987654321", "Pediatrics")]
    public void WhenPassingInvalidEmail_ThenThrowsException(string id, string FullName, string licenseNumber, string email, string phoneNumber, string specialization)
    {
        // assert
        Assert.Throws<ArgumentException>(() =>
        
            // act
            new Staff(id, FullName, licenseNumber, email, phoneNumber, specialization)
        );
    }

    [Theory]
    [InlineData("D202000001", "Marta Silva", "12345", "martasilva@gmail.pt", "+351929952439", "Cardiology")]
    [InlineData("N2015000001", "João Neves", "98765", "joaoneves@gmail.pt", "123456789", "Dermatology")]
    [InlineData("D201700001", "Joana Paiva Neves", "45623", "joanapaiva@email.pt", "+36 123423467887643578769346", "Pediatrics")]
    [InlineData("N201900009", "Jane Grace", "98714","janegrace@email.pt", "++351 12", "Psychiatry")]
    public void WhenPassingInvalidPhone_ThenThrowsException(string id, string FullName, string licenseNumber, string email, string phoneNumber, string specialization)
    {
        // assert
        Assert.Throws<ArgumentException>(() =>
        
            // act
            new Staff(id, FullName, licenseNumber, email, phoneNumber, specialization)
        );
    }

    [Theory]
    [InlineData("D202000001", "Marta Silva", "", "martasilva@gmail.pt", "+351 929952439", "Cardiology")]
    [InlineData("D201700001", "Joana Paiva Neves", null, "janegrace@email.pt", "+351 987654321", "Pediatrics")]

    public void WhenPassingInvalidLicenseNumber_ThenThrowsException(string id, string FullName, string licenseNumber, string email, string phoneNumber, string specialization)
    {
        // assert
        var ex = Assert.Throws<ArgumentException>(() =>
        
            // act
            new Staff(id, FullName, licenseNumber, email, phoneNumber, specialization)
        );
    }

    [Theory]
    [InlineData("D202000001", "Marta Silva", "12345", "martasilva@gmail.pt", "+351 929952439", "")]
    [InlineData("N2015000001", "João Neves", "98765", "joaonevesgmail.pt", "+351 123456789", "Tecnician")]
    [InlineData("D201700001", "Joana Paiva Neves", "98714", "janegrace@email.pt", "+351 987654321", null)]

    public void WhenPassingInvalidSpecialization_ThenThrowsException(string id, string FullName, string licenseNumber, string email, string phoneNumber, string specialization)
    {
        // assert
        var ex = Assert.Throws<ArgumentException>(() =>
        
            // act
            new Staff(id, FullName, licenseNumber, email, phoneNumber, specialization)
        );
    }
 

    [Fact]
    public void WhenPassingName_ShouldGetAttributes()
    {
        // assert
        var staff = new Staff("D202000001", "Marta Silva", "12345", "martasilva@gmail.pt", "+351 929952439", "Cardiology");

        // act
        string GetFullName = staff.GetFullName();
        string GetFirstName = staff.GetFirstName();
        string GetLastName = staff.GetLastName();
        Name Name = staff.Name;

        string GetEmail = staff.GetEmail();
        string GetPhone = staff.GetPhoneNumber();
        ContactInfo ContactInfo = staff.Contact;

        string GetLicenseNumber = staff.GetLicenseNumber();

        string GetSpecialization = staff.GetSpecialization();

        //assert
        Assert.Equal("Marta Silva", GetFullName);
        Assert.Equal("Marta", GetFirstName);
        Assert.Equal("Silva", GetLastName);

        Assert.Equal("Marta Silva", Name.FullName);
        Assert.Equal("Marta", Name.FirstName);
        Assert.Equal("Silva", Name.LastName);

        Assert.Equal("martasilva@gmail.pt", GetEmail);
        Assert.Equal("+351 929952439", GetPhone);
        Assert.Equal("martasilva@gmail.pt", ContactInfo.Email);
        Assert.Equal("+351 929952439", ContactInfo.PhoneNumber);

        Assert.Equal("12345", GetLicenseNumber);

        Assert.Equal("Cardiology", GetSpecialization);
    }
}