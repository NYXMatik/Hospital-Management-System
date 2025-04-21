namespace Application.Services;

using Domain.Model;
using Application.DTO;
using Domain.IRepository;

using System.Collections.Generic;
using System.Threading.Tasks;
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;

public class PatientService {

    private readonly IPatientRepository _patientRepository;
    //private readonly IEmailService _emailService;

    //Patient User
    private readonly HttpClient _httpClient;
    // Secret key for JWT (should be stored securely in production, e.g., in configuration files or vault)
    private const string JwtSecretKey = "YourSuperSecretKey";


    public PatientService(IPatientRepository patientRepository/*, IEmailService emailService, HttpClient httpClient*/) {
        _patientRepository = patientRepository;
        //_emailService = emailService;

        //Patient User
        //_httpClient = httpClient;
    }

    public async Task<IEnumerable<PatientDTO>> GetAll(){
        IEnumerable<Patient> patients = await _patientRepository.GetPatientsAsync();

        IEnumerable<PatientDTO> patientsDTO = PatientDTO.ToDTO(patients);

        return patientsDTO;
    }

    public async Task<IEnumerable<PatientDTO>> GetAllInactive(){
        IEnumerable<Patient> patients = await _patientRepository.GetPatientsInactiveAsync();

        IEnumerable<PatientDTO> patientsDTO = PatientDTO.ToDTO(patients);

        return patientsDTO;
    }

    public async Task<PatientInformationDTO> GetByEmail(string strEmail)
    {
        Patient patient =  await _patientRepository.GetPatientByEmailAsync(strEmail);

        if(patient!=null)
        {
            PatientInformationDTO patientDTO = PatientInformationDTO.ToDTO(patient);
            return patientDTO;
        }
        return null;
    }

    public async Task<PatientInformationDTO> GetByPhone(string strPhone)
    {
        Patient patient =  await _patientRepository.GetPatientByPhoneAsync(strPhone);

        if(patient!=null)
        {
            PatientInformationDTO patientDTO = PatientInformationDTO.ToDTO(patient);
            return patientDTO;
        }
        return null;
    }

    public async Task<List<PatientInformationDTO>> GetByName(string strName)
    {
        var patients = await _patientRepository.GetPatientByNameAsync(strName);

        if (patients != null && patients.Any())
        {
            var patientDTOs = patients.Select(PatientInformationDTO.ToDTO).ToList();
            return patientDTOs;
        }

        return new List<PatientInformationDTO>();
    }

    public async Task<List<PatientInformationDTO>> GetByGender(string strGender)
    {
        var patients = await _patientRepository.GetPatientByGenderAsync(strGender);

        if (patients != null && patients.Any())
        {
            var patientDTOs = patients.Select(PatientInformationDTO.ToDTO).ToList();
            return patientDTOs;
        }

        return new List<PatientInformationDTO>();
    }

    public async Task<List<PatientInformationDTO>> GetByBirth(string strBirth)
    {
        var patients = await _patientRepository.GetPatientByBirthAsync(strBirth);

        if (patients != null && patients.Any())
        {
            var patientDTOs = patients.Select(PatientInformationDTO.ToDTO).ToList();
            return patientDTOs;
        }

        return new List<PatientInformationDTO>();
    }


    public async Task<PatientDTO> GetById(string medicalRecordNumber)
    {
        Patient patient = await _patientRepository.GetPatientByIdAsync(medicalRecordNumber);

        if(patient!=null && patient.Active)
        {
            PatientDTO patientDTO = PatientDTO.ToDTO(patient);
            return patientDTO;
        }
        return null;
    }


    public async Task<PatientDTO> Add(PatientCreateDTO patientDTO, List<string> errorMessages)
    {
        string medicalRecordNum = await GenerateMedicalRecordNumber();

        bool exists = await _patientRepository.PatientExists(medicalRecordNum);
        if(exists) {
            errorMessages.Add("Already exists.");
            return null;
        }

        bool existsEmail = await _patientRepository.EmailExists(patientDTO.Email);
        if(existsEmail) {
            errorMessages.Add("Invalid Contacts: Email must be unique!");
            return null;
        }

        bool existsPhone = await _patientRepository.PatientExists(patientDTO.PhoneNumber);
        if(existsPhone) {
            errorMessages.Add("Invalid Contacts: Phone Number must be unique!");
            return null;
        }

        Patient patient = PatientCreateDTO.ToDomain(patientDTO, medicalRecordNum);

        Patient patientSaved = await _patientRepository.Add(patient);

        return PatientDTO.ToDTO(patientSaved);
    }


