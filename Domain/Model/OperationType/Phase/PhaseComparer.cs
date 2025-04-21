namespace Domain.Model.OperationType
{
    public class PhaseComparer : IComparer<IPhase>
    {
        public int Compare(IPhase x, IPhase y)
        {
            return x.Compare(y);
        }
    }
}