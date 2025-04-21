namespace Application.Services;

using Domain.Model;
using Application.DTO;

using Microsoft.EntityFrameworkCore;
using Domain.IRepository;
using Domain.Model.OperationType;

public class OperationTypeService {

    private readonly IOperationTypeRepository _operationTypeRepository;
    
    
    public OperationTypeService(IOperationTypeRepository operationRepository)
    {
        _operationTypeRepository = operationRepository;
    }

    public async Task<IEnumerable<OperationTypeDTO>> GetAll()
    {    
        IEnumerable<OperationType> operations = await _operationTypeRepository.GetOperationsAsync();

        IEnumerable<OperationTypeDTO> operationsDTO = OperationTypeDTO.ToDTO(operations);
        IEnumerable<OperationTypeDTO> operationsDTOTrimmed = new List<OperationTypeDTO>();
        

        /*
        foreach(OperationTypeDTO operation in operationsDTO)
        {
            Console.WriteLine("OperationTypeService.GetAll: operation.Versions.Count = " + operation.Versions.Count);
            var latestVersion = operation.Versions.OrderByDescending(v => v.VersionNumber).FirstOrDefault();
            Console.WriteLine("OperationTypeService.GetAll: latestVersion = " + latestVersion.VersionNumber);
            if(latestVersion != null && latestVersion.Status)
            {
            operationsDTOTrimmed = operationsDTOTrimmed.Append(operation);
            }
        }*/

        //return operationsDTOTrimmed;

        return operationsDTO;
    }

    public async Task<OperationTypeDTO> GetByName(string name)
    {    
        OperationType operation =  await _operationTypeRepository.GetOperationByNameAsync(name);
        if(operation!=null)
        {
            OperationTypeDTO operationDTO = OperationTypeDTO.ToDTO(operation);
            return operationDTO;
        }
        return null;
    }

    public async Task<OperationTypeDTO> Add(OperationTypeDTO operationDTO, List<string> errorMessages)
    {

        bool bExists = await _operationTypeRepository.OperationExists(operationDTO.Name);
        if(bExists) {
            errorMessages.Add("Already exists");
            return null;
        }

        Console.WriteLine("OperationTypeService.Add: operationDTO.Versions.Pending = " + operationDTO.Versions[0].Pending);

        OperationType operation = OperationTypeDTO.ToDomain(operationDTO, operationDTO.Name);

        Console.WriteLine("OperationTypeService.Add: operation.Versions.Pending = " + operation.Versions.Min.Pending);


        OperationType operationSaved = await _operationTypeRepository.Add(operation);

        Console.WriteLine("OperationTypeService.Add: operationSaved.Versions.Pending = " + operationSaved.Versions.Min.Pending);


        OperationTypeDTO operDTO = OperationTypeDTO.ToDTO(operationSaved);

        Console.WriteLine("OperationTypeService.Add: operDTO.Versions.Pending = " + operDTO.Versions[0].Pending);

        return operDTO;
    }

    public async Task<OperationTypeDTO> Delete(string name, List<string> errorMessages)
    {
        OperationType operation = await _operationTypeRepository.GetOperationByNameAsync(name);

        if(operation == null){
            errorMessages.Add("Does not exist");
            return null;
        }

        operation.setStatus(false);

        OperationType operationDeleted = await _operationTypeRepository.Update(operation);
        OperationTypeDTO operationDTO = OperationTypeDTO.ToDTO(operationDeleted);

        return operationDTO;
    }

    public async Task<OperationTypeDTO> Update(OperationTypeDTO operationDTO, List<string> errorMessages)
    {
        Console.WriteLine("OperationTypeService.Update: operationDTO.Versions.Count = " + operationDTO.Versions.Count);
        OperationType operation = await _operationTypeRepository.GetOperationByNameAsync(operationDTO.Name);
        if(operation == null){
            errorMessages.Add("Does not exist");
            return null;
        }
        
        foreach(VersionDTO versionDTO in operationDTO.Versions)
        {
            bool repeated = false;
            foreach(Version version in operation.Versions)
            {
                if(versionDTO.VersionNumber == version.VersionNumber)
                {
                    repeated = true;
                }
            }
            if(repeated)
            {
                errorMessages.Add("Repeated version");
            }
            else
            {
                operation.AddVersion(VersionDTO.ToDomain(versionDTO));
            }
        }

        OperationType operationUpdated = await _operationTypeRepository.Update(operation);
        Console.WriteLine("L106 OperationTypeService.Update: operationUpdated.Versions.Count = " + operationUpdated.Versions.Count);
        OperationTypeDTO operationDTOUpdated = OperationTypeDTO.ToDTO(operationUpdated);
        Console.WriteLine("OperationTypeService.Update: operationDTOUpdated.Versions.Count = " + operationDTOUpdated.Versions.Count);
        return operationDTOUpdated;
    }

}