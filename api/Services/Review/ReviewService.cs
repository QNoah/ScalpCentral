using ScalpCentral.Api.Repository;

public class ReviewService : IReviewService
{
    private readonly IReviewRepository _reviewRepository;
    public ReviewService(IReviewRepository reviewRepository)
    {
        _reviewRepository = reviewRepository;
    }

    public async Task<List<ReviewModel>> GetFiltered(ReviewFilter filter)
    {
        return await _reviewRepository.GetFiltered(filter);
    }

    public async Task<PagedResults<ReviewModel>> GetPaged(ReviewFilter filter, int limit)
    {
        return await _reviewRepository.GetPaged(filter, limit);
    }

    public async Task<ReviewModel?> GetById(long id)
    {
        return await _reviewRepository.GetById(id);
    }

    public async Task<long> Create(ReviewDTO review)
    {
        return await _reviewRepository.Create(review);
    }

    public async Task<long> Update(ReviewDTO review, long id)
    {
        return await _reviewRepository.Update(review, id);
    }

    public async Task Delete(long id)
    {
        await _reviewRepository.Delete(id);
    }
}