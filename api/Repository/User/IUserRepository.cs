using ScalpCentral.Api.Models;

namespace ScalpCentral.Api.Repository;

public interface IUserRepository
{
    Task<List<UserModel>> GetAllAsync();
}