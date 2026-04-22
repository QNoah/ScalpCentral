using ScalpCentral.Api.Models;
using ScalpCentral.Api.Repository;

namespace ScalpCentral.Api.Services;

public class SetService : ISetService
{
    private readonly ISetRepository _setRepository;

    public SetService(ISetRepository setRepository)
    {
        _setRepository = setRepository;
    }

    public async Task<List<UserModel>> GetAllUsersAsync()
    {
        return await _setRepository.GetAllAsync();
    }
}
