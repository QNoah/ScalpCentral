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

    public async Task<List<UserModel>> GetAllUsersAsync()
    {
        return await _userRepository.GetAllAsync();
    }

    public bool CreateAccount(LoginRequest userinfo)
    {
        if(_userRepository.EmailExists(userinfo.Email))
            return false;
        userinfo.Password = _hasher.GenerateHash(userinfo.Password, hashKey);
        return _userRepository.CreateAccount(userinfo);
    }

    public UserModel? Login(LoginRequest userinfo)
    {
        UserModel? user = _userRepository.Login(userinfo);
        if(user == null)
            return null;
        else if(user.Password == _hasher.GenerateHash(userinfo.Password, hashKey))
        {
            return user;
        }
        return null;
    }
}
