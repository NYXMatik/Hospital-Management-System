public class LoginResponseDTO
{
    public string ProfileId { get; set; }
    public string FullName { get; set; }
    public string Email { get; set; }

    public LoginResponseDTO(string profileId, string fullName, string email)
    {
        ProfileId = profileId;
        FullName = fullName;
        Email = email;

    }

    public LoginResponseDTO() { }
}
