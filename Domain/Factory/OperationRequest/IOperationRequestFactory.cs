using System;
using Domain.Model.OperationRequest;

namespace Domain.Factory.OperationRequest
{
    public interface IOperationRequestFactory
    {
        Model.OperationRequest.OperationRequest Create(string id, string patientId, string doctorId, string operationTypeId, string description, DateTime requestDate, string status, string priority, DateTime deadline);
    }
}