using System.ComponentModel.DataAnnotations;

namespace StudyPlatform.Domain.Models.Notification;

public class NotificationCreateDto
{
    [Required(ErrorMessage = "Titlul este obligatoriu.")]
    public string Title { get; set; }

    [Required(ErrorMessage = "Mesajul este obligatoriu.")]
    public string Message { get; set; }

    public string Type { get; set; } = "general";
}
