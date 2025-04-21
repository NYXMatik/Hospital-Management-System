using Microsoft.AspNetCore.Mvc;
using System;
using Application.Services;
using Domain.Model.OperationRequest;

[ApiController]
[Route("api/[controller]")]
public class OperationRequestController : ControllerBase
{
    private readonly OperationRequestService _service;

    public OperationRequestController(OperationRequestService service)
    {
        _service = service;
    }

    // GET: api/OperationRequest
    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(_service.GetAll());
    }

    // GET: api/OperationRequest/{id}
    [HttpGet("{id}")]
    public IActionResult GetById(string id)
    {
        var request = _service.GetById(id);
        if (request == null)
        {
            return NotFound();
        }
        return Ok(request);
    }

    // POST: api/OperationRequest
    [HttpPost]
    public IActionResult Create([FromBody] Domain.Model.OperationRequest.OperationRequest request)
    {
        try
        {
            var createdRequest = _service.Create(request);
            return CreatedAtAction(nameof(GetById), new { id = createdRequest.Id }, createdRequest);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // PUT: api/OperationRequest/{id}
    [HttpPut("{id}")]
    public IActionResult Update(string id, [FromBody] Domain.Model.OperationRequest.OperationRequest request)
    {
        try
        {
            var updatedRequest = _service.Update(id, request);
            return Ok(updatedRequest);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (UnauthorizedAccessException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // DELETE: api/OperationRequest/{id}
    [HttpDelete("{id}")]
    public IActionResult Delete(string id)
    {
        try
        {
            _service.Delete(id);
            return Ok(new { message = $"Request {id} deleted successfully" });
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

}