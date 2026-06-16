using ScalpCentral.Api.Models;

namespace ScalpCentral.Api.Services;

public interface IUserService
{
    Task<List<UserDto>> GetAllUsersAsync();
    public Task<int?> CreateAccount(RegisterRequest userinfo);
    public Task<UserModel?> Login(LoginRequest userinfo);
    public Task ResetPassword(string email, string password);
    public Task<UserModel?> GetById(int id);
    public Task<UserModel?> UpdateAccount(int id, UserAccountRequest account);
    public Task<UserModel?> UpdateAddress(int id, UserAddressRequest address);
    public Task<List<int>> GetBookmarks(int userId);
    public Task AddBookmark(int userId, int productId);
    public Task RemoveBookmark(int userId, int productId);
}
