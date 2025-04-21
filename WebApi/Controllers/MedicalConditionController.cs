using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

public class MedicalConditionController(HttpClient httpClient, IConfiguration configuration) : ControllerBase
{
    private readonly HttpClient _httpClient = httpClient;
    private readonly string _url = configuration["MedicalConditionApi:Url"];

    // GET Endpoint with filters
    [HttpGet("api/medical-conditions")]
    public async Task<IActionResult> GetMedicalConditionsData([FromQuery] string code, [FromQuery] string designation)
    {
        var url = _url;;

        var queryParams = new List<string>();
        if (!string.IsNullOrEmpty(code))
        {
            queryParams.Add($"code={code}");
        }
        if (!string.IsNullOrEmpty(designation))
        {
            queryParams.Add($"designation={designation}");
        }

        if (queryParams.Any())
        {
            url = $"{url}?{string.Join("&", queryParams)}";
        }

        // Making a GET request to the Node.js API
        var response = await _httpClient.GetAsync(url);

        var responseContent = await response.Content.ReadAsStringAsync();

        if (response.IsSuccessStatusCode)
        {

            // Deserialize the response to a list of MedicalCondition
            var conditions = JsonSerializer.Deserialize<List<MedicalCondition>>(
                responseContent,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            return Ok(conditions); 
        }else{
           // Try to capture the error message sent by the Node.js backend
            try
            {
                // Attempt to deserialize to NodeJsErrorResponse
                var errorResponse = JsonSerializer.Deserialize<NodeJsErrorResponse>(
                    responseContent,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                if (errorResponse?.Validation?.Body?.Message != null)
                {
                    return StatusCode((int)response.StatusCode, errorResponse.Validation.Body.Message);
                }

                if (errorResponse?.Validation?.Query?.Message != null)
                {
                    return StatusCode((int)response.StatusCode, errorResponse.Validation.Query.Message);
                }

                var genericErrorResponse = JsonSerializer.Deserialize<ErrorResponse>(
                    responseContent,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                if (genericErrorResponse?.Message != null)
                {
                    return StatusCode((int)response.StatusCode, genericErrorResponse.Message);
                }
            }
            catch
            {
                // Returns a generic message if deserialization fails
                return StatusCode((int)response.StatusCode, "Error sending data to API Node.js");
            }

            return StatusCode((int)response.StatusCode, "An unknown error occurred.");
        }
    }

    [HttpPost("api/medical-conditions")]
    public async Task<IActionResult> PostMedicalConditionsData([FromBody] MedicalCondition condition)
    {
        // URL da API Node.js
        var url = _url;

        // Converting object to JSON
        var json = JsonSerializer.Serialize(condition);

        Console.WriteLine("Conteúdo JSON enviado:");
        Console.WriteLine(json);

        var jsonContent = new StringContent(
            json, 
            Encoding.UTF8, 
            "application/json");

        var response = await _httpClient.PostAsync(url, jsonContent);

        var responseContent = await response.Content.ReadAsStringAsync();

        if (response.IsSuccessStatusCode)
        {
            // Deserialize the response to  MedicalCondition
            var createdCondition = JsonSerializer.Deserialize<MedicalCondition>(
                responseContent,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            return Ok(createdCondition); // Retorna o objeto criado
        }
        else
        {
            // Try to capture the error message sent by the Node.js backend
            try
            {
                var errorNodeResponse = JsonSerializer.Deserialize<NodeJsErrorResponse>(
                    responseContent,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                if (errorNodeResponse?.Validation?.Body?.Message != null)
                {
                    return StatusCode((int)response.StatusCode, errorNodeResponse.Validation.Body.Message);
                }
                
                var errorResponse = JsonSerializer.Deserialize<ErrorResponseWithErrors>(
                    responseContent,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                if (errorResponse?.Errors?.Message != null)
                {
                    return StatusCode((int)response.StatusCode, errorResponse.Errors.Message);
                }

                var genericErrorResponse = JsonSerializer.Deserialize<ErrorResponse>(
                    responseContent,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                if (genericErrorResponse?.Message != null)
                {
                    return StatusCode((int)response.StatusCode, genericErrorResponse.Message);
                }
            }
            catch
            {
                return StatusCode((int)response.StatusCode, "Error sending data to API Node.js");
            }

            return StatusCode((int)response.StatusCode, "An unknown error occurred.");
        }
    }

    [HttpPatch("api/medical-conditions/{code}")]
    public async Task<IActionResult> UpdateMedicalConditionData(string code, [FromBody] UpdateMedicalCondition condition)
    {
        var url = $"{_url}/{code}"; 

        // Ignore null fields to avoid conflicts with Joi
        var requestData = new Dictionary<string, object>();
        if (condition.designation != null && condition.designation != "")
            requestData["designation"] = condition.designation;
        if (condition.description != null && condition.description != "")
            requestData["description"] = condition.description;

        // Converting object to JSON
        var json = JsonSerializer.Serialize(requestData);
        var jsonContent = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.PatchAsync(url, jsonContent);

        var responseContent = await response.Content.ReadAsStringAsync();

        if (response.IsSuccessStatusCode)
        {
            // Deserialize the response to  MedicalCondition
            var createdCondition = JsonSerializer.Deserialize<MedicalCondition>(
                responseContent,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            return Ok(createdCondition); 
        }
        else
        {
            // Try to capture the error message sent by the Node.js backend
            try
            {
                var errorResponse = JsonSerializer.Deserialize<NodeJsErrorResponse>(
                    responseContent,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                    
                var validationMessage = errorResponse?.Validation?.Body?.Message ;

                if(validationMessage==null){
                    var errorMessage = JsonSerializer.Deserialize<ErrorResponse>(
                    responseContent,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                    return StatusCode((int)response.StatusCode, errorMessage.Message);
                }

                return StatusCode((int)response.StatusCode, validationMessage);
            }
            catch
            {
                // Returns a generic message if deserialization fails
                return StatusCode((int)response.StatusCode, "Error sending data to API Node.js");
            }
        }
    }  

}
