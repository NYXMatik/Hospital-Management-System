using Domain.Model;
using DataModel.Repository;
using System.Collections.Generic;
using System.Threading.Tasks;
using DataModel.Model;
using Application.DTO;
using DataModel.Mapper;
using Google.Apis.Auth;
using Application.Services;

public class PatientAccountService
{
   private readonly IPatientAccountRepository _patientAccountRepository;
    private readonly PatientAccountMapper _patientAccountMapper;
    private readonly IAuditLogRepository _auditLogRepository;
    private readonly IEmailService _emailService;
    private readonly PatientService _patientService;

    public PatientAccountService(
        IPatientAccountRepository patientAccountRepository, 
        PatientAccountMapper patientAccountMapper, 
        IAuditLogRepository auditLogRepository,
        IEmailService emailService,
        PatientService patientService)
    {
        _patientAccountRepository = patientAccountRepository;
        _patientAccountMapper = patientAccountMapper;
        _auditLogRepository = auditLogRepository ?? throw new ArgumentNullException(nameof(auditLogRepository));
        _emailService = emailService ?? throw new ArgumentNullException(nameof(emailService));
        _patientService = patientService;
    }

    public async Task<PatientAccount> GetPatientAccountByIdAsync(string id)
    {
        return await _patientAccountRepository.GetByIdAsync(id);
    }

    public async Task<PatientAccount> GetPatientAccountByEmailAsync(string email)
    {
        return await _patientAccountRepository.GetByEmailAsync(email);
    }
    public async Task<Application.DTO.AppointmentDTO?> GetAppointmentByIdAsync(string Id, List<string> errorMessages)
    {
        try
        {
            var appointments = await _patientAccountRepository.GetAppointmentsByIdAsync(Id);
            
            if (appointments == null || !appointments.Any())
            {
                errorMessages.Add("No appointments found for the given ID.");
                return null; 
            }

            var appointment = appointments.FirstOrDefault(a => a.AppointmentId == Id);

            if (appointment == null)
            {
                errorMessages.Add("Appointment not found.");
                return null; 
            }

            var appointmentDTO = new Application.DTO.AppointmentDTO(
                appointment.AppointmentId,
                appointment.PatientId,
                appointment.AppointmentDate,
                appointment.Description,
                appointment.Doctor,
                appointment.Status
            );

            return appointmentDTO;
        }
        catch (Exception ex)
        {
            // Manejar el error de manera más detallada si es necesario
            errorMessages.Add($"Error retrieving appointment: {ex.Message}");
            return null;
        }
    }


    public async Task<PatientAccount?> RegisterPatientWithGoogleAsync(string idToken, List<string> errorMessages)
    {
        var userPayload = await VerifyGoogleToken(idToken);

        var existingAccount = await _patientAccountRepository.GetByEmailAsync(userPayload.Email);
        if (existingAccount != null)
        {
            errorMessages.Add("Email is already in use.");
            return null;
        }

        string profileId = Guid.NewGuid().ToString();

        try
        {
            var newPatientAccount = new PatientAccount(
                profileId,
                userPayload.FullName,
                userPayload.Email,
                "", // Phone number can be empty or you can ask for it later
                "", // Birth date can be empty or you can ask for it later
                false,
                null // Address can be empty or you can ask for it later
            );

            var createdAccount = await _patientAccountRepository.AddAsync(newPatientAccount);

            string confirmationLink = $"http://localhost:5005/api/v1/PatientAccount/verify?email={userPayload.Email}&token={Guid.NewGuid()}";

            // Enviar el correo electrónico de verificación
            bool emailSent = await _emailService.SendVerificationEmail(userPayload.Email, confirmationLink);
            if (!emailSent)
            {
                errorMessages.Add("Failed to send verification email.");
            }

            return createdAccount;
        }
        catch (ArgumentException ex)
        {
            errorMessages.Add(ex.Message);
            return null;
        }
    }

    

    public async Task<IEnumerable<ListPatientAccountDTO>> GetAllPatientAccountsAsync()
    {
        IEnumerable<PatientAccount> patientAccounts = await _patientAccountRepository.GetAllAsync();
        IEnumerable<ListPatientAccountDTO> patientAccountDTOs = ListPatientAccountDTO.ToDTO(patientAccounts);
        return patientAccountDTOs;
    }

    public async Task<PatientAccount> AddPatientAccountAsync(PatientAccount patientAccount)
    {
        return await _patientAccountRepository.AddAsync(patientAccount);
    }

    public async Task<bool> DeletePatientAccountAsync(string id)
    {
        var account = await _patientAccountRepository.GetByIdAsync(id);
        if (account == null)
        {
            return false; 
        }

        await _patientAccountRepository.DeleteAsync(account);
        return true;
    }
    public async Task<PatientAccount?> AddAppointmentAsync(string profileId, AppointmentCreateDTO appointmentCreateDTO, List<string> errorMessages)
    {
        if (appointmentCreateDTO == null)
        {
            errorMessages.Add("AppointmentCreateDTO is required.");
            return null;
        }

        if (string.IsNullOrWhiteSpace(appointmentCreateDTO.Description))
        {
            errorMessages.Add("Description is required.");
        }

        if (errorMessages.Any())
        {
            return null;
        }
        var patientAccount = await _patientAccountRepository.GetByIdAsync(profileId);
        if (patientAccount == null)
        {
            errorMessages.Add("Patient account not found.");
            return null;
        }

        try
        {
            var doctor = appointmentCreateDTO.Doctor ?? "Unassigned"; 
            var status = appointmentCreateDTO.Status ?? "Pending";

            var appointment = new Appointment(
                appointmentId: Guid.NewGuid().ToString(),
                patientId: profileId,
                appointmentDate: appointmentCreateDTO.AppointmentDate,
                description: appointmentCreateDTO.Description,
                doctor: doctor,
                status: status
            );

            if (patientAccount.Appointments == null)
            {
                patientAccount.UpdateAppointments(new List<Appointment>()); 
            }

            patientAccount.AddAppointment(appointment);

            await _patientAccountRepository.UpdateAsync(patientAccount, errorMessages);
            if (errorMessages.Any())
        {
            return null;
        }
            return patientAccount;
        }
        catch (Exception ex)
        {
            errorMessages.Add($"Error adding appointment: {ex.Message}");
            return null;
        }
    }






