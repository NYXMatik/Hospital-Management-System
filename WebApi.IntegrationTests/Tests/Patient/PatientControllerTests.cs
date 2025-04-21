using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Application.DTO;
using Microsoft.AspNetCore.Mvc.Testing;
using Newtonsoft.Json;
using Xunit;
using System.Net.Http.Json;

namespace WebApi.IntegrationTests
{
    public class PatientControllerTests : IClassFixture<IntegrationTestsWebApplicationFactoryPatient<Program>>
    {
        private readonly IntegrationTestsWebApplicationFactoryPatient<Program> _factory;
        private readonly HttpClient _client;

        public PatientControllerTests(IntegrationTestsWebApplicationFactoryPatient<Program> factory)
        {
            _factory = factory;
            _client = _factory.CreateClient();
        }

        [Fact]
        public async Task Post_Patient_CreatesNewPatient()
        {
            // Arrange
            var patientDto = new PatientCreateDTO
            {
                FullName = "Maria Rita",
                Email = "maria@gmail.com",
                PhoneNumber = "+351 987654321",
                Gender = "Female",
                Birth = "2003-10-10",
                EmergencyContact = "+351 912345678"
            };

            var jsonContent = JsonConvert.SerializeObject(patientDto);
            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            // Act
            var response = await _client.PostAsync("/api/patient", content);

            // Assert
            response.EnsureSuccessStatusCode();
            var responseBody = await response.Content.ReadAsStringAsync();
            Assert.NotNull(responseBody);
        }

        [Fact]
        public async Task Get_Patient_By_Id_ReturnsPatient()
        {
            // Arrange
            var patientId = "202410000005";

            // Act
            var response = await _client.GetAsync($"/api/patient/{patientId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var responseBody = await response.Content.ReadAsStringAsync();
            Assert.NotNull(responseBody);

            var patient = JsonConvert.DeserializeObject<PatientDTO>(responseBody);
            Assert.Equal("Jane Doe", patient.FullName);
            Assert.Equal("jane.doe@example.com", patient.Email);
            Assert.Equal("+345 123456789", patient.PhoneNumber);
            Assert.Equal("2020-10-10", patient.Birth);
            Assert.Equal("Male", patient.Gender);
            Assert.Equal("+351 987654321", patient.EmergencyContact);
        }

        [Fact]
        public async Task Put_Patient_UpdatesPatientSuccessfully()
        {
            // Arrange
            var patientId = "202410000005";
            var updatePatientDTO = new PatientUpdateDTO
            {
                Email = "jane.updated@example.com",
                PhoneNumber = "+345 987654321",
                Birth = "2020-12-12",
                EmergencyContact = "+351 654321987"
            };

            // Act
            var response = await _client.PutAsJsonAsync($"/api/patient/{patientId}", updatePatientDTO);
            response.EnsureSuccessStatusCode();

            var updatedResponse = await _client.GetAsync($"/api/patient/{patientId}");
            updatedResponse.EnsureSuccessStatusCode();

            var updatedPatient = await updatedResponse.Content.ReadFromJsonAsync<PatientDTO>();

            Assert.NotNull(updatedPatient);
            Assert.Equal(updatePatientDTO.Email, updatedPatient.Email);
            Assert.Equal(updatePatientDTO.PhoneNumber, updatedPatient.PhoneNumber);
            Assert.Equal(updatePatientDTO.Birth, updatedPatient.Birth);
            Assert.Equal(updatePatientDTO.EmergencyContact, updatedPatient.EmergencyContact);
        }

        [Fact]
        public async Task Delete_Patient_DeletesPatientSuccessfully()
        {
            // Arrange
            var patientIdToDelete = "202410000005";

            // Act
            var response = await _client.DeleteAsync($"/api/patient/{patientIdToDelete}");
            response.EnsureSuccessStatusCode();

            var getResponse = await _client.GetAsync($"/api/patient/{patientIdToDelete}");
            Assert.Equal(System.Net.HttpStatusCode.NotFound, getResponse.StatusCode);
        }
    }
}
