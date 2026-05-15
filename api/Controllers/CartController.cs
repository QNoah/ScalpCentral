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
    public async Task<IActionResult> Add(string userId, string productId, int quantity)
    {
        await _service.AddToCart(userId, productId, quantity);
        return Ok();
    }

    [HttpGet]
    public async Task<List<CartItemDTO>> Get(string userId)
    {
        return await _service.GetCart(userId);
    }

    [HttpDelete]
    public async Task<IActionResult> Clear(string userId)
    {
        await _service.ClearCart(userId);
        return Ok();
    }
}