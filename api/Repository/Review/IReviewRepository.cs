namespace ScalpCentral.Api.Repository;

public interface IReviewRepository
{
    Task<List<ReviewModel>> GetFiltered(ReviewFilter filter);
    Task<PagedResults<ReviewModel>> GetPaged(ReviewFilter filter, int limit);

    Task<ReviewModel?> GetById(long id);
    Task<long> Create(ReviewDTO review);
    Task<long> Update(ReviewDTO review, long id);
    Task Delete(long id);
}