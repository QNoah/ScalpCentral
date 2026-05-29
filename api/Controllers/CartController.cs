using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Authorize]
[Route("api/cart")]
public class CartController : ControllerBase
{
    private readonly ICartService _service;

    public CartController(ICartService service)
    {
        _service = service;
    }

    [HttpPost("add")]
    public async Task<IActionResult> Add([FromBody] AddToCartDTO dto)
    {
        if (dto == null)
            return BadRequest("DTO is null");

        await _service.AddToCart(dto.CartId, dto.ProductId, dto.Quantity);
        return Ok();
    }

    [HttpGet("{cartId}")]
    public async Task<ActionResult<List<CartItemDTO>>> Get(string cartId)
    {
        try
        {
            return await _service.GetCart(cartId);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpDelete]
    public async Task<IActionResult> Clear(string cartId)
    {
        await _service.ClearCart(cartId);
        return Ok();
    }
}