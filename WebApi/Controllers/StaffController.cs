using Microsoft.AspNetCore.Mvc;

using Application.Services;
using Application.DTO;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StaffController : ControllerBase
    {   
        private readonly StaffService _staffService;

        List<string> _errorMessages = new List<string>();

        public StaffController(StaffService staffService)
        {
            _staffService = staffService;
        }

        // GET: api/Staff
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PresentStaffDTO>>> GetStaffs()
        {
            IEnumerable<PresentStaffDTO> staffsDTO = await _staffService.GetAll();

            return Ok(staffsDTO);
        }

        // GET: api/Staff/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PresentStaffDTO>> GetStaffById(string id)
        {
            var staffDTO = await _staffService.GetById(id); 

            if (staffDTO == null)
            {
                return NotFound($"Staff with ID '{id}' not found.");
            }

            return Ok(staffDTO);
        }

        // GET: api/Staff/a@bc
        [HttpGet("searchByEmail")]
        public async Task<ActionResult<ListStaffDTO>> GetStaffByEmail(string email)
        {
            var staffDTO= await _staffService.GetByEmail(email); 
            if (staffDTO == null)
            {
                return NotFound($"Staff with email '{email}' not found.");
            }

            return Ok(staffDTO);
        }

        // GET: api/Staff/name
        [HttpGet("searchByName")]
        public async Task<ActionResult<ListStaffDTO>> GetStaffByName(string name)
        {
            var staffDTO = await _staffService.GetByName(name); 

            if (staffDTO == null)
            {
                return NotFound($"Staff with name '{name}' not found.");
            }

            return Ok(staffDTO);
        }

        // GET: api/Staff/specialization
        [HttpGet("searchBySpecialization")]
        public async Task<ActionResult<ListStaffDTO>> GetStaffBySpecialization(string specialization)
        {
            var staffDTO = await _staffService.GetBySpecialization(specialization); 

            if (staffDTO == null)
            {
                return NotFound($"Staff with specialization '{specialization}' not found.");
            }

            return Ok(staffDTO);
        }

        // POST: api/Staff
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PresentStaffDTO>> PostStaff(CreateStaffDTO staffDTO)
        {
            PresentStaffDTO staffResultDTO = await _staffService.Add(staffDTO, _errorMessages);

            if (staffResultDTO != null)
                return CreatedAtAction(nameof(GetStaffById), new { id = staffResultDTO.Id }, staffResultDTO);
            else
                return BadRequest(_errorMessages);
        }

        // PUT: api/Staff/D2020000001
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<ActionResult<PresentStaffDTO>> PutStaff(string id, UpdateStaffDTO staffDTO)
        {

            PresentStaffDTO staffResultDTO = await _staffService.Update(id, staffDTO, _errorMessages);

            if (staffResultDTO == null)    
                return BadRequest(new { errors = _errorMessages });
            else
                return CreatedAtAction(nameof(GetStaffById), new { id }, staffResultDTO);
        }

        // Inactivate: api/Staff/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> SoftDelete(string id)
        {
            var success = await _staffService.InactivateAsync(id, _errorMessages); 

            if (success == false)
            {
                return BadRequest(_errorMessages);
            }

            return Ok(new { Message = "Staff profile deactivated successfully." });
        }


        [HttpGet("{id}/audit-logs")]
        public async Task<IActionResult> GetAuditLogs(string id)
        {
            try
            {
                var auditLogs = await _staffService.GetAuditLogsForStaffAsync(id);
                
                if (auditLogs == null || !auditLogs.Any())
                {
                    return NotFound("No audit logs found for this staff.");
                }

                return Ok(auditLogs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("filter")]
        public async Task<ActionResult<IEnumerable<PresentStaffDTO>>> GetStaffs(
            string? name = null,
            string? email = null,
            string? specialization = null)
        {

            var staffsDTO = await _staffService.FilterStaffsAsync(name, email, specialization);

            return Ok(staffsDTO);
        }

    }

    
}
