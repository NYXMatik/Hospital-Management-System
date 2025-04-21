using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc.Formatters;

public class MedicalRecordController : ControllerBase
{
    private readonly HttpClient _httpClient;

    public MedicalRecordController(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    

    // GET Endpoint to get all medical records

    [HttpGet("api/medical-records")]
    public async Task<IActionResult> GetAllMedicalRecords()
    {
        try 
        {
            var url = "http://localhost:4020/api/medical-records";
            var response = await _httpClient.GetAsync(url);
            var responseContent = await response.Content.ReadAsStringAsync();
            
            Console.WriteLine($"Raw Node.js Response: {responseContent}");

            if (response.IsSuccessStatusCode)
            {
                var apiResponse = JsonSerializer.Deserialize<NodeApiResponse<List<MedicalRecordResponse>>>(
                    responseContent,
                    new JsonSerializerOptions 
                    { 
                        PropertyNameCaseInsensitive = true
                    }
                );

                if (apiResponse?._value == null)
                {
                    return BadRequest("Failed to deserialize medical records");
                }

                var frontendRecords = apiResponse._value.Select(r => new
                {
                    UserId = r.userId,
                    MedicalConditions = r.medicalConditions?.Select(mc => new MedicalConditionDTO
                    {
                        code = mc.medicalConditionId,
                        designation = mc.name,
                        description = mc.description,
                        commonSymptoms = mc.commonSymptoms
                    }).ToList() ?? new List<MedicalConditionDTO>(),
                    Allergies = r.allergies ?? new List<AllergyDTO>(),
                    freeTexts = r.freeTexts
                }).ToList();

                Console.WriteLine($"Frontend records: {JsonSerializer.Serialize(frontendRecords)}");

                return Ok(frontendRecords);
            }
            
            return StatusCode((int)response.StatusCode, responseContent);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error in GetAllMedicalRecords: {ex.Message}");
            return StatusCode(500, "Internal server error while processing medical records");
        }
    }

    // GET Endpoint to get a medical record by ID
    [HttpGet("api/medical-records/{id}")]
    public async Task<IActionResult> GetMedicalRecordById(string id)
    {
        var url = $"http://localhost:4020/api/medical-records/user/{id}";
        var response = await _httpClient.GetAsync(url);
        var responseContent = await response.Content.ReadAsStringAsync();
        
        Console.WriteLine($"Raw Response: {responseContent}");

        if (response.IsSuccessStatusCode)
        {
            try 
            {
                JsonDocument document = JsonDocument.Parse(responseContent);
                return Ok(document.RootElement);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Deserialization error: {ex.Message}");
                return StatusCode(500, "Error processing medical record data");
            }
        }
        
        return StatusCode((int)response.StatusCode, "Error retrieving medical record");
    }

    // POST Endpoint to create a new medical record
    public class MedicalRecord
    {
        public string UserId { get; set; }
        public List<string> MedicalConditions { get; set; }
        public List<string> Allergies { get; set; }

        public string freeTexts { get; set; }
    }

    [HttpPost("api/medical-records")]
    public async Task<IActionResult> CreateMedicalRecord([FromBody] MedicalRecord record)
    {
        try
        {
            if (record == null)
                return BadRequest("Medical record cannot be null");

            Console.WriteLine("Medical record received:"+ record);

            // Filter out empty strings
            record.MedicalConditions = record.MedicalConditions?
                .Where(c => !string.IsNullOrWhiteSpace(c))
                .ToList() ?? new List<string>();

            record.Allergies = record.Allergies?
                .Where(a => !string.IsNullOrWhiteSpace(a))
                .ToList() ?? new List<string>();

            record.freeTexts = record.freeTexts ?? string.Empty;

            Console.WriteLine("Medical record after filtering: " + JsonSerializer.Serialize(record));

            var url = "http://localhost:4020/api/medical-records";
            
            var content = new StringContent(
                JsonSerializer.Serialize(record),
                System.Text.Encoding.UTF8,
                "application/json");

            Console.WriteLine("Medical record JSON sent:"+ await content.ReadAsStringAsync());

            var response = await _httpClient.PostAsync(url, content);
            var responseBody = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"Node.js API Response: {responseBody}");

            if (!response.IsSuccessStatusCode)
                return StatusCode((int)response.StatusCode, responseBody);

            return Ok(await response.Content.ReadAsStringAsync());
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    // PATCH Endpoint to update medical conditions of an existing medical record
    [HttpPatch("api/medical-records/medical-conditions/{userId}")]
    public async Task<IActionResult> UpdateMedicalConditions(string userId, [FromBody] SimpleMedicalRecordUpdateRequest request)
    {
        try 
        {
            if (request?.medicalConditions == null)
            {
                return BadRequest("Medical conditions cannot be null");
            }

            // Transform simple codes to match Node.js API expectations
            var transformedRequest = new
            {
                medicalConditions = request.medicalConditions.Select(code => new
                {
                    code = code // This matches the Node.js schema requirement
                }).ToList()
            };

            var url = $"http://localhost:4020/api/medical-records/medical-conditions/{userId}";
            var json = JsonSerializer.Serialize(transformedRequest);
            
            Console.WriteLine($"Sending request: {json}");
            
            var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");
            var response = await _httpClient.PatchAsync(url, content);
            var responseContent = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"Received response: {responseContent}");

            if (response.IsSuccessStatusCode)
            {
                return Ok(JsonSerializer.Deserialize<MedicalRecordResponse>(
                    responseContent, 
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
                ));
            }

            return StatusCode((int)response.StatusCode, responseContent);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error updating medical conditions: {ex.Message}");
            return StatusCode(500, "Internal server error while updating medical conditions");
        }
    }

    public class MedicalConditionUpdateRequest
{
    public string Code { get; set; }
    public string Designation { get; set; }
    public string Description { get; set; }
    public List<string> CommonSymptoms { get; set; }
}

    // Update medical conditions of an existing medical record
    [HttpPut("api/medical-records/medical-conditions/{userId}")]
    public async Task<IActionResult> UpdateMedicalConditions(string userId, [FromBody] MedicalConditionUpdateRequest request)
    {
        try
        {
            var url = $"http://localhost:4020/api/medical-records/medical-conditions/{userId}";
            
            var response = await _httpClient.PutAsJsonAsync(url, request);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                return StatusCode((int)response.StatusCode, error);
            }

            var result = await response.Content.ReadFromJsonAsync<object>();
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    // GET Endpoint to search medical records by condition code or designation
    [HttpGet("api/medical-records/condition-search")]
    public async Task<IActionResult> GetMedicalRecordsByConditionSearch([FromQuery] string code, [FromQuery] string designation)
    {
        var url = "http://localhost:4020/api/medical-records/condition-search";

        // Construir la URL con los parámetros de consulta
        var queryParams = new List<string>();
        if (!string.IsNullOrEmpty(code))
        {
            queryParams.Add($"code={code}");
        }
        if (!string.IsNullOrEmpty(designation))
        {
            queryParams.Add($"designation={designation}");
        }
        if (queryParams.Count > 0)
        {
            url += "?" + string.Join("&", queryParams);
        }

        // Making a GET request to the Node.js API
        Console.WriteLine("URL: " + url);
        var response = await _httpClient.GetAsync(url);

        var responseContent = await response.Content.ReadAsStringAsync();

        if (response.IsSuccessStatusCode)
        {
            // Deserialize the response to a list of MedicalRecordResponse
            var records = JsonSerializer.Deserialize<List<MedicalRecordResponse>>(
                responseContent,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            if (records == null || records.Count == 0)
            {
                return NotFound("No medical records found for the given condition code or designation.");
            }

            // Transform the data to only include the props
            var transformedRecords = records.Select(r => new 
            {
                r.userId,
                r.medicalConditions,
                r.allergies,
                r.freeTexts
                
            }).ToList();

            return Ok(transformedRecords);
        }
        else
        {
            // Try to capture the error message sent by the Node.js backend
            try
            {
                var errorMessage = JsonSerializer.Deserialize<ErrorResponse>(
                    responseContent,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                return StatusCode((int)response.StatusCode, errorMessage.Message);
            }
            catch
            {
                // Returns a generic message if deserialization fails
                return StatusCode((int)response.StatusCode, "Error sending data to API Node.js");
            }
        }
    }
}

public class MedicalRecord
{
    public string userId { get; set; }
    public List<string> medicalConditions { get; set; }
    public List<string> allergies { get; set; }

    public string freeTexts { get; set; }
}
public class NodeMedicalConditionDTO
{
    public string medicalConditionId { get; set; }
    public string name { get; set; }
    public string description { get; set; }
    public string[] commonSymptoms { get; set; }
}

public class MedicalRecordResponse
{
    public string userId { get; set; }
    public List<NodeMedicalConditionDTO> medicalConditions { get; set; }
    public List<AllergyDTO> allergies { get; set; }

    public string freeTexts { get; set; }
}
public class Id
{
    public string value { get; set; }
}

public class MedicalConditionDTO
{
    public string code { get; set; }
    public string designation { get; set; }
    public string description { get; set; }
    public string[] commonSymptoms { get; set; }

    // Add custom deserialization logic
    public static MedicalConditionDTO FromApiResponse(JsonElement element)
    {
        return new MedicalConditionDTO
        {
            code = element.GetProperty("medicalConditionId").GetString(),
            designation = element.GetProperty("name").GetString(),
            description = element.GetProperty("description").GetString(),
            commonSymptoms = element.GetProperty("commonSymptoms")
                .EnumerateArray()
                .Select(x => x.GetString())
                .ToArray()
        };
    }
}

public class AllergyDTO
{
    public string code { get; set; }
    public string designation { get; set; }
    public string description { get; set; }
}
public class Props
{
    public string userId { get; set; }
    public List<string> medicalConditions { get; set; }
    public List<AllergyDTO> allergies { get; set; }

    public string freeTexts { get; set; }
}

// Clase ErrorResponse
public class ErrorResponse
{
    public string Message { get; set; }
}
public class MedicalRecordUpdateRequest
{
    public List<MedicalConditionDTO> medicalConditions { get; set; }
}

public class NodeApiResponse<T>
{
    public bool isSuccess { get; set; }
    public bool isFailure { get; set; }
    public string error { get; set; }
    public T _value { get; set; }
}

public class SimpleMedicalRecordUpdateRequest
{
    public List<string> medicalConditions { get; set; }
}