using ScalpCentral.Api.Models;

namespace ScalpCentral.Api.Services;

public interface IUserService
{
    Task<List<UserModel>> GetAllUsersAsync();
}