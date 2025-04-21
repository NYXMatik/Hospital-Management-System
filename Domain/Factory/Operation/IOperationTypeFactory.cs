namespace Domain.Factory;


using Domain.Model;
using Domain.Model.OperationType;

public interface IOperationTypeFactory
{
    OperationType NewOperation(string name, SortedSet<Version> versions);

    //OperationType NewOperation(string name);

}