using ScalpCentral.Api.Models;

namespace ScalpCentral.Api.Repository;

public interface IUserRepository
{
    Task<List<UserModel>> GetAllAsync();
    public bool EmailExists(string email);
    public bool CreateAccount(LoginRequest userinfo);
    public UserModel? Login(LoginRequest userinfo);
    public UserModel? GetById(int id);
    public void SoftDelete(UserModel user);
    public void HardDelete(UserModel user);
    public void Update(UserModel user);
}