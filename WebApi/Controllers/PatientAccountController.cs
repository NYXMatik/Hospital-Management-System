using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Application.DTO;
using Domain.Model;

namespace Application.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class PatientAccountController : ControllerBase
    {
        private readonly PatientAccountService _patientAccountService;
        private readonly ILogger<PatientAccountController> _logger;
        List<string> _errorMessages = new List<string>();


        public PatientAccountController(PatientAccountService patientAccountService, ILogger<PatientAccountController> logger)
        {
            _patientAccountService = patientAccountService;
            _logger = logger;
        }

        /// <summary>
        /// Get a patient account by its ID.
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPatientAccountById(string id)
        {
            _logger.LogInformation("Fetching account for patient with ID: {Id}", id);
            var account = await _patientAccountService.GetPatientAccountByIdAsync(id);

            if (account == null)
            {
                _logger.LogWarning("Patient account with ID {Id} not found.", id);
                return NotFound(new { Message = "Patient account not found." });
            }

            return Ok(new { Data = account });
        }
        
        /// <summary>
        /// Get all patient accounts.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAllPatientAccounts()
        {
            _logger.LogInformation("Fetching all patient accounts.");
            var accounts = await _patientAccountService.GetAllPatientAccountsAsync();
            return Ok(new { Data = accounts });
        }
        [HttpGet("verify")]
        public async Task<IActionResult> VerifyEmail(string email, string token)
        {
            var errorMessages = new List<string>();
            var result = await _patientAccountService.VerifyEmailAsync(email, token, errorMessages);

            if (result==null)
            {
                return BadRequest(new { Errors = errorMessages });
            }

            return Ok(new { Message = "Email verified successfully.",Account = result  });
        }

        /// <summary>
        /// Update an existing patient account.
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePatientAccount(string id, [FromBody] PatientAccountUpdateDTO updateDTO)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid model state for UpdatePatientAccount");
                return BadRequest(new { Errors = ModelState });
            }

            var errorMessages = new List<string>();
            string changedBy = "system"; 
            PatientAccountDTO success= await _patientAccountService.UpdatePatientAccountAsync(id, updateDTO, errorMessages, changedBy);

            if (success == null)    
            {
                return BadRequest(new { errors = _errorMessages });
            }

            _logger.LogInformation("Updated patient account with ID: {Id}", id);
            return NoContent();
        }
        [HttpGet("email/{email}")]
    public async Task<IActionResult> GetPatientAccountByEmail(string email)
    {
        _logger.LogInformation("Fetching account for patient with email: {Email}", email);
        // Llama al servicio para obtener el paciente por correo
        var account = await _patientAccountService.GetPatientAccountByEmailAsync(email);

        if (account == null)
        {
            _logger.LogWarning("Patient account with email {Email} not found.", email);
            return NotFound(new { Message = "Patient account not found." });
        }

        return Ok(new { Data = account });
    }

        /// <summary>
        /// Delete a patient account.
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePatientAccount(string id)
        {
            var isDeleted = await _patientAccountService.DeletePatientAccountAsync(id);
            if (!isDeleted)
            {
                _logger.LogWarning("Patient account with ID {Id} not found for deletion.", id);
                return NotFound(new { Message = "Patient account not found." });
            }

            _logger.LogInformation("Deleted patient account with ID: {Id}", id);
            return NoContent();
        }

        /// <summary>
        /// Register a new patient account.
        /// </summary>
        [HttpPost("register")]
        public async Task<IActionResult> RegisterPatientAccount([FromBody] PatientAccountCreateDTO createDTO)
        {
            var errorMessages = new List<string>();
            var result = await _patientAccountService.RegisterPatientAccountAsync(createDTO, errorMessages);

            if (result == null)
            {
                return BadRequest(new { Errors = errorMessages });
            }

            return Ok(new { Data = result });
        }
        
        [HttpPost("register-google")]
        public async Task<IActionResult> RegisterWithGoogle([FromBody] string idToken)
        {
            var errorMessages = new List<string>();
            var result = await _patientAccountService.RegisterPatientWithGoogleAsync(idToken, errorMessages);

            if (result == null)
            {
                return BadRequest(new { Errors = errorMessages });
            }

            return Ok(new { Data = result });
        }
        
        [HttpPost("appointments")]
        public async Task<IActionResult> AddAppointment([FromBody] DTO.AppointmentDTO appointmentDTO)
        {
            if (appointmentDTO == null)
            {
                _logger.LogWarning("AppointmentDTO is null.");
                return BadRequest(new { Error = "Appointment data is required." });
            }

            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid model state for AddAppointment");
                return BadRequest(new { Errors = ModelState });
            }

            if (string.IsNullOrEmpty(appointmentDTO.Description) || string.IsNullOrEmpty(appointmentDTO.Doctor))
            {
                _logger.LogWarning("Description or Doctor is missing.");
                return BadRequest(new { Error = "Description and Doctor are required." });
            }

            try
            {
                var appointmentCreateDTO = new AppointmentCreateDTO(
                    description: appointmentDTO.Description,
                    doctor: appointmentDTO.Doctor,
                    status: appointmentDTO.Status ?? "Pending",
                    appointmentDate: appointmentDTO.AppointmentDate
                );

                List<string> errorMessages = new List<string>();

                var addedAppointment = await _patientAccountService.AddAppointmentAsync(
                    appointmentDTO.PatientId,
                    appointmentCreateDTO,
                    errorMessages
                );

                if (addedAppointment == null || errorMessages.Any())
                {
                    _logger.LogError("Error adding appointment: {Errors}", string.Join(", ", errorMessages));
                    return BadRequest(new { Errors = errorMessages });
                }

                _logger.LogInformation("Added new appointment for patient with ID: {PatientId}", appointmentDTO.PatientId);
                return Ok(new { Success = true });
            }
            catch (Exception ex)
            {
                _logger.LogError("Error adding appointment: {Message}", ex.Message);
                return BadRequest(new { Error = ex.Message });
            }
        }


        /// <summary>
        /// Get an appointment by its ID.
        /// </summary>
        [HttpGet("appointments/{id}")]
        public async Task<IActionResult> GetAppointmentById(string id)
        {
            _logger.LogInformation("Fetching appointment with ID: {Id}", id);

            var errorMessages = new List<string>();

            var appointment = await _patientAccountService.GetAppointmentByIdAsync(id, errorMessages);

            if (appointment == null)
            {
                if (errorMessages.Any())
                {
                    foreach (var error in errorMessages)
                    {
                        _logger.LogWarning("Error fetching appointment with ID {Id}: {Error}", id, error);
                    }

                    return BadRequest(new { Errors = errorMessages });
                }
                return NotFound(new { Message = "Appointment not found." });
            }
            return Ok(new { Data = appointment });
        }

    }
    

    public class GoogleLoginDTO
    {
        public string IdToken { get; set; }
    }
}
