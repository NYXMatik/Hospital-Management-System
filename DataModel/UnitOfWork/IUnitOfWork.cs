using Domain.IRepository;

namespace UnitOfWork;

public interface IUnitOfWork : IDisposable
{
    IGenericRepository Generic { get; }

    IPatientRepository PatientRepository { get; }

    IStaffRepository StaffRepository { get; }

    ISpecializationRepository SpecializationRepository { get; }
    
    Task<int> CompleteAsync();
}
