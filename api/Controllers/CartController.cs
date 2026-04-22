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
    public async Task<IActionResult> Get(string userId)
    {
        var cart = await _service.GetCart(userId);
        return Ok(cart);
    }

    [HttpDelete]
    public async Task<IActionResult> Clear(string userId)
    {
        await _service.ClearCart(userId);
        return Ok();
    }
}