namespace Domain.Factory;

using Domain.Model;

public interface ISpecializationFactory
{
    Specialization NewSpecialization(/*long id,*/ string name, string description);
}