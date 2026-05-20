using StudyPlatform.Domain.Models.Service;

namespace StudyPlatform.BusinessLayer.Interfaces;

public interface IContractLogic
{
    ServiceResponse Upload(Guid studentId, string fileName, byte[] fileData, Guid uploadedByUserId);
    ServiceResponse GetByStudent(Guid studentId);
    ServiceResponse GetFileById(Guid contractId);
    (string? fileName, byte[]? data) GetRawFile(Guid contractId);
    ServiceResponse Delete(Guid contractId);
}
