using System.ComponentModel.DataAnnotations;
using StudyPlatform.Domain.Entities.Enums;

namespace StudyPlatform.Domain.Models.Report;

public class ReportCreateDto
{
    public ReportCategory Category { get; set; }

    [Required(ErrorMessage = "Subiectul raportului este obligatoriu.")]
    [MaxLength(200, ErrorMessage = "Subiectul nu poate depăși 200 de caractere.")]
    public string Subject { get; set; }

    [Required(ErrorMessage = "Descrierea raportului este obligatorie.")]
    public string Description { get; set; }

    public ReportPriority Priority { get; set; }
    public bool Anonymous { get; set; }
    public Guid? UserId { get; set; }
}