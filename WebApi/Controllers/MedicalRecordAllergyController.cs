using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;

[ApiController]
[Route("api/[controller]")]
public class MedicalRecordAllergyController : ControllerBase
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<MedicalRecordAllergyController> _logger;

    public MedicalRecordAllergyController(HttpClient httpClient, ILogger<MedicalRecordAllergyController> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    [HttpPatch("allergies")]
    public async Task<IActionResult> AddAllergyToMedicalRecord([FromQuery] string userId, [FromBody] AllergiesDto allergiesDto)
    {
        try
        {
            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest("UserId is required");
            }

            if (allergiesDto?.Allergies == null)
            {
                return BadRequest("Allergies list is required");
            }

            _logger.LogInformation($"Received request - UserId: {userId}, Allergies: {JsonSerializer.Serialize(allergiesDto)}");

            var nodeEndpoint = $"http://localhost:4020/api/medical-records/allergies?userId={userId}";
            var request = new HttpRequestMessage(HttpMethod.Patch, nodeEndpoint)
            {
                Content = new StringContent(
                    JsonSerializer.Serialize(new { allergies = allergiesDto.Allergies }),
                    System.Text.Encoding.UTF8,
                    "application/json"
                )
            };

            request.Headers.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));

            _logger.LogInformation($"Sending to Node backend: {await request.Content.ReadAsStringAsync()}");

            var response = await _httpClient.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                var responseContent = await response.Content.ReadAsStringAsync();
                return Ok(JsonSerializer.Deserialize<object>(responseContent));
            }

            var errorContent = await response.Content.ReadAsStringAsync();
            _logger.LogError($"Node backend returned {response.StatusCode}: {errorContent}");
            return StatusCode((int)response.StatusCode, errorContent);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error processing request: {ex}");
            return StatusCode(500, ex.Message);
        }
    }

    [HttpPut("allergies")]
    public async Task<IActionResult> UpdateAllergyInMedicalRecord([FromQuery] string userId, [FromBody] Allergy allergy)
    {
        Console.WriteLine("UpdateAllergyInMedicalRecord");
        try
        {
            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest("UserId is required");
            }

            if (allergy == null)
            {
                return BadRequest("Allergy data is required");
            }

            _logger.LogInformation($"Received request - UserId: {userId}, Allergy: {JsonSerializer.Serialize(allergy)}");

            var nodeEndpoint = $"http://localhost:4020/api/medical-records/allergies?userId={userId}";
            var request = new HttpRequestMessage(HttpMethod.Put, nodeEndpoint)
            {
                Content = new StringContent(
                    JsonSerializer.Serialize(allergy),
                    System.Text.Encoding.UTF8,
                    "application/json"
                )
            };

            request.Headers.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));

            _logger.LogInformation($"Sending to Node backend: {await request.Content.ReadAsStringAsync()}");

            var response = await _httpClient.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                var responseContent = await response.Content.ReadAsStringAsync();
                return Ok(JsonSerializer.Deserialize<object>(responseContent));
            }

            var errorContent = await response.Content.ReadAsStringAsync();
            _logger.LogError($"Node backend returned {response.StatusCode}: {errorContent}");
            return StatusCode((int)response.StatusCode, errorContent);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error processing request: {ex}");
            return StatusCode(500, ex.Message);
        }
    }

    public class AllergiesDto
    {
        public List<string> Allergies { get; set; } = new List<string>();
    }

    public class Allergy
    {
        public string Code { get; set; }
        public string Designation { get; set; }
        public string Description { get; set; }
    }
}