    public async Task<string> GenerateMedicalRecordNumber(){

        var actualDateTime = DateTime.Now; // Usando a data atual
        var yearMonth = actualDateTime.ToString("yyyyMM");
        int maxExistingNumber = await _patientRepository.GetMaxMedicalRecordNumberAsync(yearMonth);
        int newRecordNumber = maxExistingNumber + 1;
        return $"{yearMonth}{newRecordNumber:D6}";
    }


    public async Task<IEnumerable<AuditLogDTO>> GetAuditLogsForPatientAsync(string medicalRecordNum)
    {
        var patient = await _patientRepository.GetPatientWithLogsAsync(medicalRecordNum);

        // Mapeia os logs de auditoria para DTOs
        var auditLogsDTO = patient.AuditLogs
            .Select(log => AuditLogDTO.FromDomain(log))
            .ToList();

        return auditLogsDTO;
    }


    public async Task<PatientDTO> Update(string id, PatientUpdateDTO patientUpDTO, List<string> errorMessages)
    {
        Patient patient = await _patientRepository.GetPatientByIdAsync(id);

        if(patient != null && patient.Active)
        {
            var oldEmail = patient.GetEmail();
            var oldPhoneNumber = patient.GetPhone();
            var oldFullName = patient.GetFullName();
            var oldBirth = patient.GetBirth();
            var oldEmerContact = patient.GetEmerPhone();

            PatientDTO.UpdateToDomain(patient, patientUpDTO);

            // Lista para manter os logs de auditoria
            var auditLogs = new List<PatientAuditLog>();

            //if (oldFullName != patientUpDTO.FullName)
                //auditLogs.Add(new PatientAuditLog("Name", oldFullName, patient.GetFullName()));

            if (oldEmail != patientUpDTO.Email){
                
                bool emailExists = await _patientRepository.EmailExists(patientUpDTO.Email);
                if(emailExists) {
                    errorMessages.Add("Email already exists.");
                    return null;
                }
                //auditLogs.Add(new PatientAuditLog("Email", oldEmail, patient.GetEmail()));

                // Comparar campos sensíveis e enviar notificação se necessário
                //await _emailService.SendNotificationEmailAsync(patient.GetEmail());
            }

            if (oldPhoneNumber != patientUpDTO.PhoneNumber){

                bool phoneNumberExists = await _patientRepository.PhoneExists(patientUpDTO.PhoneNumber);
                if(phoneNumberExists) {
                    errorMessages.Add("Phone number already exists.");
                    return null;
                }
                //auditLogs.Add(new PatientAuditLog("PhoneNumber", oldPhoneNumber, patient.GetPhone()));

                // Comparar campos sensíveis e enviar notificação se necessário
                //await _emailService.SendNotificationEmailAsync(patient.GetEmail());
            }

            //if (oldBirth != patientUpDTO.Birth)
                //auditLogs.Add(new PatientAuditLog("Birth", oldBirth, patient.GetBirth()));

            //if (oldEmerContact != patientUpDTO.EmergencyContact)
                //auditLogs.Add(new PatientAuditLog("Emergency Contact", oldEmerContact, patient.GetEmerPhone()));


            await _patientRepository.Update(patient, errorMessages);

            // Comparar campos sensíveis e enviar notificação se necessário
            if ((oldEmail != patient.GetEmail()) || (oldPhoneNumber != patient.GetPhone()))
            {
                //await _emailService.SendNotificationEmailAsync(patient.GetEmail());
            }

            PatientDTO patientDTO = PatientDTO.ToDTO(patient);

            return patientDTO;
        }
        else
        {
            errorMessages.Add("Not found");
            return null;
        }
    }


    public async Task<bool> InactivateAsync(string medicalRecordNum)
    {
        var patient = await _patientRepository.GetPatientByIdAsync(medicalRecordNum);

        if (patient == null || !patient.Active)
            return false;

        patient.MarkAsInative();

        await _patientRepository.InactivateAsync(patient);

        return true;
    }

    public async Task<PatientDTO> DeleteAsync(string medicalRecordNum, List<string> errorMessages)
    {
        var patient = await _patientRepository.GetPatientByIdAsync(medicalRecordNum);

        if (patient == null){
            errorMessages.Add("Patient not found.");
            return null;
        }

        if (patient.Active /*&& dataInativação >= 5 anos*/){
            errorMessages.Add("It is not possible to delete an active patient.");
            return null;
        }

        await _patientRepository.DeleteAsync(patient);

        return PatientDTO.ToDTO(patient);
    }

    public async Task<IEnumerable<PatientDTO>> FilterPatientsAsync(string? name, string? email, string? phone, string? birth, string? gender){

        var patients = await _patientRepository.GetFilteredPatientsAsync(name, email, phone, birth, gender);

        if (patients != null && patients.Any())
        {
            var patientsDTO = patients.Select(PatientDTO.ToDTO).ToList();

            return patientsDTO;
        }

        return new List<PatientDTO>();
    }


}
