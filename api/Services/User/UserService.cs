using ScalpCentral.Api.Models;
using ScalpCentral.Api.DataAccess;

namespace ScalpCentral.Api.Services;

public class UserService : IUserService
{
    private readonly IUserAccess _userAccess;

    public UserService(IUserAccess userAccess)
    {
        _userAccess = userAccess;
    }

    public async Task<List<UserModel>> GetAllUsersAsync()
    {
        return await _userAccess.GetAllAsync();
    }
}