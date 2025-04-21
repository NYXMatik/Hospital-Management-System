public class GoogleUserPayload
{

    public string Email { get; set; }

    public string FullName { get; set; }


    // Constructor for initialization
    public GoogleUserPayload(string email, string fullName, string profilePicture = null, string locale = null, string givenName = null, string familyName = null)
    {
        Email = email;
        FullName = fullName;
    }
}
