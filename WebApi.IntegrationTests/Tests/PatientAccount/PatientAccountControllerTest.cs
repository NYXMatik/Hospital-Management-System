using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Application.DTO;
using Microsoft.AspNetCore.Mvc.Testing;
using Newtonsoft.Json;
using Xunit;
using System.Net.Http.Json;
using DataModel.Model;
using Domain.Model;

namespace WebApi.IntegrationTests
{
    public class PatientAccountControllerTests : IClassFixture<IntegrationTestsWebApplicationFactory<Program>>
    {
        private readonly IntegrationTestsWebApplicationFactory<Program> _factory;
        private readonly HttpClient _client;

        public PatientAccountControllerTests(IntegrationTestsWebApplicationFactory<Program> factory)
        {
            _factory = factory;
            _client = _factory.CreateClient();
        }

        [Fact]
        public async Task Post_PatientAccount_CreatesNewPatient()
        {
            // Arrange
            var patientDto = new CreatePatientAccountDTO
            {
                FullName = "John Doe",
                Email = "john.doe@example.com",
                PhoneNumber = "+123 4567890",
                DateOfBirth = "1990-01-01",
                Address = "123 Main St",
                MedicalRecordNumber = "MR123456",
            };

            var jsonContent = JsonConvert.SerializeObject(patientDto);
            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            // Act
            var response = await _client.PostAsync("/api/patientAccount", content);

            // Assert
            response.EnsureSuccessStatusCode();
            var responseBody = await response.Content.ReadAsStringAsync();
            Assert.NotNull(responseBody);
        }

        [Fact]
        public async Task Get_PatientAccount_By_Id_ReturnsPatient()
        {
            var patientId = "P2023000001";

            // Act
            var response = await _client.GetAsync($"/api/patientAccount/{patientId}");

            // Assert
            response.EnsureSuccessStatusCode();
            var responseBody = await response.Content.ReadAsStringAsync();
            Assert.NotNull(responseBody);

            var patient = JsonConvert.DeserializeObject<PresentPatientAccountDTO>(responseBody);
            Assert.Equal("John Doe", patient.FullName);
            Assert.Equal("john.doe@example.com", patient.Email);
            Assert.Equal("+123 4567890", patient.PhoneNumber);
        }

        [Fact]
        public async Task Put_PatientAccount_UpdatesPatientSuccessfully()
        {
            // Arrange
            var patientId = "P2023000001";
            var updatePatientDTO = new UpdatePatientAccountDTO
            {
                Email = "john.updated@example.com",
                PhoneNumber = "+123 0987654321",
                Address = "456 Secondary St",
            };

            // Act
            var response = await _client.PutAsJsonAsync($"/api/patientAccount/{patientId}", updatePatientDTO);

            // Assert
            response.EnsureSuccessStatusCode();

            var updatedResponse = await _client.GetAsync($"/api/patientAccount/{patientId}");
            updatedResponse.EnsureSuccessStatusCode();

            var updatedPatient = await updatedResponse.Content.ReadFromJsonAsync<PatientDataModel>();

            Assert.NotNull(updatedPatient);
            Assert.Equal(updatePatientDTO.Email, updatedPatient.Contact.Email);
            Assert.Equal(updatePatientDTO.PhoneNumber, updatedPatient.Contact.PhoneNumber);
            Assert.Equal(updatePatientDTO.Address, updatedPatient.Address);
        }

        [Fact]
        public async Task Delete_PatientAccount_DeletesPatientSuccessfully()
        {
            // Arrange
            var patientIdToDelete = "P2023000001";

            // Act
            var response = await _client.DeleteAsync($"/api/patientAccount/{patientIdToDelete}");
            response.EnsureSuccessStatusCode();

            // Assert
            var getResponse = await _client.GetAsync($"/api/patientAccount/{patientIdToDelete}");
            Assert.Equal(System.Net.HttpStatusCode.NotFound, getResponse.StatusCode);
        }
    }
}
