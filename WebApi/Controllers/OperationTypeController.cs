using Microsoft.AspNetCore.Mvc;

using Application.Services;
using Application.DTO;
using Domain.Factory;
using Domain.Model.OperationType;
using System.Drawing.Printing;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OperationTypeController : ControllerBase
    {   
        private readonly OperationTypeService _operationTypeService;

        List<string> _errorMessages = new List<string>();

        public OperationTypeController(OperationTypeService operationService)
        {
            _operationTypeService = operationService;
        }

        // GET: api/Operation
        // Gets all operations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OperationTypeDTO>>> GetOperations()
        {
            IEnumerable<OperationTypeDTO> operationDTOs = await _operationTypeService.GetAll();

            return Ok(operationDTOs);
        }


        // GET: api/Operation/<name>
        // Gets operation by name
        [HttpGet("{name}")]
        public async Task<ActionResult<OperationTypeDTO>> GetOperationByName(string name)
        {
            var operationDTO= await _operationTypeService.GetByName(name);

            if (operationDTO == null)
            {
                return NotFound();
            }

            return Ok(operationDTO);
        }

        // Post: api/Operation/<OperationObject>
        // Creates Operation
        // POST: api/Operation
        [HttpPost]
        public async Task<ActionResult<OperationTypeDTO>> PostOperation([FromBody] OperationTypeDTO operationDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Console.WriteLine("OperationTypeController.PostOperation: operationDTO = " + operationDTO.Name);
            Console.WriteLine("OperationTypeController.PostOperation: operationDTO.Versions = " + operationDTO.Versions.Count);

            OperationTypeDTO operationResultDTO = await _operationTypeService.Add(operationDTO, _errorMessages);
            if (operationResultDTO != null)
            {
                operationResultDTO = await _operationTypeService.GetByName(operationDTO.Name);

                Console.WriteLine("OperationTypeController.PostOperation: operationResultDTO = " + operationResultDTO.Name);
                Console.WriteLine("OperationTypeController.PostOperation: operationResultDTO.Versions = " + operationResultDTO.Versions.Count);

                return CreatedAtAction(nameof(GetOperationByName), new { name = operationDTO.Name }, operationResultDTO);
            }
            else
            {
                return BadRequest(_errorMessages);
            }
        }

        // Delete: api/Operation/<name>
        // Deactivates Operation
        [HttpDelete("{name}")]
        public async Task<ActionResult<OperationTypeDTO>> DeleteOperation(string name)
        {
            OperationTypeDTO operationDTO = await _operationTypeService.Delete(name, _errorMessages);

            if(operationDTO != null)
                return Ok(operationDTO);
            else
                return BadRequest(_errorMessages);
        }

        // POST: api/Operation/<name>
        // Updates Operation with a new Version
        [HttpPost("{name}")]
        public async Task<ActionResult<OperationTypeDTO>> UpdateOperation(string name, [FromBody] VersionDTO versionDTO)
        {
            OperationTypeDTO operationDTO = await _operationTypeService.GetByName(name);
            if (operationDTO == null)
            {
                return NotFound();
            }

            operationDTO.Versions.Add(versionDTO);

            OperationTypeDTO operationResultDTO = await _operationTypeService.Update(operationDTO, _errorMessages);
            if (operationResultDTO != null)
            {
                return Ok(operationResultDTO);
            }
            else
            {
                return BadRequest(_errorMessages);
            }
        }

    }
}
