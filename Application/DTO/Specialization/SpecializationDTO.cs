namespace Application.DTO;

using Domain.Model;

public class SpecializationDTO
{
	//public long Id { get; set; }
	public string Name { get; set; }
    public string Description { get; set; }
	
	public SpecializationDTO() {
	}

	public SpecializationDTO(/*long id,*/ string name, string description)
	{
		//Id = id;
		Name = name;
        Description = description;
	}

	static public SpecializationDTO ToDTO(Specialization specialization) {

		SpecializationDTO specializationDTO = new SpecializationDTO(/*specialization.getId(),*/ specialization.GetName(),
		 									specialization.GetDescription());

		return specializationDTO;
	}

	static public IEnumerable<SpecializationDTO> ToDTO(IEnumerable<Specialization> specializations)
	{
		List<SpecializationDTO> specializationsDTO = new List<SpecializationDTO>();

		foreach( Specialization specialization in specializations ) {
			SpecializationDTO specializationDTO = ToDTO(specialization);

			specializationsDTO.Add(specializationDTO);
		}

		return specializationsDTO;
	}

	static public SpecializationDTO ToDomain(SpecializationDTO specializationDTO) {
		
        SpecializationDTO specialization = new SpecializationDTO(/*specializationDTO.Id,*/ specializationDTO.Name, 
															specializationDTO.Description);

		return specialization;
	}

	
}