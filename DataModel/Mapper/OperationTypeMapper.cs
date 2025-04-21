namespace DataModel.Mapper;

using DataModel.Model;

using Domain.Model;
using Domain.Factory;
using Domain.Model.OperationType;


public class OperationTypeMapper
{
    private IOperationTypeFactory _operationTypeFactory;

    public OperationTypeMapper(IOperationTypeFactory operationTypeFactory)
    {
        _operationTypeFactory = operationTypeFactory;
    }

    public OperationType ToDomain(OperationTypeDataModel operationDM)
    {

        SortedSet<Version> versions = new SortedSet<Version>(new VersionComparer());
        foreach(VersionDataModel versionDM in operationDM.Versions)
        {
            SortedSet<Phase> phases = new SortedSet<Phase>(new PhaseComparer());
            foreach(PhaseDataModel phaseDM in versionDM.Phases)
            {
                List<RequiredStaff> requiredStaff = new List<RequiredStaff>();
                foreach(RequiredStaffDataModel requiredStaffDM in phaseDM.StaffList)
                {
                    RequiredStaff requiredStaffDomain = new RequiredStaff(requiredStaffDM.Specialty, requiredStaffDM.Role, requiredStaffDM.Quantity);
                    requiredStaff.Add(requiredStaffDomain);
                }
                Phase phaseDomain = new Phase(phaseDM.Name, phaseDM.Description, phaseDM.PhaseStep,  phaseDM.Duration, requiredStaff);
                phases.Add(phaseDomain);
            }
            Version versionDomain = new Version(versionDM.VersionNumber, versionDM.Date, versionDM.Status, versionDM.Pending, phases);
            versions.Add(versionDomain);
        }

        OperationType operationDomain = _operationTypeFactory.NewOperation(operationDM.Name, versions);

        //OperationType operationDomain = _operationTypeFactory.NewOperation(operationDM.Name);
        return operationDomain;
    }

    public IEnumerable<OperationType> ToDomain(IEnumerable<OperationTypeDataModel> operationsDataModel)
    {

        List<OperationType> operationsDomain = new List<OperationType>();

        foreach(OperationTypeDataModel operationDataModel in operationsDataModel)
        {
            OperationType operationDomain = ToDomain(operationDataModel);

            operationsDomain.Add(operationDomain);
        }

        return operationsDomain.AsEnumerable();
    }

    public OperationTypeDataModel ToDataModel(OperationType operation)
    {
        OperationTypeDataModel operationDataModel = new OperationTypeDataModel(operation);

        return operationDataModel;
    }


}