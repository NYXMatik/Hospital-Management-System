namespace Domain.Model.OperationType;

public interface IVersion
{
    int Compare(IVersion version2);

    int GetVersion();

    bool GetPending();

    bool GetStatus();

    void SetVersion(int version);

    void AddPhase(Phase phase);

    void EditPhases(string oldPhaseName, Phase editedPhase);

    void RemovePhase(Phase phase);

    void ChangeStatus(bool status);

    void ChangePending(bool status);
    DateOnly GetStartDate();
}