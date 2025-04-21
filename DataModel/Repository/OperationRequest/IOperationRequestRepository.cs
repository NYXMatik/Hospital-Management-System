using System.Collections.Generic;
using Domain.Model.OperationRequest;

namespace DataModel.Repository.OperationRequest
{
    public interface IOperationRequestRepository
    {
        List<Domain.Model.OperationRequest.OperationRequest> GetAll();
        Domain.Model.OperationRequest.OperationRequest GetById(string id);
        void Add(Domain.Model.OperationRequest.OperationRequest operationRequest);
        void Update(Domain.Model.OperationRequest.OperationRequest operationRequest);
        void Delete(string id);
    }
}