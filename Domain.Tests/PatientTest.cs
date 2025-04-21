namespace Domain.Tests;

using Domain.Model;

public class PatientTest
{
    [Theory]
    [InlineData("19891201000001", "Catarina Moreira", "catarinamoreira@email.pt", "+351 987654321", "Male", "1989-12-01", "+32 273382")]
    [InlineData("19891201000002", "Joana Oliveira Pereira", "joana@email.pt", "+351 123456789", "Female", "1989-12-01", "+36 12342348769346")]
    public void WhenPassingCorrectData_ThenPatientIsInstantiated(string medicalRecordNum, string strName, string strEmail, string strPhone, string gender, string strBirth, string strEmerContact)
    {
        new Patient(medicalRecordNum, strName, strEmail, strPhone, gender, strBirth, strEmerContact);
    
    }

    
    [Theory]
    [InlineData("19891201000001", "", "catarinamoreira@email.pt", "+351 987654321", "Male", "1989-12-01", "+32 273382")]
    [InlineData("19891201000002", "Joana3Oliveira732a", "joana@email.pt", "+351 123456789", "Female", "1989-12-01", "+36 12342348769346")]
    [InlineData("19891201000001", null, "catarinamoreira@email.pt", "+351 987654321", "Male", "1989-12-01", "+32 273382")]
    [InlineData("19891201000002", "       \r\n \t ", "joana@email.pt", "+351 123456789", "Female", "1989-12-01", "+36 12342348769346")]
    public void WhenPassingInvalidName_ThenThrowsException(string medicalRecordNum, string strName, string strEmail, string strPhone, string gender, string strBirth, string strEmerContact)
    {
        // arrange

        // assert
        Assert.Throws<ArgumentException>(() =>
        
            // act
            new Patient(medicalRecordNum, strName, strEmail, strPhone, gender, strBirth, strEmerContact)
        );
    }


    [Theory]
    [InlineData("19891201000001", "Catarina Moreira", "", "+351 987654321", "Male", "1989-12-01", "+32 273382")]
    [InlineData("19891201000002", "Catarina Moreira", "joanaemail.pt", "+351 123456789", "Female", "1989-12-01", "+36 12342348769346")]
    [InlineData("19891201000002", "Catarina Moreira", null, "+351 123456789", "Female", "1989-12-01", "+36 12342348769346")]

    public void WhenPassingInvalidEmail_ThenThrowsException(string medicalRecordNum, string strName, string strEmail, string strPhone, string gender, string strBirth, string strEmerContact)
    {
        // assert
        Assert.Throws<ArgumentException>(() =>
        
            // act
            new Patient(medicalRecordNum, strName, strEmail, strPhone, gender, strBirth, strEmerContact)
        );
    }

    [Theory]
    [InlineData("19891201000001", "Catarina Moreira", "catareinamoreira@gmail.com", "+351987654321", "Male", "1989-12-01", "+32 273382")]
    [InlineData("19891201000002", "Catarina Moreira", "joana@gmail.pt", "+351 123456789", "Female", "1989-12-01", "36 12342348769346")]
    [InlineData("19891201000001", "Catarina Moreira", "catarinamoreira@email.pt", "+35167 987654321", "Male", "1989-12-01", "+32 273382")]
    [InlineData("19891201000002", "Catarina Moreira", "joana@gmail.pt", "+351 12", "Female", "1989-12-01", "+36 12342346788769346")]

    public void WhenPassingInvalidPhone_ThenThrowsException(string medicalRecordNum, string strName, string strEmail, string strPhone, string gender, string strBirth, string strEmerContact)
    {
        // assert
        Assert.Throws<ArgumentException>(() =>
        
            // act
            new Patient(medicalRecordNum, strName, strEmail, strPhone, gender, strBirth, strEmerContact)
        );
    }

