using System.Text;
using Domain.IRepository;
using Domain.Model;

public class PatientRegistrationService
{
    private readonly IExternalIAMService _externalIAMService;
    private readonly IEmailService _emailService;
    private readonly IPatientRepository _patientRepository;

    public PatientRegistrationService(IExternalIAMService externalIAMService, IEmailService emailService, IPatientRepository patientRepository)
    {
        _externalIAMService = externalIAMService;
        _emailService = emailService;
        _patientRepository = patientRepository;
    }

    public async Task RegisterPatient(Patient patient, List<string> errorMessages)
    {
        // 1. Register with IAM system
        var registrationResult = await _externalIAMService.RegisterUser(patient);
        
        if (!registrationResult.Success)
        {
            errorMessages.Add(registrationResult.ErrorMessage);
            return;
        }

        // 2. Send verification email
        var verificationToken = GenerateVerificationToken(patient.GetEmail());
        await _emailService.SendVerificationEmail(patient.GetEmail(), verificationToken);

        // 3. Save patient details (without marking email as verified yet)
        patient.IsEmailVerified = false;
        await _patientRepository.Add(patient);
    }

    private string GenerateVerificationToken(string email)
    {
        return Convert.ToBase64String(Encoding.UTF8.GetBytes(email + ":" + Guid.NewGuid()));
    }
}
