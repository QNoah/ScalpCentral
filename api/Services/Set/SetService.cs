using api.Models.DTOs.Set;
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
    public async Task<List<SetModel>> GetSets(SetFilters filter = null!)
    {
        return await _setRepository.GetSets(filter);
    }
    public async Task Add(SetDTO set)
    {
        await _setRepository.Add(set);
    }
    public async Task Delete(int id)
    {
        await _setRepository.Delete(id);
    }
    public async Task Update(SetDTO set)
    {
        await _setRepository.Update(set);
    }
}