    [Theory]
    [InlineData("19891201000001", "Catarina Moreira", "catareinamoreira@gmail.com", "+351 987654321", "Male", "1989/12/01", "+32 273382")]
    [InlineData("19891201000002", "Catarina Moreira", "joana@gmail.pt", "+351 123456789", "Female", "01-12-1989", "+36 123423")]
    [InlineData("19891201000001", "Catarina Moreira", "catarinamoreira@email.pt", "+351 987654321", "Female", "", "+32 273382")]
    [InlineData("19891201000002", "Catarina Moreira", "joana@gmail.pt", "+351 12787998", "Female", null, "+36 123426")]

    public void WhenPassingInvalidBirth_ThenThrowsException(string medicalRecordNum, string strName, string strEmail, string strPhone, string gender, string strBirth, string strEmerContact)
    {
        // assert
        var ex = Assert.Throws<ArgumentException>(() =>
        
            // act
            new Patient(medicalRecordNum, strName, strEmail, strPhone, gender, strBirth, strEmerContact)
        );
    }

    [Theory]
    [InlineData("19891201000001", "Catarina Moreira", "catareinamoreira@gmail.com", "+351 987654321", "Male", "1989/12/01", "+32 273382")]
    [InlineData("19891201000002", "Catarina Moreira", "joana@gmail.pt", "+351 123456789", "Female", "1989/12/01", "+36 123423")]
    [InlineData("19891201000001", "Catarina Moreira", "catarinamoreira@email.pt", "+351 987654321", "malefemale", "1989/12/01", "+32 273382")]
    [InlineData("19891201000002", "Catarina Moreira", "joana@gmail.pt", "+351 12787998", null, "1989/12/01", "+36 123426")]

    public void WhenPassingInvalidGender_ThenThrowsException(string medicalRecordNum, string strName, string strEmail, string strPhone, string gender, string strBirth, string strEmerContact)
    {
        // assert
        var ex = Assert.Throws<ArgumentException>(() =>
        
            // act
            new Patient(medicalRecordNum, strName, strEmail, strPhone, gender, strBirth, strEmerContact)
        );
    }
 

    [Fact]
    public void WhenPassingName_ShouldGetAttributes()
    {
        // assert
        var patient = new Patient("19891201000001", "Catarina Moreira", "catarinamoreira@email.pt", "+351 987654321", "Male", "1989-12-01", "+32 273382");

        // act
        string GetFullName = patient.GetFullName();
        string GetFirstName = patient.GetFirstName();
        string GetLastName = patient.GetLastName();
        Name Name = patient.Name;

        string GetEmail = patient.GetEmail();
        string GetPhone = patient.GetPhone();
        ContactInfo ContactInfo = patient.ContactInfo;

        string GetGender = patient.GetGender().ToString();
        Gender Gender = patient.Gender;

        string GetBirth = patient.GetBirth();
        string Birth = patient.DateOfBirth;

        string GetEmerPhone = patient.GetEmerPhone();
        string EmerContact = patient.EmergencyContact;

        //assert
        Assert.Equal("Catarina Moreira", GetFullName);
        Assert.Equal("Catarina", GetFirstName);
        Assert.Equal("Moreira", GetLastName);

        Assert.Equal("Catarina Moreira", Name.FullName);
        Assert.Equal("Catarina", Name.FirstName);
        Assert.Equal("Moreira", Name.LastName);

        Assert.Equal("catarinamoreira@email.pt", GetEmail);
        Assert.Equal("+351 987654321", GetPhone);
        Assert.Equal("catarinamoreira@email.pt", ContactInfo.Email);
        Assert.Equal("+351 987654321", ContactInfo.PhoneNumber);

        Assert.Equal("Male", GetGender);

        Assert.Equal("1989-12-01", GetBirth);
        Assert.Equal("1989-12-01", Birth);

        Assert.Equal("+32 273382", GetEmerPhone);
        Assert.Equal("+32 273382", EmerContact);
    }
}