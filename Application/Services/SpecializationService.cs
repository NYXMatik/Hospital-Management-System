namespace Application.Services;

using Application.DTO;
using Domain.IRepository;
using Domain.Model;

public class SpecializationService 
{
    private readonly ISpecializationRepository _specializationRepository;

    public SpecializationService(ISpecializationRepository specializationRepository)
    {
        _specializationRepository = specializationRepository;
    }

    public async Task<IEnumerable<SpecializationDTO>> GetAllSpecializations()
    {    
        IEnumerable<Specialization> specializations = await _specializationRepository.GetAllAsync();

        IEnumerable<SpecializationDTO> specializationsDTO = SpecializationDTO.ToDTO(specializations);

        return specializationsDTO;
    }
}
