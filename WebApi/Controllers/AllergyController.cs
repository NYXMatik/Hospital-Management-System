using System.Text;
using System.Text.Json; 
using Microsoft.AspNetCore.Mvc;

public class AllergyController(HttpClient httpClient, IConfiguration configuration) : ControllerBase
{
    private readonly HttpClient _httpClient = httpClient;
    private readonly string _url = configuration["AllergyApi:Url"];

    [HttpGet("api/allergy")]
    public async Task<IActionResult> GetAlergiesData([FromQuery] string code, [FromQuery] string designation)
    {
        //var url = "http://localhost:4020/api/allergy";
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

            // Deserialize the response to a list of Allergies
            var allergies = JsonSerializer.Deserialize<List<AllergyDTO>>(
                responseContent,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            return Ok(allergies); 
        }else{

            // Try to capture the error message sent by the Node.js backend
            try
            {
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

    [HttpPost("api/allergy")]
    public async Task<IActionResult> PostAllergyData([FromBody] AllergyDTO a)
    {
        
        //var url = "http://localhost:4020/api/allergy";
        var url = _url;

        // Converting object to JSON
        var json = JsonSerializer.Serialize(a);

        Console.WriteLine("JSON content send:");
        Console.WriteLine(json);
        
        var jsonContent = new StringContent(
            json, 
            Encoding.UTF8, 
            "application/json");

        var response = await _httpClient.PostAsync(url, jsonContent);
        var responseContent = await response.Content.ReadAsStringAsync();

        if (response.IsSuccessStatusCode)
        {
            // Deserialize the response to  Allergy
            var createdAllergy = JsonSerializer.Deserialize<AllergyDTO>(
                responseContent,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            return Ok(createdAllergy); // Retorna o objeto criado
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

    [HttpPatch("api/allergy/{code}")]
    public async Task<IActionResult> UpdateAllergyData(string code, [FromBody] UpdateAllergyDTO a)
    {
        //var url = $"http://localhost:4020/api/allergy/{code}";
        var url = $"{_url}/{code}"; 

        // Ignore null fields to avoid conflicts with Joi
        var requestData = new Dictionary<string, object>();
        if (a.designation != null && a.designation != "")
            requestData["designation"] = a.designation;
        if (a.description != null && a.description != "")
            requestData["description"] = a.description;

        // Converting object to JSON
        var json = JsonSerializer.Serialize(requestData);
        var jsonContent = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.PatchAsync(url, jsonContent);

        var responseContent = await response.Content.ReadAsStringAsync();

        if (response.IsSuccessStatusCode)
        {
            // Deserialize the response to  Allergy
            var updatedAllergy = JsonSerializer.Deserialize<AllergyDTO>(
                responseContent,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            return Ok(updatedAllergy); 
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
