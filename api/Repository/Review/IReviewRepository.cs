namespace ScalpCentral.Api.Repository;

public interface IReviewRepository
{
    Task<List<ReviewModel>> GetFiltered(ReviewFilter filter);
    Task<PagedResults<ReviewModel>> GetPaged(ReviewFilter filter, int limit);
    Task<Dictionary<string, string[]>> GetFilters(ReviewFilter filter);

    Task<ReviewModel?> GetById(long id);
    Task<long> Create(CreateProductDto product);
    Task Delete(int id);
    Task<long> Update(ReviewModel product);
    public Task<List<ReviewModel>> GetAllById(List<int> ids);
}