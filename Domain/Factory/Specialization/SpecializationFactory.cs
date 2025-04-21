namespace Domain.Factory;

using Domain.Model;

public class SpecializationFactory : ISpecializationFactory
{
    public Specialization NewSpecialization(/*long id,*/ string name, string description)
    {
        return new Specialization(/*id,*/ name, description);
    }
    
}