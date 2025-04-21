public class RegistrationResult
{
    public bool Success { get; set; }
    public string ErrorMessage { get; set; }

    public RegistrationResult(bool success, string errorMessage = null)
    {
        Success = success;
        ErrorMessage = errorMessage;
    }
}
