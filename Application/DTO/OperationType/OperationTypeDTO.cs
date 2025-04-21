namespace Application.DTO;
using Domain.Model.OperationType;


public class OperationTypeDTO
{
    private string _name;
    public string Name
    {
        get { return _name; }
        set { _name = value; }
    }

    private List<VersionDTO> _versions;
    public List<VersionDTO> Versions
    {
        get { return _versions; }
        set { _versions = value; }
    }

    public OperationTypeDTO(){}
    
    public OperationTypeDTO(string name, List<VersionDTO> versions)
    {
        _name = name;
        _versions = versions;
    }

    static public OperationTypeDTO ToDTO(OperationType operation)
    {
        Console.WriteLine("L29 OperationTypeDTO.ToDTO: operation.Version.Count = " + operation.Versions.Count);
        List<VersionDTO> versions = new List<VersionDTO>();
        foreach (Version version in operation.Versions)
        {
            versions.Add(VersionDTO.ToDTO(version));
        }

        return new OperationTypeDTO(operation.getName(), versions);
    }


    static public IEnumerable<OperationTypeDTO> ToDTO(IEnumerable<OperationType> operations)
	{
        List<OperationTypeDTO> operationsDTO = new List<OperationTypeDTO>();
        foreach(OperationType operation in operations)
        {
            OperationTypeDTO operationDTO = ToDTO(operation);
            operationsDTO.Add(operationDTO);
        }
        return operationsDTO;
    }

	static public OperationType ToDomain(OperationTypeDTO operationDTO, string name) {
		
        Console.WriteLine("OperationTypeDTO.ToDomain: operationDTO.Version.Pending: " + operationDTO.Versions[0].Pending);

        SortedSet<Version> versions = new SortedSet<Version>(new VersionComparer());
        foreach (VersionDTO versionDTO in operationDTO.Versions)
        {
            Console.WriteLine("OperationTypeDTO.ToDomain: versionDTO.VersionNumber: " + versionDTO.VersionNumber);
            Console.WriteLine("OperationTypeDTO.ToDomain: versionDTO.Pending: " + versionDTO.Pending);
            versions.Add(VersionDTO.ToDomain(versionDTO));

        }

		OperationType operation = new OperationType(operationDTO.Name, versions); //Add versions again

		return operation;
	}
}