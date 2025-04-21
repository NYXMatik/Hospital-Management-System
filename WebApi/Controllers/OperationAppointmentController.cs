using Application.Services;
using Domain.Model.OperationAppointment;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class OperationAppointmentController : ControllerBase
{
    private readonly OperationAppointmentService _operationAppointmentService;

    public OperationAppointmentController(OperationAppointmentService operationService)
    {
        _operationAppointmentService = operationService;
    }

    // Route to create a new operation appointment
    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] OperationAppointment appointment)
    {
        await _operationAppointmentService.AddAppointment(appointment);
        return Ok(appointment);
    }

    // Route to edit an existing operation appointment by ID
    [HttpPut("edit/{id}")]
    public async Task<IActionResult> Edit(int id, [FromBody] OperationAppointment updatedAppointment)
    {
        var appointment = await _operationAppointmentService.GetAppointmentById(id);
        if (appointment == null)
        {
            return NotFound();
        }

        await _operationAppointmentService.UpdateAppointment(id, updatedAppointment);
        return Ok(updatedAppointment);
    }

    // Route to delete an operation appointment by ID
    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var appointment = await _operationAppointmentService.GetAppointmentById(id);
        if (appointment == null)
        {
            return NotFound();
        }

        await _operationAppointmentService.DeleteAppointment(id);
        return Ok();
    }
}