    public async Task<PatientAccountDTO> UpdatePatientAccountAsync(string id, PatientAccountUpdateDTO updateDTO, List<string> errorMessages, string changedBy)
    {
        PatientAccount existingAccount = await _patientAccountRepository.GetByIdAsync(id);

        if (existingAccount == null)
        {
            errorMessages.Add("Patient account not found.");
            return null;
        }

        PatientAccountDTO.UpdateToDomain(existingAccount, updateDTO);
        await _patientAccountRepository.UpdateAsync(existingAccount,errorMessages);
        PatientAccountDTO p = PatientAccountDTO.ToDTO(existingAccount);
        return p;
    }


   public async Task<PatientAccount?> RegisterPatientAccountAsync(PatientAccountCreateDTO createDTO, List<string> errorMessages)
    {
        
        if (string.IsNullOrEmpty(createDTO.FullName) || string.IsNullOrEmpty(createDTO.Email) || string.IsNullOrEmpty(createDTO.Phone))
        {
            errorMessages.Add("Required fields are missing.");
            return null;
        }
        /*
        var accoun = await _patientService.GetByEmail(createDTO.Email);
        if (accoun == null)
        {
            errorMessages.Add("Email is not linked to a patient.");
            return null;
        }*/
        var existingAccount = await _patientAccountRepository.GetByEmailAsync(createDTO.Email);
        if (existingAccount != null)
        {
            errorMessages.Add("Email is already in use.");
            return null;
        }

        string profileId = Guid.NewGuid().ToString();

        try
        {

            var newPatientAccount = new PatientAccount(
                profileId, 
                createDTO.FullName, 
                createDTO.Email, 
                createDTO.Phone, 
                createDTO.BirthDate,
                false, 
                createDTO.Address 
            );

            var createdAccount = await _patientAccountRepository.AddAsync(newPatientAccount);

            /*
            string confirmationLink = $"http://localhost:5005/api/v1/PatientAccount/verify?email={createDTO.Email}&token={Guid.NewGuid()}";

            // Enviar el correo electrónico de verificación
            bool emailSent = await _emailService.SendVerificationEmail(createDTO.Email, confirmationLink);
            if (!emailSent)
            {
                errorMessages.Add("Failed to send verification email.");
            }
            */
            return createdAccount;
        }
        catch (ArgumentException ex)
        {
            errorMessages.Add(ex.Message);
            return null;
        }
    }
    public async Task<PatientAccount> VerifyEmailAsync(string email, string token, List<string> errorMessages)
    {
        var account = await _patientAccountRepository.GetByEmailAsync(email);
        if (account == null)
        {
            errorMessages.Add("Account not found.");
            return null;
        }

        account.UpdateIsEmailVerified(true);
        await _patientAccountRepository.UpdateAsync(account, errorMessages);
        var updatedAccount = await _patientAccountRepository.GetByEmailAsync(email);


        return updatedAccount;
    }
    private async Task<GoogleUserPayload> VerifyGoogleToken(string idToken)
    {
        try
        {
            // Configuración para la validación
            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { "1035865566391-1gfqd9vngkrs6bkq5g6d10skpfrhn7ad.apps.googleusercontent.com" } // Tu client ID
            };

            // Validar el token
            var payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);

            // Retornar los datos del usuario
            return new GoogleUserPayload(
                email: payload.Email,
                fullName: payload.Name
            );
        }
        catch (InvalidJwtException ex)
        {
            // Token inválido (firma no válida, expirado, etc.)
            throw new InvalidOperationException("Invalid Google ID Token", ex);
        }
        catch (Exception ex)
        {
            // Otros errores
            throw new InvalidOperationException("Error verifying Google ID Token", ex);
        }
    }

        public async Task<LoginResponseDTO?> LoginWithGoogleAsync(string idToken, List<string> errorMessages)
    {
        try
        {
            // Step 1: Verify Google Token
            var userPayload = await VerifyGoogleToken(idToken);

            // Step 2: Check if the patient account exists
            var patientAccount = await _patientAccountRepository.GetByEmailAsync(userPayload.Email);
            if (patientAccount == null)
            {
                errorMessages.Add("Account not found.");
                return null;
            }

            // Step 3: Return the login response (no token, just the account info)
            return new LoginResponseDTO
            {
                ProfileId = patientAccount.ProfileId,
                FullName = patientAccount.Name.FullName,
                Email = patientAccount.ContactInfo.Email
            };
        }
        catch (Exception ex)
        {
            errorMessages.Add("Error during Google login: " + ex.Message);
            return null;
        }
    }
}
