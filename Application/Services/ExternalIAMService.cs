using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Domain.Model;

public class ExternalIAMService : IExternalIAMService
{
    private readonly HttpClient _httpClient;
    private readonly string _iamBaseUrl;

    public ExternalIAMService(HttpClient httpClient, string iamBaseUrl)
    {
        _httpClient = httpClient;
        _iamBaseUrl = iamBaseUrl;
    }

    public async Task<RegistrationResult> RegisterUser(Patient patient)
    {
        try
        {
            var response = await _httpClient.PostAsJsonAsync($"{_iamBaseUrl}/register", patient);

            if (response.IsSuccessStatusCode)
            {
                return new RegistrationResult(true);
            }
            else
            {
                var errorMessage = await response.Content.ReadAsStringAsync();
                return new RegistrationResult(false, errorMessage);
            }
        }
        catch (HttpRequestException ex)
        {
            return new RegistrationResult(false, ex.Message);
        }
    }

    public async Task<bool> VerifyUserEmail(string email)
    {
        try
        {
            var response = await _httpClient.GetAsync($"{_iamBaseUrl}/verify-email?email={email}");

            return response.IsSuccessStatusCode;
        }
        catch (HttpRequestException)
        {
            return false;
        }
    }
}

public interface IExternalIAMService
{
    Task<RegistrationResult> RegisterUser(Patient patient);
    Task<bool> VerifyUserEmail(string email);
}
