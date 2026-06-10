using ScalpCentral.Api.Models;

namespace ScalpCentral.Api.Services;

public interface IUserService
{
    Task<List<UserModel>> GetAllUsersAsync();
    public Task<int?> CreateAccount(RegisterRequest userinfo);
    public Task<UserModel?> Login(LoginRequest userinfo);
    public Task ResetPassword(string email, string password);
    public Task<UserModel?> GetById(int id);
}