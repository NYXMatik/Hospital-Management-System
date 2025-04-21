namespace Domain.IRepository;

using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Model;
using Domain.Model.OperationType;

public interface IOperationTypeRepository : IGenericRepository<OperationType>
{
    Task<OperationType> GetOperationByNameAsync(string name);
    Task<IEnumerable<OperationType>> GetOperationsAsync();
    Task<bool> OperationExists(string name);
    Task<OperationType> Add(OperationType operation);

    Task<OperationType> Update(OperationType operation);
}
