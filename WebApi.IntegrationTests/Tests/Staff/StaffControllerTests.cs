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
    public class StaffControllerTests : IClassFixture<IntegrationTestsWebApplicationFactory<Program>>
    {
        private readonly IntegrationTestsWebApplicationFactory<Program> _factory;
        private readonly HttpClient _client;

        public StaffControllerTests(IntegrationTestsWebApplicationFactory<Program> factory)
        {
            _factory = factory;
            _client = _factory.CreateClient();
        }

        [Fact]
        public async Task Post_Staff_CreatesNewStaff()
        {
            // Arrange
            var staffDto = new CreateStaffDTO 
            {
                FullName = "Maria Neves",
                LicenseNumber = "ABC173",
                Email = "maria.joana@example.com",
                PhoneNumber = "+345 65783527",
                RecruitmentYear = 2015,
                Category = "Nurse",
                Specialization = "Pediatrics" 
            };

            var jsonContent = JsonConvert.SerializeObject(staffDto);
            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            // Act
            var response = await _client.PostAsync("/api/staff", content);

            // Assert
            response.EnsureSuccessStatusCode();
            var responseBody = await response.Content.ReadAsStringAsync();
            Assert.NotNull(responseBody);
        }

        [Fact]
        public async Task Get_Staff_By_Id_ReturnsStaff()
        {
            var staffId = "N2019000001"; 

            // Act
            var response = await _client.GetAsync($"/api/staff/{staffId}");

            // Assert
            response.EnsureSuccessStatusCode(); 
            var responseBody = await response.Content.ReadAsStringAsync();
            Assert.NotNull(responseBody);

            var staff = JsonConvert.DeserializeObject<PresentStaffDTO>(responseBody);
            Assert.Equal("Jane Doe", staff.FullName);
            Assert.Equal("ABC123", staff.LicenseNumber); 
            Assert.Equal("jane.doe@example.com", staff.Email);
            Assert.Equal("+345 123456789", staff.PhoneNumber);
            Assert.Equal("Pediatrics", staff.Specialization);
        }

        [Fact]
        public async Task PutStaff_UpdatesStaffSuccessfully()
        {
            // Arrange
            var staffId = "N2019000001"; 
            var updateStaffDTO = new UpdateStaffDTO
            {
                Email = "jane.updated@example.com",
                PhoneNumber = "+345 987654321",
                Specialization = "Pediatrics"
            };

            // Act
            var response = await _client.PutAsJsonAsync($"/api/staff/{staffId}", updateStaffDTO);
            
            // Assert
            response.EnsureSuccessStatusCode(); 

            var updatedResponse = await _client.GetAsync($"/api/staff/{staffId}");
            updatedResponse.EnsureSuccessStatusCode();
            
            var updatedStaff = await updatedResponse.Content.ReadFromJsonAsync<StaffDataModel>();
            
            Assert.NotNull(updatedStaff);
            Assert.Equal(updateStaffDTO.Email, updatedStaff.Contact.Email); 
            Assert.Equal(updateStaffDTO.PhoneNumber, updatedStaff.Contact.PhoneNumber); 
            Assert.Equal(updateStaffDTO.Specialization, updatedStaff.Specialization);
        }

        [Fact]
        public async Task Delete_Staff_DeletesStaffSuccessfully()
        {
            // Arrange
            var staffIdToDelete = "N2019000001";

            // Act
            var response = await _client.DeleteAsync($"/api/staff/{staffIdToDelete}");
            response.EnsureSuccessStatusCode(); 

            // Assert
            var getResponse = await _client.GetAsync($"/api/staff/{staffIdToDelete}");
            Assert.Equal(System.Net.HttpStatusCode.NotFound, getResponse.StatusCode); 
        }
    }
}
