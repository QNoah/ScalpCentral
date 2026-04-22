using api.Models.DTOs.Set;
using ScalpCentral.Api.Models;

namespace ScalpCentral.Api.Repository;

public interface ISetRepository
{
    Task<List<SetModel>> GetAllSetsAsync();
    Task<List<SetModel>> GetSets(SetFilters filter);
    Task Add(SetDTO set);
    Task UpdateSet(SetDTO set);
    Task Delete(int setId);
}
