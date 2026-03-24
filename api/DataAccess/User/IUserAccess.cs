using ScalpCentral.Api.Models;

namespace ScalpCentral.Api.DataAccess;

public interface IUserAccess
{
    Task<List<UserModel>> GetAllAsync();
}