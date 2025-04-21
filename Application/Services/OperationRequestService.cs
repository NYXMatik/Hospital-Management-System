using System;
using System.Collections.Generic;
using System.Linq;
using DataModel.Repository.OperationRequest;
using DataModel.Mapper;
using Domain.Model.OperationRequest;

namespace Application.Services
{
    public class OperationRequestService
    {
        private readonly IOperationRequestRepository _repository;
        private readonly OperationRequestMapper _mapper;

        public OperationRequestService(IOperationRequestRepository repository, OperationRequestMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public List<Domain.Model.OperationRequest.OperationRequest> GetAll()
        {
            return _repository.GetAll();
        }

        public Domain.Model.OperationRequest.OperationRequest GetById(string id)
        {
            return _repository.GetById(id);
        }

        public Domain.Model.OperationRequest.OperationRequest Create(Domain.Model.OperationRequest.OperationRequest operationRequest)
        {
            // Validate operation type matches doctor's specialization (simplified example)
            if (!IsOperationTypeValidForDoctor(operationRequest.DoctorId, operationRequest.OperationTypeId))
            {
                throw new ArgumentException("Operation type does not match doctor's specialization.");
            }

            // Generate ID and add to list
            operationRequest.Id = "REQ" + DateTime.Now.Ticks.ToString().Substring(0, 3);
            _repository.Add(operationRequest);

            // Log to patient's medical history (simplified example)
            LogToPatientHistory(operationRequest.PatientId, $"Operation request {operationRequest.Id} created.");

            return operationRequest;
        }

        public Domain.Model.OperationRequest.OperationRequest Update(string id, Domain.Model.OperationRequest.OperationRequest operationRequest)
        {
            var existingRequest = _repository.GetById(id);
            if (existingRequest == null)
            {
                throw new KeyNotFoundException("Request not found.");
            }

            if (existingRequest.DoctorId != operationRequest.DoctorId)
            {
                throw new UnauthorizedAccessException("Only the requesting doctor can update the operation request.");
            }

            // Update request
            existingRequest.Priority = operationRequest.Priority;
            existingRequest.Deadline = operationRequest.Deadline;
            _repository.Update(existingRequest);

            // Log update
            LogToPatientHistory(operationRequest.PatientId, $"Operation request {operationRequest.Id} updated.");

            return existingRequest;
        }

        public void Delete(string id)
        {
            var request = _repository.GetById(id);
            if (request == null)
            {
                throw new KeyNotFoundException("Request not found.");
            }

            // Check if operation has been scheduled (simplified example)
            if (IsOperationScheduled(request.Id))
            {
                throw new InvalidOperationException("Cannot delete a scheduled operation request.");
            }

            // Remove request
            _repository.Delete(id);

            // Log deletion
            LogToPatientHistory(request.PatientId, $"Operation request {request.Id} deleted.");
        }

        public List<Domain.Model.OperationRequest.OperationRequest> Search(string patientName, string operationType, string priority, string status)
        {
            var entities = _repository.GetAll().Where(r =>
                (string.IsNullOrEmpty(patientName) || r.PatientId.Contains(patientName)) &&
                (string.IsNullOrEmpty(operationType) || r.OperationTypeId.Contains(operationType)) &&
                (string.IsNullOrEmpty(priority) || r.Priority.Contains(priority)) &&
                (string.IsNullOrEmpty(status) || r.Status.Contains(status))
            ).ToList();

            return entities;
        }

        private bool IsOperationTypeValidForDoctor(string doctorId, string operationTypeId)
        {
            // Simplified validation logic
            return true;
        }

        private bool IsOperationScheduled(string requestId)
        {
            // Simplified check
            return false;
        }

        private void LogToPatientHistory(string patientId, string message)
        {
            // Simplified logging logic
        }
    }
}