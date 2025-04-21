namespace Domain.IRepository;

using Domain.Model;

public interface ISpecializationRepository : IGenericRepository<Specialization>
{
    Task<IEnumerable<Specialization>> GetAllAsync();

    Task<bool> SpecializationExists(string specialization);

    Task<Specialization> GetSpecializationAsync(string specialization);
}