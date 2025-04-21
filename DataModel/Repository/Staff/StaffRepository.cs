namespace DataModel.Repository;

using Microsoft.EntityFrameworkCore;

using DataModel.Model;
using DataModel.Mapper;

using Domain.Model;
using Domain.IRepository;
using Microsoft.EntityFrameworkCore.ChangeTracking;

public class StaffRepository : GenericRepository<Staff>, IStaffRepository
{    
    StaffMapper _staffMapper;
    public StaffRepository(GenericContext context, StaffMapper mapper) : base(context!)
    {
        _staffMapper = mapper;
    }

    public async Task<IEnumerable<Staff>> GetStaffsAsync()
    {
        try {
            IEnumerable<StaffDataModel> staffsDataModel = await _context.Set<StaffDataModel>()
                    .ToListAsync();

            IEnumerable<Staff> staffs = _staffMapper.ToDomain(staffsDataModel);

            return staffs;
        }
        catch
        {
            throw;
        }
    }

    public async Task<Staff> GetStaffByEmailAsync(string email)
    {
        try {
            StaffDataModel staffDataModel = await _context.Set<StaffDataModel>()
                    .FirstAsync(p => p.Contact.Email == email);

            Staff staff = _staffMapper.ToDomain(staffDataModel);

            return staff;
        }
        catch
        {
            return null;throw;
        }
    }

    public async Task<IEnumerable<Staff>> GetStaffByNameAsync(string name)
    {
        try
        {
            var staffDataModels = await _context.Set<StaffDataModel>()
                    .Where(s => s.Name.FirstName == name)
                    .ToListAsync();

            var staffs = _staffMapper.ToDomain(staffDataModels);

            return staffs;
        }
        catch
        {
            return new List<Staff>();
        }
    }

    public async Task<IEnumerable<Staff>> GetStaffBySpecializationAsync(string specialization)
    {
        try
        {
            var staffDataModels = await _context.Set<StaffDataModel>()
                    .Where(s => s.Specialization == specialization)
                    .ToListAsync();

            var staffs = _staffMapper.ToDomain(staffDataModels);

            return staffs;
        }
        catch
        {
            return new List<Staff>();
        }
    }

    public async Task<Staff> GetStaffByIdAsync(string id)
    {
        try {
            StaffDataModel staffDataModel = await _context.Set<StaffDataModel>()
                    .FirstAsync(s => s.Id==id);

            Staff staff = _staffMapper.ToDomain(staffDataModel);

            return staff;
        }
        catch
        {
            return null;//throw;
        }
    }

    public async Task<Staff> Add(Staff staff)
    {
        try {
            StaffDataModel staffDataModel = _staffMapper.ToDataModel(staff);

            EntityEntry<StaffDataModel> staffDataModelEntityEntry = _context.Set<StaffDataModel>().Add(staffDataModel);
            
            await _context.SaveChangesAsync();

            StaffDataModel staffDataModelSaved = staffDataModelEntityEntry.Entity;

            Staff staffSaved = _staffMapper.ToDomain(staffDataModelSaved);

            return staffSaved;    
        }
        catch
        {
            throw;
        }
    }

    public async Task<Staff> Update(Staff staff, List<string> errorMessages)
    {
        try {
            StaffDataModel staffDataModel = await _context.Set<StaffDataModel>()
                    .FirstAsync(s => s.Id == staff.Id);

            _staffMapper.UpdateDataModel(staffDataModel, staff);

            _context.Entry(staffDataModel).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return staff;
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await StaffIdExists(staff.Id))
            {
                errorMessages.Add("Staff id Not found.");
                
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

    public async Task<Staff> GetStaffWithLogsAsync(string id)
    {
        try
        {
            // Carregar o staff e inclui os logs de auditoria relacionados
            var staffDataModel = await _context.Set<StaffDataModel>()
                .Include(s => s.AuditLogs)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (staffDataModel == null)
            {
                throw new KeyNotFoundException($"Staff with id '{id}' not found.");
            }

            // Mapeia o StaffDataModel para o domínio (classe Staff)
            var staff = _staffMapper.ToDomain(staffDataModel, staffDataModel.AuditLogs);

            return staff;
        }
        catch
        {
            return null;throw;
        }
    }

    
    public async Task<Staff> InactivateAsync(Staff staff)
    {
        try {
            
            StaffDataModel staffDataModel = await _context.Set<StaffDataModel>()
                    .FirstAsync(s => s.Id == staff.Id);

            _staffMapper.DeactivatedDataModel(staffDataModel, staff);

            _context.Entry(staffDataModel).State = EntityState.Modified;

            await _context.SaveChangesAsync();
            
            return staff;  
        }
        catch
        {
            throw;
        }
    }

    public async Task<bool> StaffIdExists(string id)
    {
        return await _context.Set<StaffDataModel>().AnyAsync(s => s.Id == id);
    }

    public async Task<bool> StaffExists(string licenseNumber)
    {
        return await _context.Set<StaffDataModel>().AnyAsync(e => e.LicenseNumber == licenseNumber);
    }

    public async Task<bool> EmailAndPhoneExists(string email, string phoneNumber)
    {
        return await _context.Set<StaffDataModel>().AnyAsync(s =>
            s.Contact.Email == email ||
            s.Contact.PhoneNumber == phoneNumber);
    }

    public async Task<bool> EmailExists(string email)
    {
        return await _context.Set<StaffDataModel>().AnyAsync(s =>
            s.Contact.Email == email);
    }

    public async Task<bool> PhoneExists(string phoneNumber)
    {
        return await _context.Set<StaffDataModel>().AnyAsync(s =>
            s.Contact.PhoneNumber == phoneNumber);
    }

    public async Task<int> GetMaxStaffIDNumberAsync(string categoryRecruitmentYear)
    {
        try
        {
            // Obtém todos os IDs que começam com o prefixo correto da categoria e ano
            var records = await _context.Set<StaffDataModel>()
                .Where(s => s.Id.StartsWith(categoryRecruitmentYear))
                .Select(s => s.Id)
                .ToListAsync();

            // Extrai e obtém o maior número sequencial
            return records
                .Select(id => id.Length >= 10 ? int.Parse(id.Substring(6, 5)) : 0)
                .DefaultIfEmpty(0)
                .Max();
        }
        catch (FormatException ex)
        {
            throw new InvalidOperationException("Erro ao analisar o número sequencial do StaffID.", ex);
        }
        catch (Exception ex)
        {
            throw new Exception("Ocorreu um erro ao obter o número sequencial máximo para o StaffID.", ex);
        }
    }


    public async Task<IEnumerable<Staff>> GetFilteredStaffsAsync(string? name, string? email, string? specialization)
    {
    try
    {
        // Inicia a query base
        IQueryable<StaffDataModel> query = _context.Set<StaffDataModel>();

        // Aplica os filtros conforme os critérios definidos no DTO
        if (!string.IsNullOrWhiteSpace(name))
        {
            query = query.Where(s => s.Name.FirstName.Contains(name) || s.Name.LastName.Contains(name));
        }

        if (!string.IsNullOrWhiteSpace(email))
        {
            query = query.Where(s => s.Contact.Email == email);
        }

        if (!string.IsNullOrWhiteSpace(specialization))
        {
            query = query.Where(s => s.Specialization == specialization);
        }

        // Executa a consulta e converte para o domínio
        var staffDataModels = await query.ToListAsync();
        var staffs = _staffMapper.ToDomain(staffDataModels);

        return staffs;
    }
    catch
    {
        throw; // Propaga qualquer exceção para ser tratada em um nível superior
    }
}


}