namespace Domain.Factory;

using Domain.Model;
using Domain.Model.OperationType;

public class OperationTypeFactory : IOperationTypeFactory
{
    public OperationType NewOperation(string name, SortedSet<Version> versions)
    {
        Console.WriteLine("OperationTypeFactory.NewOperation: name = " + name);
        return new OperationType(name, versions);
    }

    /*public OperationType NewOperation(string name)
    {
        return new OperationType(name);
    }*/
}