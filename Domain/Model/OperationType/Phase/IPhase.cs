namespace Domain.Model.OperationType;

public interface IPhase
{
    int Compare(IPhase y);

    int GetPhaseStep();
}