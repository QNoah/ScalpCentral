using System.ComponentModel;
using System.Diagnostics;
using ScalpCentral.Api.Models;
using ScalpCentral.Api.Repository;

namespace ScalpCentral.Api.Services;

public class UserService : IUserService
{
    Hasher _hasher = new();
    const string hashKey = "vis";
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<List<UserDto>> GetAllUsersAsync()
    {
        return await _userRepository.GetAllAsync();
    }

    public async Task<int?> CreateAccount(RegisterRequest userinfo)
    {

        if (await _userRepository.EmailExists(userinfo.Email))
        {
            return 0;
        }

        userinfo.Password = _hasher.GenerateHash(userinfo.Password, hashKey);

        return await _userRepository.CreateAccount(userinfo);
    }

    public async Task<UserModel?> Login(LoginRequest userinfo)
    {
        UserModel? user = await _userRepository.Login(userinfo);
        if(user == null)
            return null;
        else if(user.Password == _hasher.GenerateHash(userinfo.Password, hashKey))
        {
            return user;
        }
        return null;
    }

    public async Task ResetPassword(string email, string password)
    {
        var user = await _userRepository.GetByEmail(email);

        if (user == null)
            throw new Exception("User not found");

        user.Password = _hasher.GenerateHash(password, hashKey);

        await _userRepository.Update(user);
    }

    public async Task<UserModel?> GetById(int id)
    {
        UserModel? user = await _userRepository.GetById(id);
        if(user == null)
            return null;
        return user;
    }
}
