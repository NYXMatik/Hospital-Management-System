using Microsoft.AspNetCore.Mvc;
using Application.Services;
using Application.DTO;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientController : ControllerBase
    {   
        private readonly PatientService _patientService;
        private readonly IEmailService _emailService;

        List<string> _errorMessages = new List<string>();

        public PatientController(PatientService patientService)
        {
            _patientService = patientService;
        }

        // GET: api/Patient
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PatientDTO>>> GetPatients()
        {
            IEnumerable<PatientDTO> patientsDTO = await _patientService.GetAll();

            return Ok(patientsDTO);
        }

        [HttpGet("Patients Inactive")]
        public async Task<ActionResult<IEnumerable<PatientDTO>>> GetInactivePatients()
        {
            IEnumerable<PatientDTO> patientsDTO = await _patientService.GetAllInactive();

            return Ok(patientsDTO);
        }


        // GET: api/Patient/searchByEmail?email=a@bc
        [HttpGet("searchByEmail")]
        public async Task<ActionResult<PatientInformationDTO>> GetPatientByEmail(string email)
        {
            var patientDTO = await _patientService.GetByEmail(email);

            if (patientDTO == null)
            {
                return NotFound();
            }

            return Ok(patientDTO);
        }

        // GET: api/Patient/searchByPhone?+351 987654321
        [HttpGet("searchByPhoneNumber")]
        public async Task<ActionResult<PatientInformationDTO>> GetPatientByPhone(string phone)
        {
            var patientDTO = await _patientService.GetByPhone(phone);

            if (patientDTO == null)
            {
                return NotFound();
            }

            return Ok(patientDTO);
        }

        // GET: api/Patient/searchByName?name=maria joao
        [HttpGet("searchByName")]
        public async Task<ActionResult<List<PatientInformationDTO>>> GetPatientByName(string name)
        {
            var patientDTOs = await _patientService.GetByName(name);

            if (patientDTOs == null || !patientDTOs.Any())
            {
                return NotFound();
            }

            return Ok(patientDTOs);
        }

        // GET: api/Patient/searchByName?name=maria joao
        [HttpGet("searchByGender")]
        public async Task<ActionResult<List<PatientInformationDTO>>> GetPatientByGender(string gender)
        {
            var patientDTOs = await _patientService.GetByGender(gender);

            if (patientDTOs == null || !patientDTOs.Any())
            {
                return NotFound();
            }

            return Ok(patientDTOs);
        }

        // GET: api/Patient/searchByName?name=1990-10-11
        [HttpGet("searchByBirth")]
        public async Task<ActionResult<List<PatientInformationDTO>>> GetPatientByBirth(string birth)
        {
            var patientDTOs = await _patientService.GetByBirth(birth);

            if (patientDTOs == null || !patientDTOs.Any())
            {
                return NotFound();
            }

            return Ok(patientDTOs);
        }

        // GET: api/Patient/5
        [HttpGet("{medicalRecordNumber}")]
        public async Task<ActionResult<PatientDTO>> GetPatientById(string medicalRecordNumber)
        {
            var patientDTO = await _patientService.GetById(medicalRecordNumber);

            if (patientDTO == null)
            {
                return NotFound();
            }

            return Ok(patientDTO);
        }

        [HttpGet("{medicalRecordNum}/audit-logs")]
        public async Task<IActionResult> GetAuditLogs(string medicalRecordNum)
        {
            try
            {
                var auditLogs = await _patientService.GetAuditLogsForPatientAsync(medicalRecordNum);
                
                // Verifica se existem logs para o paciente
                if (auditLogs == null || !auditLogs.Any())
                {
                    return NotFound("No audit logs found for this patient.");
                }

                return Ok(auditLogs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        // PUT: api/Patient/20201012000001
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{medicalRecordNumber}")]
        public async Task<ActionResult<PatientDTO>> PutPatient(string medicalRecordNumber, PatientUpdateDTO patientDTO)
        {

            PatientDTO success = await _patientService.Update(medicalRecordNumber, patientDTO, _errorMessages);

            if (success == null)    
            {
                return BadRequest(new { errors = _errorMessages });
            }

            return CreatedAtAction(nameof(GetPatientById), new{medicalRecordNumber}, success);
        }


        // PATCH: api/Patient/20201012000001
        /*[HttpPatch("{medicalRecordNumber}")]
        public async Task<IActionResult> PathPatient(string medicalRecordNumber, PatientUpdateDTO patientDTO)
        {

            bool wasUpdated = await _patientService.Update(medicalRecordNumber, patientDTO, _errorMessages);

            if (!wasUpdated /* && _errorMessages.Any() *./)    
            {
                return BadRequest(_errorMessages);
            }

            return Ok();
        }*/


        // POST: api/Patient
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PatientDTO>> PostPatient(PatientCreateDTO patientDTO)
        {
            PatientDTO patientResultDTO = await _patientService.Add(patientDTO, _errorMessages);

            if(patientResultDTO != null){
                return CreatedAtAction(nameof(GetPatientById), new { medicalRecordNumber = patientResultDTO.MedicalRecordNum }, patientResultDTO);
            }else
                return BadRequest(_errorMessages);
        }


        // Inactivate: api/Patient/5
        [HttpDelete("{medicalRecordNum}")]
        public async Task<ActionResult<PatientDTO>> SoftDelete(string medicalRecordNum)
        {
            var cat = await _patientService.InactivateAsync(medicalRecordNum);

            if (cat == null)
            {
                return NotFound();
            }

            return Ok(new { Message = "Patient profile deactivated successfully." });
        }
        
        // DELETE: api/Patient/5
        [HttpDelete("{medicalRecordNumber}/hard")]
        public async Task<ActionResult<PatientDTO>> HardDelete(string medicalRecordNumber)
        {
            try
            {
                var pat = await _patientService.DeleteAsync(medicalRecordNumber, _errorMessages);

                if (pat == null)
                {
                    return NotFound();
                }

                return Ok(new { Message = "Patient profile delete successfully." });
            }
            catch(Exception ex)
            {
               return BadRequest(new {Message = ex.Message});
            }
        }

        [HttpGet("filter")]
        public async Task<ActionResult<IEnumerable<PatientDTO>>> GetFilterPatients(
            string? name = null,
            string? email = null,
            string? phone = null,
            string? birth = null,
            string? gender = null)
        {
            var patientsDTO = await _patientService.FilterPatientsAsync(name, email, phone, birth, gender);

            return Ok(patientsDTO);
        }

    }
}
