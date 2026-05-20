using StudyPlatform.BusinessLayer.Interfaces;
using StudyPlatform.BusinessLayer.Structure;
using StudyPlatform.Domain.Models.Service;

namespace StudyPlatform.BusinessLayer.Core;

public class ContractLogic : ContractActions, IContractLogic
{
    public ServiceResponse Upload(Guid studentId, string fileName, byte[] fileData, Guid uploadedByUserId)
    {
        try
        {
            var ok = base.Upload(studentId, fileName, fileData, uploadedByUserId);
            return new ServiceResponse { IsSuccess = ok, Message = ok ? "Contract încărcat cu succes." : "Eroare la salvare." };
        }
        catch (Exception ex) { return new ServiceResponse { IsSuccess = false, Message = ex.Message }; }
    }

    public ServiceResponse GetByStudent(Guid studentId)
    {
        try
        {
            var dto = base.GetByStudent(studentId);
            return dto is null
                ? new ServiceResponse { IsSuccess = false, IsNotFound = true, Message = "Nu există contract pentru acest student." }
                : new ServiceResponse { IsSuccess = true, Data = dto };
        }
        catch (Exception ex) { return new ServiceResponse { IsSuccess = false, Message = ex.Message }; }
    }

    public ServiceResponse GetFileById(Guid contractId)
    {
        try
        {
            var (fileName, data) = base.GetFileById(contractId);
            if (fileName is null || data is null)
                return new ServiceResponse { IsSuccess = false, IsNotFound = true, Message = "Contractul nu a fost găsit." };
            return new ServiceResponse { IsSuccess = true, Data = new { fileName, data } };
        }
        catch (Exception ex) { return new ServiceResponse { IsSuccess = false, Message = ex.Message }; }
    }

    public (string? fileName, byte[]? data) GetRawFile(Guid contractId)
        => base.GetFileById(contractId);

    public ServiceResponse Delete(Guid contractId)
    {
        try
        {
            var ok = base.Delete(contractId);
            return new ServiceResponse { IsSuccess = ok, IsNotFound = !ok, Message = ok ? "Contract șters." : "Contractul nu există." };
        }
        catch (Exception ex) { return new ServiceResponse { IsSuccess = false, Message = ex.Message }; }
    }
}
