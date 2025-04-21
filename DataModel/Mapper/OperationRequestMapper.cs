using DataModel.Model.OperationRequest;
using Domain.Factory.OperationRequest;
using Domain.Model.OperationRequest;

namespace DataModel.Mapper
{
    public class OperationRequestMapper
    {
        private readonly IOperationRequestFactory _operationRequestFactory;

        public OperationRequestMapper(IOperationRequestFactory operationRequestFactory)
        {
            _operationRequestFactory = operationRequestFactory;
        }

        public Domain.Model.OperationRequest.OperationRequest ToDomain(OperationRequestDataModel operationRequestDM)
        {
            return _operationRequestFactory.Create(
                operationRequestDM.Id,
                operationRequestDM.PatientId,
                operationRequestDM.DoctorId,
                operationRequestDM.OperationTypeId,
                operationRequestDM.Description,
                operationRequestDM.RequestDate,
                operationRequestDM.Status,
                operationRequestDM.Priority,
                operationRequestDM.Deadline
            );
        }

        public OperationRequestDataModel ToDataModel(Domain.Model.OperationRequest.OperationRequest operationRequest)
        {
            return new OperationRequestDataModel
            {
                Id = operationRequest.Id,
                PatientId = operationRequest.PatientId,
                DoctorId = operationRequest.DoctorId,
                OperationTypeId = operationRequest.OperationTypeId,
                Description = operationRequest.Description,
                RequestDate = operationRequest.RequestDate,
                Status = operationRequest.Status,
                Priority = operationRequest.Priority,
                Deadline = operationRequest.Deadline
            };
        }
    }
}