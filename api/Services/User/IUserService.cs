using ScalpCentral.Api.Models;

namespace ScalpCentral.Api.Services;

public interface IUserService
{
    Task<List<UserModel>> GetAllUsersAsync();
    public bool CreateAccount(LoginRequest userinfo);
    public UserModel? Login(LoginRequest userinfo);
}