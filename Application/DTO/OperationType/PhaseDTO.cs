using Domain.Model.OperationType;

namespace Application.DTO
{
    public class PhaseDTO
    {
        private string _name;
        public string Name
        {
            get { return _name; }
            set { _name = value; }
        }

        private string _description;
        public string Description
        {
            get { return _description; }
            set { _description = value; }
        }

        private TimeSpan _duration;
        public TimeSpan Duration
        {
            get { return _duration; }
            set { _duration = value; }
        }

        private int _phaseStep;
        public int PhaseStep
        {
            get { return _phaseStep; }
            set { _phaseStep = value; }
        }

        List<RequiredStaffDTO> _requiredStaff;
        public List<RequiredStaffDTO> StaffList
        {
            get { return _requiredStaff; }
            set { _requiredStaff = value; }
        }

        public PhaseDTO(){}
        
        public PhaseDTO(string name, string description, int phaseStep, TimeSpan duration, List<RequiredStaffDTO> requiredStaff)
        {
            _name = name;
            _description = description;
            _phaseStep = phaseStep;
            _duration = duration;
            _requiredStaff = requiredStaff;
        }

        static public PhaseDTO ToDTO(Phase phase)
        {
            List<RequiredStaffDTO> requiredStaff = new List<RequiredStaffDTO>();
            foreach (RequiredStaff staff in phase.StaffList)
            {
                requiredStaff.Add(RequiredStaffDTO.ToDTO(staff));
            }

            return new PhaseDTO(phase.Name, phase.Description, phase.PhaseStep, phase.Duration, requiredStaff);
        }

        static public IEnumerable<PhaseDTO> ToDTO(IEnumerable<Phase> phases)
        {
            List<PhaseDTO> phasesDTO = new List<PhaseDTO>();

            foreach( Phase phase in phases ) {
                PhaseDTO phaseDTO = ToDTO(phase);

                phasesDTO.Add(phaseDTO);
            }

            return phasesDTO;
        }

        static public Phase ToDomain(PhaseDTO phaseDTO)
        {
            List<RequiredStaff> requiredStaff = new List<RequiredStaff>();
            foreach (RequiredStaffDTO staff in phaseDTO.StaffList)
            {
                requiredStaff.Add(RequiredStaffDTO.ToDomain(staff));
            }

            return new Phase(phaseDTO.Name, phaseDTO.Description, phaseDTO.PhaseStep, phaseDTO.Duration, requiredStaff);
        }
    }
}