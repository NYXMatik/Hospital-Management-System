using System.Collections.Generic;
using System.Linq;
using DataModel.Mapper;
using DataModel.Model.OperationRequest;
using Domain.Model.OperationRequest;

namespace DataModel.Repository.OperationRequest
{
    public class OperationRequestRepository : IOperationRequestRepository
    {
        private static List<OperationRequestDataModel> operationRequests = new List<OperationRequestDataModel>();
        private readonly OperationRequestMapper _mapper;

        public OperationRequestRepository(OperationRequestMapper mapper)
        {
            _mapper = mapper;
        }

        public List<Domain.Model.OperationRequest.OperationRequest> GetAll()
        {
            return operationRequests.Select(_mapper.ToDomain).ToList();
        }

        public Domain.Model.OperationRequest.OperationRequest GetById(string id)
        {
            var dataModel = operationRequests.FirstOrDefault(r => r.Id == id);
            return dataModel == null ? null : _mapper.ToDomain(dataModel);
        }

        public void Add(Domain.Model.OperationRequest.OperationRequest operationRequest)
        {
            var dataModel = _mapper.ToDataModel(operationRequest);
            operationRequests.Add(dataModel);
        }

        public void Update(Domain.Model.OperationRequest.OperationRequest operationRequest)
        {
            var dataModel = _mapper.ToDataModel(operationRequest);
            var existingRequest = operationRequests.FirstOrDefault(r => r.Id == dataModel.Id);
            if (existingRequest != null)
            {
                operationRequests.Remove(existingRequest);
                operationRequests.Add(dataModel);
            }
        }

        public void Delete(string id)
        {
            var request = operationRequests.FirstOrDefault(r => r.Id == id);
            if (request != null)
            {
                operationRequests.Remove(request);
            }
        }
    }
}