namespace StudyPlatform.Domain.Models.Contract;

public class ContractInfoDto
{
    public Guid Id { get; set; }
    public Guid StudentId { get; set; }
    public string FileName { get; set; }
    public long FileSize { get; set; }
    public DateTime UploadedAt { get; set; }
}
