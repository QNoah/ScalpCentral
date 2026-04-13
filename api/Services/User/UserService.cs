using ScalpCentral.Api.Models;
using ScalpCentral.Api.Repository;

namespace ScalpCentral.Api.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<List<UserModel>> GetAllUsersAsync()
    {
        return await _userRepository.GetAllAsync();
    }
}
