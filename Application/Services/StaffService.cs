namespace Application.Services;

using Domain.Model;
using Application.DTO;

using Domain.IRepository;
using Application.Common;

public class StaffService {
    private readonly IStaffRepository _staffRepository;
    private readonly ISpecializationRepository _specializationRepository;
    private readonly IStaffIdGenerator _staffIdGenerator;
    
    public StaffService(IStaffRepository staffRepository, ISpecializationRepository specializationRepository, IStaffIdGenerator staffIdGenerator) {
        _staffRepository = staffRepository;
        _specializationRepository = specializationRepository;
        _staffIdGenerator = staffIdGenerator;
    }

    public async Task<PresentStaffDTO> Add(CreateStaffDTO staffDTO, List<string> errorMessages)
    {
        bool licenseNumberExists = await _staffRepository.StaffExists(staffDTO.LicenseNumber);
        if(licenseNumberExists) {
            errorMessages.Add("Staff with the same License Number already exists.");
            return null;
        }
        bool contactsExists = await _staffRepository.EmailAndPhoneExists(staffDTO.Email, staffDTO.PhoneNumber);
        if(contactsExists) {
            errorMessages.Add("The contact information, email and phone number, are invalide.");
            return null;
        }

        // Reference to specialization, to be passed toDomain
        //Specialization spe = await GetValidSpecializationAsync(staffDTO.Specialization);

        string staffId = await _staffIdGenerator.GenerateStaffId(staffDTO.RecruitmentYear, staffDTO.Category);        

        Staff staff = CreateStaffDTO.ToDomain(staffDTO, staffId/*, specialization*/);

        Staff staffSaved = await _staffRepository.Add(staff);

        PresentStaffDTO staffDTO1 = PresentStaffDTO.ToDTO(staffSaved);

        return staffDTO1;
    }

    public async Task<Result<Specialization>> GetValidSpecializationAsync(string specializationName)
    {
        // Verify and get reference of specialization
        var specialization = await _specializationRepository.GetSpecializationAsync(specializationName);

        // Verifies if specialization exists
        if (specialization == null)
        {
            // In case specialization not found
            //throw new InvalidOperationException($"Specialization '{specializationName}' does not exist.");
            return Result<Specialization>.Fail($"Specialization '{specializationName}' does not exist.");
        }

        return Result<Specialization>.Success(specialization);
    }


    public async Task<IEnumerable<PresentStaffDTO>> GetAll()
    {    
        IEnumerable<Staff> staffs = await _staffRepository.GetStaffsAsync();

        IEnumerable<PresentStaffDTO> staffsDTO = PresentStaffDTO.ToDTO(staffs);

        return staffsDTO;
    }

    public async Task<PresentStaffDTO> GetById(string id)
    {    
        Staff staff = await _staffRepository.GetStaffByIdAsync(id);

        if(staff!=null && staff.Active==true)
        {
            PresentStaffDTO staffDTO = PresentStaffDTO.ToDTO(staff);
            return staffDTO;
        }
        return null;
    }

    public async Task<ListStaffDTO> GetByEmail(string email)
    {    
        Staff staff =  await _staffRepository.GetStaffByEmailAsync(email);

        if(staff!=null && staff.Active==true)
        {
            ListStaffDTO staffDTO = ListStaffDTO.ToDTO(staff);
            return staffDTO;
        }
        return null;
    }

    public async Task<IEnumerable<ListStaffDTO>> GetByName(string name)
    {    
        var staffs = await _staffRepository.GetStaffByNameAsync(name);

        if (staffs != null && staffs.Any())
        {
            var staffsDTO = ListStaffDTO.ToDTO(staffs);

            return staffsDTO;
        }

        return new List<ListStaffDTO>();
    }

    public async Task<IEnumerable<ListStaffDTO>> GetBySpecialization(string specialization)
    {    
        var staffs = await _staffRepository.GetStaffBySpecializationAsync(specialization);

        if (staffs != null && staffs.Any())
        {
            var staffsDTO = ListStaffDTO.ToDTO(staffs);

            return staffsDTO;
        }

        return new List<ListStaffDTO>();
    }

    public async Task<PresentStaffDTO> Update(string id, UpdateStaffDTO staffUpdateDTO, List<string> errorMessages)
    {
        Staff staff = await _staffRepository.GetStaffByIdAsync(id);

        if(staff != null && staff.Active==true)
        {
            var oldEmail = staff.GetEmail();
            var oldPhoneNumber = staff.GetPhoneNumber();
            var oldSpecialization = staff.GetSpecialization();

            // Lista para manter os logs de auditoria
            var auditLogs = new List<StaffAuditLog>();

            if (oldEmail != staffUpdateDTO.Email){

                bool emailExists = await _staffRepository.EmailExists(staffUpdateDTO.Email);
                if(emailExists) {
                    errorMessages.Add("Email already exists.");
                    return null;
                }

                // Creates a log to email update
                //auditLogs.Add(new StaffAuditLog("Email", oldEmail, staff.GetEmail()));
            }
                
            if (oldPhoneNumber != staffUpdateDTO.PhoneNumber){

                bool phoneNumberExists = await _staffRepository.PhoneExists(staffUpdateDTO.PhoneNumber);
                if(phoneNumberExists) {
                    errorMessages.Add("Phone number already exists.");
                    return null;
                }
                // Creates a log to phone number update
                //auditLogs.Add(new StaffAuditLog("PhoneNumber", oldPhoneNumber, staff.GetPhoneNumber()));
            }
                
            if (oldSpecialization != staffUpdateDTO.Specialization){}
                // Creates a log to specialization update
                //auditLogs.Add(new StaffAuditLog("Specialization", oldSpecialization, staff.GetSpecialization()));

            PresentStaffDTO.UpdateToDomain(staff, staffUpdateDTO, id, auditLogs);

            Staff staffUpdated = await _staffRepository.Update(staff, errorMessages);

            PresentStaffDTO staffDTOUpdated = PresentStaffDTO.ToDTO(staffUpdated);

            // any changes to contact information trigger a confirmation email to the staff member
            if ((oldEmail != staff.GetEmail()) || (oldPhoneNumber != staff.GetPhoneNumber()))
            {
                //await _emailService.SendNotificationEmailAsync(staff.GetEmail());
            }

            return staffDTOUpdated;
        }
        else
        {
            errorMessages.Add("Staff not found.");
            return null;
        }
    }

    public async Task<IEnumerable<AuditLogDTO>> GetAuditLogsForStaffAsync(string id)
    {
        var staff = await _staffRepository.GetStaffWithLogsAsync(id);

        var auditLogsDTO = staff.AuditLogs
            .Select(log => AuditLogDTO.FromDomain_Staff(log))
            .ToList();

        return auditLogsDTO;
    }

    public async Task<bool> InactivateAsync(string id, List<string> errorMessages)
    {
        Staff staff = await _staffRepository.GetStaffByIdAsync(id); 

        if (staff == null || staff.Active!=true)
        {
             errorMessages.Add("Staf not found.");
            return false;  
            
        }else{

            staff.MarkAsInactive();
        
            await _staffRepository.InactivateAsync(staff);

            return true;
        }
                
    }

    public async Task<IEnumerable<PresentStaffDTO>> FilterStaffsAsync(string? name, string? email, string? specialization){

        var staffs = await _staffRepository.GetFilteredStaffsAsync(name, email, specialization);

        if (staffs != null && staffs.Any())
        {
            var staffsDTO = PresentStaffDTO.ToDTO(staffs);

            return staffsDTO;
        }

        return new List<PresentStaffDTO>();
    }
}