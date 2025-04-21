namespace DataModel.Repository;

using Microsoft.EntityFrameworkCore;

using DataModel.Model;
using DataModel.Mapper;

using Domain.Model;
using Domain.IRepository;
using Microsoft.EntityFrameworkCore.ChangeTracking;

public class PatientRepository : GenericRepository<Patient>, IPatientRepository
{    
    PatientMapper _patientMapper;
    public PatientRepository(GenericContext context, PatientMapper mapper) : base(context!)
    {
        _patientMapper = mapper;
    }

    public async Task<IEnumerable<Patient>> GetPatientsAsync()
    {
        try {
            IEnumerable<PatientDataModel> patientsDataModel = await _context.Set<PatientDataModel>()
                    .ToListAsync();

            IEnumerable<Patient> patients = _patientMapper.ToDomain(patientsDataModel);

            return patients;
        }
        catch
        {
            throw;
        }
    }

    public async Task<IEnumerable<Patient>> GetPatientsInactiveAsync()
    {
        try {
            IEnumerable<PatientDataModel> patientsDataModel = await _context.Set<PatientDataModel>()
                    .ToListAsync();

            IEnumerable<Patient> patients = _patientMapper.PInactiveToDomain(patientsDataModel);

            return patients;
        }
        catch
        {
            throw;
        }
    }

    public async Task<Patient> GetPatientByEmailAsync(string email)
    {
        try {
            PatientDataModel patientDataModel = await _context.Set<PatientDataModel>()
                    .FirstAsync(p => p.Contacts.Email == email);

            if(patientDataModel.Active){
                Patient patient = _patientMapper.ToDomain(patientDataModel);
                return patient;
            }else{
                return null;
            }
        }
        catch
        {
            return null;throw;
        }
    }

    public async Task<Patient> GetPatientByPhoneAsync(string phone)
    {
        try {
            PatientDataModel patientDataModel = await _context.Set<PatientDataModel>()
                    .FirstAsync(p => p.Contacts.PhoneNumber == phone);

            if(patientDataModel.Active){
                Patient patient = _patientMapper.ToDomain(patientDataModel);
                return patient;
            }else{
                return null;
            }
        }
        catch
        {
            return null;throw;
        }
    }

    public async Task<IEnumerable<Patient>> GetPatientByNameAsync(string name)
    {
        try
        {
            var patientsDataModel = await _context.Set<PatientDataModel>()
                    .Where(p => p.Name.FullName == name)
                    .ToListAsync();

            var patients = _patientMapper.ToDomain(patientsDataModel);

            return patients;
        }
        catch
        {
            return new List<Patient>();
        }
    }

    public async Task<IEnumerable<Patient>> GetPatientByGenderAsync(string gender)
    {
        try
        {   
            if(gender == "Male" || gender == "male"){
                var patientsDataModel = await _context.Set<PatientDataModel>()
                    .Where(p => p.Gender == Gender.Male)
                    .ToListAsync();
                
                var patients = _patientMapper.ToDomain(patientsDataModel);
                return patients;

            } else if (gender == "Female" || gender == "female") {
                var patientsDataModel = await _context.Set<PatientDataModel>()
                    .Where(p => p.Gender == Gender.Female)
                    .ToListAsync();
                
                var patients = _patientMapper.ToDomain(patientsDataModel);
                return patients;
            }
            return null;
            
        }
        catch
        {
            return new List<Patient>();
        }
    }

    public async Task<IEnumerable<Patient>> GetPatientByBirthAsync(string birth)
    {
        try
        {
            var patientsDataModel = await _context.Set<PatientDataModel>()
                    .Where(p => p.Birth == birth)
                    .ToListAsync();

            var patients = _patientMapper.ToDomain(patientsDataModel);

            return patients;
        }
        catch
        {
            return new List<Patient>();
        }
    }


    public async Task<Patient> GetPatientWithLogsAsync(string medicalRecordNum)
    {
        try
        {
            // Carregar o paciente e incluir os logs de auditoria relacionados
            var patientDataModel = await _context.Set<PatientDataModel>()
                .Include(p => p.AuditLogs)
                .FirstOrDefaultAsync(p => p.MedicalRecordNum == medicalRecordNum);

            // Verifica se o paciente foi encontrado
            if (patientDataModel == null)
            {
                throw new KeyNotFoundException($"Patient with MedicalRecordNum '{medicalRecordNum}' not found.");
            }

            // Mapeia o PatientDataModel para o domínio (classe Patient)
            var patient = _patientMapper.ToDomain(patientDataModel, patientDataModel.AuditLogs);

            return patient;
        }
        catch
        {
            return null;throw;
        }
    }


    public async Task<Patient> GetPatientByIdAsync(string medicalRecordNumber)
    {
        try {
            PatientDataModel patientDataModel = await _context.Set<PatientDataModel>()
                    .FirstAsync(p => p.MedicalRecordNum==medicalRecordNumber);
            if(patientDataModel.Active){
                Patient patient = _patientMapper.ToDomain(patientDataModel);
                return patient;
            }else{
                Patient patient = _patientMapper.ToDomain(patientDataModel);
                patient.MarkAsInative();
                return patient;
            }
        }
        catch
        {
            return null;//throw;
        }
    }

