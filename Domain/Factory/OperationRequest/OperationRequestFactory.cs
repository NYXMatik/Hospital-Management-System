using System;
using Domain.Model.OperationRequest;

namespace Domain.Factory.OperationRequest
{
    public class OperationRequestFactory : IOperationRequestFactory
    {
        public Domain.Model.OperationRequest.OperationRequest Create(string id, string patientId, string doctorId, string operationTypeId, string description, DateTime requestDate, string status, string priority, DateTime deadline)
        {
            return new Domain.Model.OperationRequest.OperationRequest
            {
                Id = id,
                PatientId = patientId,
                DoctorId = doctorId,
                OperationTypeId = operationTypeId,
                Description = description,
                RequestDate = requestDate,
                Status = status,
                Priority = priority,
                Deadline = deadline
            };
        }
    }
}