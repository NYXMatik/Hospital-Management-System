namespace DataModel.Repository;

using DataModel.Mapper;

using Domain.Model;
using Domain.IRepository;
using DataModel.Model;
using Microsoft.EntityFrameworkCore;

public class SpecializationRepository : GenericRepository<Specialization>, ISpecializationRepository
{    
    SpecializationMapper _specializationMapper;
    public SpecializationRepository(GenericContext context, SpecializationMapper mapper) : base(context!)
    {
        _specializationMapper = mapper;
    }

    public async Task<IEnumerable<Specialization>> GetAllAsync()
    {
        try {
            IEnumerable<SpecializationDataModel> specializationsDataModel = await _context.Set<SpecializationDataModel>()
                    .ToListAsync();

            IEnumerable<Specialization> specializations = _specializationMapper.ToDomain(specializationsDataModel);

            return specializations;
        }
        catch
        {
            throw;
        }
    }

    public async Task<bool> SpecializationExists(string specialization)
    {
        return await _context.Set<SpecializationDataModel>().AnyAsync(s => s.Name == specialization);
    }

    public async Task<Specialization> GetSpecializationAsync(string specialization)
    {
        try {
            SpecializationDataModel specializationDataModel = await _context.Set<SpecializationDataModel>()
                    .FirstAsync(s => s.Name.Equals(specialization, StringComparison.OrdinalIgnoreCase));

            Specialization specialization1 = _specializationMapper.ToDomain(specializationDataModel);

            return specialization1;
        }
        catch
        {
            return null;//throw;
        }
    }

}