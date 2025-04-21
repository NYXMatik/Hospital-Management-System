namespace Domain.Model;

public interface IStaffIdGenerator {

    Task<string> GenerateStaffId(int recruitmentYear, string category);
    
}