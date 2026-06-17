using Microsoft.AspNetCore.Mvc;
using Npgsql;

namespace ScalpCentral.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewController : ControllerBase
{
    private readonly IReviewService _reviewService;
    public ReviewController(IReviewService reviewService)    {
        _reviewService = reviewService;
    }

    [HttpGet()]
    public async Task<ActionResult<List<ReviewModel>>> GetFiltered([FromQuery] ReviewFilter filter)
    {
        try
        {
            return new ActionResult<List<ReviewModel>>(await _reviewService.GetFiltered(filter));
        }
        catch (PostgresException ex)
        {
            return Conflict(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpGet("paged")]
    public async Task<ActionResult<PagedResults<ReviewModel>>> GetPaged([FromQuery] ReviewFilter filter, [FromHeader] int limit)
    {
        try
        {
            return new ActionResult<PagedResults<ReviewModel>>(await _reviewService.GetPaged(filter, limit));
        }
        catch (PostgresException ex)
        {
            return Conflict(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ReviewModel>> GetById(long id)
    {
        try
        {
            var review = await _reviewService.GetById(id);
            if (review == null)
                return NotFound();
            return new ActionResult<ReviewModel>(review);
        }
        catch (PostgresException ex)
        {
            return Conflict(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpPost()]
    public async Task<ActionResult<long>> Create(ReviewDTO review)
    {
        try
        {
            if (review.UserId is null || review.ProductId is null)
            {
                return BadRequest("UserId and ProductId are required.");
            }

            List<ReviewModel> existingReviews = await _reviewService.GetFiltered(new ReviewFilter
            {
                UserId = (int)review.UserId.Value,
                ProductId = (int)review.ProductId.Value
            });

            if (existingReviews.Count > 0)
            {
                return Conflict("User has already reviewed this product.");
            }

            long id = await _reviewService.Create(review);
            return new ActionResult<long>(id);
        }
        catch (PostgresException ex)
        {
            return Conflict(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<long>> Update(ReviewDTO review, long id)
    {
        try
        {
            long updatedId = await _reviewService.Update(review, id);
            return new ActionResult<long>(updatedId);
        }
        catch (PostgresException ex)
        {
            return Conflict(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(long id)
    {
        try
        {
            await _reviewService.Delete(id);
            return NoContent();
        }
        catch (PostgresException ex)
        {
            return Conflict(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }
}
