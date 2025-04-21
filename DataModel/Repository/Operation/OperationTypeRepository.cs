namespace DataModel.Repository;

using Microsoft.EntityFrameworkCore;

using DataModel.Model;
using DataModel.Mapper;

using Domain.Model;
using Domain.IRepository;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Domain.Model.OperationType;

public class OperationTypeRepository : GenericRepository<OperationType>, IOperationTypeRepository
{    
    OperationTypeMapper _operationMapper;
    public OperationTypeRepository(GenericContext context, OperationTypeMapper mapper) : base(context!)
    {
        _operationMapper = mapper;
    }

public async Task<IEnumerable<OperationType>> GetOperationsAsync()
{
    try
    {
        // Fetch OperationTypeDataModel with related entities using eager loading
        var operationsDataModel = await _context.Set<OperationTypeDataModel>()
            .Include(o => o.Versions) // Include related Versions
            .ThenInclude(v => v.Phases) // Include nested Phases if needed
            .ThenInclude(p => p.StaffList) // Include nested StaffList if needed
            .ToListAsync();

        // Ensure operationsDataModel is not null or empty
        if (operationsDataModel == null || !operationsDataModel.Any())
        {
            return new List<OperationType>(); // Return an empty list
        }

        // Map data models to domain models
        var operations = _operationMapper.ToDomain(operationsDataModel);

        return operations;
    }
    catch (Exception ex)
    {
        // Log the exception details
        Console.WriteLine($"Error in GetOperationsAsync: {ex.Message}");
        throw; // Re-throw the exception to be handled by calling code
    }
}


public async Task<OperationType> GetOperationByNameAsync(string name)
{
    try
    {
        // Include Versions in the query
        OperationTypeDataModel operationDataModel = await _context.Set<OperationTypeDataModel>()
            .Include(p => p.Versions) // Ensure Versions are included
            .ThenInclude(v => v.Phases) // Include nested Phases if needed
            .ThenInclude(p => p.StaffList) // Include nested StaffList if needed
            .FirstOrDefaultAsync(p => p.Name == name);

        Console.WriteLine("OperationTypeRepository.GetOperationByNameAsync: operationDataModel.Name = " + operationDataModel.Name);
        Console.WriteLine("OperationTypeRepository.GetOperationByNameAsync: operationDataModel.Versions.Count = " + operationDataModel.Versions.Count);

        if (operationDataModel == null)
            return null;

        // Map to domain model
        OperationType operation = _operationMapper.ToDomain(operationDataModel);

        return operation;
    }
    catch (Exception ex)
    {
        // Log exception (optional)
        Console.WriteLine($"Error in GetOperationByNameAsync: {ex.Message}");
        throw;
    }
}


    public async Task<OperationType> Add(OperationType operation)
    {
        try {
            OperationTypeDataModel operationDataModel = _operationMapper.ToDataModel(operation);

            EntityEntry<OperationTypeDataModel> operationDataModelEntityEntry = _context.Set<OperationTypeDataModel>().Add(operationDataModel);
            
            await _context.SaveChangesAsync();

            OperationTypeDataModel operationDataModelSaved = operationDataModelEntityEntry.Entity;

            OperationType operationSaved = _operationMapper.ToDomain(operationDataModelSaved);

            return operationSaved;    
        }
        catch
        {
            throw;
        }
    }


    public async Task<bool> OperationExists(string name)
    {
        return await _context.Set<OperationTypeDataModel>().AnyAsync(e => e.Name == name);
    }

    public async Task<OperationType> Update(OperationType operation)
    {
        try 
        {
            OperationTypeDataModel operationDataModel = _operationMapper.ToDataModel(operation);

            // Check for existing tracked entity
            var trackedEntity = _context.ChangeTracker.Entries<OperationTypeDataModel>()
                .FirstOrDefault(e => e.Entity.Name == operationDataModel.Name);

            if (trackedEntity != null)
            {
                _context.Entry(trackedEntity.Entity).State = EntityState.Detached;
            }

            // Attach and update the entity
            _context.Set<OperationTypeDataModel>().Attach(operationDataModel);
            _context.Entry(operationDataModel).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            OperationType operationSaved = _operationMapper.ToDomain(operationDataModel);

            Console.WriteLine("OperationTypeRepository.Update: operationSaved.Versions.Count = " + operationSaved.Versions.Count);

            return operationSaved;
        }
        catch
        {
            throw;
        }
    }


    
}