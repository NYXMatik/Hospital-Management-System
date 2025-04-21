/*using Microsoft.AspNetCore.Mvc;

using Application.Services;
using Application.DTO;

[ApiController]
[Route("api/[controller]")]
public class SpecializationController : ControllerBase
{
    private readonly SpecializationService _specializationService;

    public SpecializationController(SpecializationService specializationService)
    {
        _specializationService = specializationService;
    }

    // GET: api/Specialization
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PresentDTO>>> GetAllSpecializations()
        {
            IEnumerable<SpecializationDTO> specializationsDTO = await _specializationService.GetAllSpecializations();

            return Ok(specializationsDTO);
        }
}*/
