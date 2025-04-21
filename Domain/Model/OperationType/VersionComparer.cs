namespace Domain.Model.OperationType
{
    public class VersionComparer : IComparer<IVersion>
    {
        public int Compare(IVersion x, IVersion y)
        {
            return x.Compare(y);
        }
    }
}