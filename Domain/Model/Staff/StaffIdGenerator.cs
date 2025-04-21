using Domain.IRepository;

namespace Domain.Model;

public class StaffIdGenerator : IStaffIdGenerator
{   

    private IStaffRepository _staffRepository;

    private readonly int _minRecruitmentYear = 1960; // Minimun year
    private readonly int _currentYear = DateTime.Now.Year; // Max year


    public StaffIdGenerator(IStaffRepository staffRepository)
    {
        _staffRepository = staffRepository;
    }

    public async Task<string> GenerateStaffId(int recruitmentYear, string category)
    {
        string categoryPrefix = ValidateAndGetCategoryPrefix(category);

        ValidateRecruitmentYear(recruitmentYear);

        var category_recruitmentYear = $"{categoryPrefix}{recruitmentYear}";

        int maxExistingNumber = await _staffRepository.GetMaxStaffIDNumberAsync(category_recruitmentYear);

        int newRecordNumber = maxExistingNumber + 1;

        return $"{category_recruitmentYear}{newRecordNumber:D6}";

    }

    private string ValidateAndGetCategoryPrefix(string category)
    {
        if (category == null)
            throw new ArgumentNullException(nameof(category), "Category cannot be null.");
        
        return char.ToUpper(category.ToString()[0]).ToString();
    }

    private void ValidateRecruitmentYear(int recruitmentYear)
    {
        if (recruitmentYear < _minRecruitmentYear || recruitmentYear > _currentYear)
            throw new ArgumentOutOfRangeException(nameof(recruitmentYear), 
                $"Recruitment year must be between {_minRecruitmentYear} and {_currentYear}.");
    }

}