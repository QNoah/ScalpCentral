using api.Models.DTOs.Set;
using ScalpCentral.Api.Models;

namespace ScalpCentral.Api.Repository;

public interface ISetRepository
{
    List<SetModel> GetSets(SetFilters filter);
    void Add(SetDTO set);
    void UpdateSet(SetDTO set);
    void Delete(int setId);
}
