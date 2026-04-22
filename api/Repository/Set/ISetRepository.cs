using api.Models.DTOs.Set;
using ScalpCentral.Api.Models;

namespace ScalpCentral.Api.Repository;

public interface ISetRepository
{
    Task<List<SetModel>> GetSets(SetFilters filter = null!);
    Task Add(SetDTO set);
    Task Update(SetDTO set);
    Task Delete(int setId);
}
