using api.Models.DTOs.Set;
using ScalpCentral.Api.Repository;

public interface ISetService
{
    public Task<List<SetModel>> GetAllAsync();
    public Task<List<SetModel>> GetSets();
    public Task Add(SetDTO set);
    public Task Delete(int id);
    public Task Update(int id);
}