namespace DataModel.Mapper;

using DataModel.Model;

using Domain.Model;
using Domain.Factory;

public class SpecializationMapper
{
    private ISpecializationFactory _specializationFactory;

    public SpecializationMapper(ISpecializationFactory specializationFactory)
    {
        _specializationFactory = specializationFactory;
    }

    public Specialization ToDomain(SpecializationDataModel specializationDM)
    {
        Specialization specializationDomain = _specializationFactory.NewSpecialization(/*specializationDM.Id, */
                            specializationDM.Name, specializationDM.Description);

        return specializationDomain;
    }

    public IEnumerable<Specialization> ToDomain(IEnumerable<SpecializationDataModel> specializationsDataModel)
    {
        List<Specialization> specializationsDomain = new List<Specialization>();

        foreach(SpecializationDataModel specializationDataModel in specializationsDataModel)
        {
            Specialization specializationDomain = ToDomain(specializationDataModel);

            specializationsDomain.Add(specializationDomain);
        }

        return specializationsDomain.AsEnumerable();
    }

       public SpecializationDataModel ToDataModel(Specialization specialization)
    {
        SpecializationDataModel specializationDataModel = new SpecializationDataModel(specialization);

        return specializationDataModel;
    }


}