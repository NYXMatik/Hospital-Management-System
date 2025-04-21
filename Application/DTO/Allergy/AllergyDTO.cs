public class AllergyDTO
{
    public string code { get; set; }
    public string designation { get; set; }
    public string description { get; set; }
}

public class UpdateAllergyDTO
{
    public string? designation { get; set; }
    public string? description { get; set; }
}