public class MedicalCondition
{
    public string code { get; set; }
    public string designation { get; set; }
    public string description { get; set; }
    public string[] commonSymptoms { get; set; }
}

public class UpdateMedicalCondition
{
    public string? designation { get; set; }
    public string? description { get; set; }
}