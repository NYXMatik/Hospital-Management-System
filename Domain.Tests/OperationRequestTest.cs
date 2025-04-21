namespace Domain.Tests;

using Domain.Model.OperationRequest;
using System;
using Xunit;

public class OperationRequestTest
{
    [Theory]
    [InlineData("1", "1", "1", "1", "Surgery", "High", "Pending", "Description", "2023-12-31")]
    [InlineData("2", "2", "2", "2", "Consultation", "Medium", "Approved", "Description", "2023-12-31")]
    public void CreateOperationRequestSuccess(string id, string patientId, string doctorId, string operationTypeId, string operationType, string priority, string status, string description, string deadline)
    {
        var requestDate = DateTime.Now;
        var operationRequest = new OperationRequest
        {
            Id = id,
            PatientId = patientId,
            DoctorId = doctorId,
            OperationTypeId = operationTypeId,
            Description = description,
            RequestDate = requestDate,
            Status = status,
            Priority = priority,
            Deadline = DateTime.Parse(deadline)
        };

        Assert.Equal(id, operationRequest.Id);
        Assert.Equal(patientId, operationRequest.PatientId);
        Assert.Equal(doctorId, operationRequest.DoctorId);
        Assert.Equal(operationTypeId, operationRequest.OperationTypeId);
        Assert.Equal(description, operationRequest.Description);
        Assert.Equal(requestDate, operationRequest.RequestDate);
        Assert.Equal(status, operationRequest.Status);
        Assert.Equal(priority, operationRequest.Priority);
        Assert.Equal(DateTime.Parse(deadline), operationRequest.Deadline);
    }

    [Fact]
    public void CreateOperationRequestFailure()
    {
        Assert.Throws<ArgumentNullException>(() => new OperationRequest
        {
            Id = null,
            PatientId = "1",
            DoctorId = "1",
            OperationTypeId = "1",
            Description = "Description",
            RequestDate = DateTime.Now,
            Status = "Pending",
            Priority = "High",
            Deadline = DateTime.Now.AddDays(7)
        });

        Assert.Throws<ArgumentNullException>(() => new OperationRequest
        {
            Id = "1",
            PatientId = null,
            DoctorId = "1",
            OperationTypeId = "1",
            Description = "Description",
            RequestDate = DateTime.Now,
            Status = "Pending",
            Priority = "High",
            Deadline = DateTime.Now.AddDays(7)
        });

        Assert.Throws<ArgumentNullException>(() => new OperationRequest
        {
            Id = "1",
            PatientId = "1",
            DoctorId = null,
            OperationTypeId = "1",
            Description = "Description",
            RequestDate = DateTime.Now,
            Status = "Pending",
            Priority = "High",
            Deadline = DateTime.Now.AddDays(7)
        });

        Assert.Throws<ArgumentNullException>(() => new OperationRequest
        {
            Id = "1",
            PatientId = "1",
            DoctorId = "1",
            OperationTypeId = null,
            Description = "Description",
            RequestDate = DateTime.Now,
            Status = "Pending",
            Priority = "High",
            Deadline = DateTime.Now.AddDays(7)
        });
    }

    [Theory]
    [InlineData("1", "Pending", "Approved")]
    [InlineData("2", "Approved", "Completed")]
    public void UpdateOperationRequestStatusSuccess(string id, string initialStatus, string updatedStatus)
    {
        var operationRequest = new OperationRequest
        {
            Id = id,
            PatientId = "1",
            DoctorId = "1",
            OperationTypeId = "1",
            Description = "Description",
            RequestDate = DateTime.Now,
            Status = initialStatus,
            Priority = "High",
            Deadline = DateTime.Now.AddDays(7)
        };

        operationRequest.Status = updatedStatus;
        Assert.Equal(updatedStatus, operationRequest.Status);
    }

    [Fact]
    public void UpdateOperationRequestStatusFailure()
    {
        var operationRequest = new OperationRequest
        {
            Id = "1",
            PatientId = "1",
            DoctorId = "1",
            OperationTypeId = "1",
            Description = "Description",
            RequestDate = DateTime.Now,
            Status = "Pending",
            Priority = "High",
            Deadline = DateTime.Now.AddDays(7)
        };

        Assert.Throws<ArgumentNullException>(() => operationRequest.Status = null);
    }

    [Theory]
    [InlineData("1", "1", "1", "1", "Surgery", "High", "Pending", "Description", "2023-12-31", "2", "2", "2", "2", "Consultation", "Medium", "Approved", "Updated Description", "2024-01-31")]
    public void UpdateOperationRequestDetailsSuccess(string initialId, string initialPatientId, string initialDoctorId, string initialOperationTypeId, string initialOperationType, string initialPriority, string initialStatus, string initialDescription, string initialDeadline, string updatedId, string updatedPatientId, string updatedDoctorId, string updatedOperationTypeId, string updatedOperationType, string updatedPriority, string updatedStatus, string updatedDescription, string updatedDeadline)
    {
        var operationRequest = new OperationRequest
        {
            Id = initialId,
            PatientId = initialPatientId,
            DoctorId = initialDoctorId,
            OperationTypeId = initialOperationTypeId,
            Description = initialDescription,
            RequestDate = DateTime.Now,
            Status = initialStatus,
            Priority = initialPriority,
            Deadline = DateTime.Parse(initialDeadline)
        };

        operationRequest.Id = updatedId;
        operationRequest.PatientId = updatedPatientId;
        operationRequest.DoctorId = updatedDoctorId;
        operationRequest.OperationTypeId = updatedOperationTypeId;
        operationRequest.Description = updatedDescription;
        operationRequest.Status = updatedStatus;
        operationRequest.Priority = updatedPriority;
        operationRequest.Deadline = DateTime.Parse(updatedDeadline);

        Assert.Equal(updatedId, operationRequest.Id);
        Assert.Equal(updatedPatientId, operationRequest.PatientId);
        Assert.Equal(updatedDoctorId, operationRequest.DoctorId);
        Assert.Equal(updatedOperationTypeId, operationRequest.OperationTypeId);
        Assert.Equal(updatedDescription, operationRequest.Description);
        Assert.Equal(updatedStatus, operationRequest.Status);
        Assert.Equal(updatedPriority, operationRequest.Priority);
        Assert.Equal(DateTime.Parse(updatedDeadline), operationRequest.Deadline);
    }

    [Fact]
    public void UpdateOperationRequestDetailsFailure()
    {
        var operationRequest = new OperationRequest
        {
            Id = "1",
            PatientId = "1",
            DoctorId = "1",
            OperationTypeId = "1",
            Description = "Description",
            RequestDate = DateTime.Now,
            Status = "Pending",
            Priority = "High",
            Deadline = DateTime.Now.AddDays(7)
        };

        Assert.Throws<ArgumentNullException>(() => operationRequest.Id = null);
        Assert.Throws<ArgumentNullException>(() => operationRequest.PatientId = null);
        Assert.Throws<ArgumentNullException>(() => operationRequest.DoctorId = null);
        Assert.Throws<ArgumentNullException>(() => operationRequest.OperationTypeId = null);
    }
}