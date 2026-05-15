using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/cart")]
public class CartController : ControllerBase
{
    private readonly ICartService _service;

    public CartController(ICartService service)
    {
        _service = service;
    }

    [HttpPost("add")]
    public async Task<IActionResult> Add(string cartId, string productId, int quantity)
    {
        await _service.AddToCart(cartId, productId, quantity);
        return Ok();
    }

    [HttpGet("{cartId}")]
    public async Task<List<CartItemDTO>> Get(string cartId)
    {
        return await _service.GetCart(cartId);
    }

    [HttpDelete]
    public async Task<IActionResult> Clear(string cartId)
    {
        await _service.ClearCart(cartId);
        return Ok();
    }
}