    public async Task<Patient> Add(Patient patient)
    {
        try {
            PatientDataModel patientDataModel = _patientMapper.ToDataModel(patient);

            EntityEntry<PatientDataModel> patientDataModelEntityEntry = _context.Set<PatientDataModel>().Add(patientDataModel);
            
            await _context.SaveChangesAsync();

            PatientDataModel patientDataModelSaved = patientDataModelEntityEntry.Entity;

            Patient patientSaved = _patientMapper.ToDomain(patientDataModelSaved);

            return patientSaved;    
        }
        catch
        {
            throw;
        }
    }

    public async Task<Patient> Update(Patient patient, List<string> errorMessages)
    {
        try {
            PatientDataModel patientDataModel = await _context.Set<PatientDataModel>()
                    .FirstAsync(p => p.MedicalRecordNum==patient.MedicalRecordNum);

            _patientMapper.UpdateDataModel(patientDataModel, patient);

            _context.Entry(patientDataModel).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return patient;
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await PatientExists(patient.MedicalRecordNum))
            {
                errorMessages.Add("Not found");
                
                return null;
            }
            else
            {
                throw;
            }

            //return null;
        }
        catch
        {
            throw;
        }
    }

    public async Task<bool> PatientExists(string id)
    {
        return await _context.Set<PatientDataModel>().AnyAsync(e => e.MedicalRecordNum == id);
    }

    public async Task<bool> EmailExists(string email)
    {
        return await _context.Set<PatientDataModel>().AnyAsync(p =>
            p.Contacts.Email == email);
    }
    public async Task<bool> PhoneExists(string phoneNumber)
    {
        return await _context.Set<PatientDataModel>().AnyAsync(p =>
            p.Contacts.PhoneNumber == phoneNumber);
    }


    // Método para obter o próximo número sequencial do MedicalRecordNumber
    public async Task<int> GetMaxMedicalRecordNumberAsync(string yearMonth)
    {
        try
        {
            var records = await _context.Set<PatientDataModel>()
                .Where(p => p.MedicalRecordNum.StartsWith(yearMonth))
                .ToListAsync(); 

            return records
                .Select(p => p.MedicalRecordNum.Length > 6 ? 
                    int.Parse(p.MedicalRecordNum.Substring(6, 6)) : 0)
                .DefaultIfEmpty(0)
                .Max();
        }
        catch
        {
            throw;
        }
    }

    public async Task<Patient> InactivateAsync(Patient patient)
    {
        try {
            
            PatientDataModel patientDataModel = await _context.Set<PatientDataModel>()
                    .FirstAsync(p => p.MedicalRecordNum == patient.MedicalRecordNum);

            _patientMapper.DeactivatedDataModel(patientDataModel, patient);

            _context.Entry(patientDataModel).State = EntityState.Modified;

            await _context.SaveChangesAsync();
            
            return patient;  
        }
        catch
        {
            throw;
        }
    }

    public async Task<bool> DeleteAsync(Patient patient)
    {
        try {
            
            PatientDataModel patientDataModel = await _context.Set<PatientDataModel>()
                    .FirstAsync(p => p.MedicalRecordNum == patient.MedicalRecordNum);

            _context.Entry(patientDataModel).State = EntityState.Modified;

            // Remove the entity from the context.
            _context.Set<PatientDataModel>().Remove(patientDataModel);

            // Save the changes to delete the entity from the database.
            await _context.SaveChangesAsync();
            
            return true;  
        }
        catch
        {
            throw;
        }
    }

    public async Task<IEnumerable<Patient>> GetFilteredPatientsAsync(string? name, string? email, string? phone, string? birth, string? gender)
    {
        try
        {
            // Inicia a query base
            IQueryable<PatientDataModel> query = _context.Set<PatientDataModel>();

            // Aplica os filtros conforme os critérios definidos no DTO
            if (!string.IsNullOrWhiteSpace(name))
            {
                query = query.Where(s => s.Name.FirstName.Contains(name) || s.Name.LastName.Contains(name));
            }

            if (!string.IsNullOrWhiteSpace(email))
            {
                query = query.Where(s => s.Contacts.Email == email);
            }

            if (!string.IsNullOrWhiteSpace(phone))
            {
                query = query.Where(s => s.Contacts.PhoneNumber == phone);
            }

            if (!string.IsNullOrWhiteSpace(birth))
            {
                query = query.Where(s => s.Birth == birth);
            }

            if (!string.IsNullOrWhiteSpace(gender))
            {
                if(gender == "Male" || gender == "male"){
                    query = query.Where(s => s.Gender == Gender.Male);
                } else if (gender == "Female" || gender == "female"){
                    query = query.Where(s => s.Gender == Gender.Female);
                }
                
            }

            // Executa a consulta e converte para o domínio
            var patientDataModels = await query.ToListAsync();
            var patients = _patientMapper.ToDomain(patientDataModels);

            return patients;
        }
        catch
        {
            throw; 
        }
    }
    
}