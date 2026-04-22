using ScalpCentral.Api.Models;

namespace ScalpCentral.Api.Repository;

public interface ISetRepository
{
    List<SetModel> GetSets(SetFilters filter);
    void Add(SetModel set);
    void UpdateSet(SetModel set);
    void Delete(int setId);
}
