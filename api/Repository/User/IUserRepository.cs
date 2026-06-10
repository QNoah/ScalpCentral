using ScalpCentral.Api.Models;

namespace ScalpCentral.Api.Repository;

public interface IUserRepository
{
    Task<List<UserModel>> GetAllAsync();
    public Task<bool> EmailExists(string email);
    public Task<int?> CreateAccount(RegisterRequest userinfo);
    public Task<UserModel?> Login(LoginRequest userinfo);
    public Task<UserModel?> GetById(int id);
    public Task<UserModel?> GetByEmail(string email);
    public Task SoftDelete(UserModel user);
    public Task HardDelete(UserModel user);
    public Task Update(UserModel user);
}