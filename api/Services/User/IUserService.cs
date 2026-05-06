using ScalpCentral.Api.Models;

namespace ScalpCentral.Api.Services;

public interface IUserService
{
    Task<List<UserModel>> GetAllUsersAsync();
    public Task<int?> CreateAccount(LoginRequest userinfo);
    public Task<UserModel?> Login(LoginRequest userinfo);
    public Task<UserModel?> GetById(int id);
}