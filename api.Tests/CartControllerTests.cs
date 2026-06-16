using Microsoft.AspNetCore.Mvc;
using Moq;

namespace api.Tests;

public class CartControllerTests
{
    [Fact]
    public async Task Add_ReturnsBadRequest_WhenDtoIsNull()
    {
        var service = new Mock<ICartService>();
        var controller = new CartController(service.Object);

        var result = await controller.Add(null!);

        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("DTO is null", badRequest.Value);
        service.Verify(s => s.AddToCart(It.IsAny<string>(), It.IsAny<int>(), It.IsAny<int>()), Times.Never);
    }

    [Fact]
    public async Task Add_CallsServiceAndReturnsOk_WhenDtoIsValid()
    {
        var service = new Mock<ICartService>();
        var controller = new CartController(service.Object);
        var dto = new AddToCartDTO { CartId = "cart-1", ProductId = 7, Quantity = 2 };

        var result = await controller.Add(dto);

        Assert.IsType<OkResult>(result);
        service.Verify(s => s.AddToCart("cart-1", 7, 2), Times.Once);
    }

    [Fact]
    public async Task Get_ReturnsCartItems_FromService()
    {
        var items = new List<CartItemDTO>
        {
            new() { Product = TestData.Product(), Quantity = 2 }
        };
        var service = new Mock<ICartService>();
        service.Setup(s => s.GetCart("cart-1")).ReturnsAsync(items);
        var controller = new CartController(service.Object);

        var result = await controller.Get("cart-1");

        Assert.Same(items, result.Value);
    }

    [Fact]
    public async Task Get_ReturnsStatus500_WhenServiceThrows()
    {
        var service = new Mock<ICartService>();
        service.Setup(s => s.GetCart("cart-1")).ThrowsAsync(new InvalidOperationException("cart failed"));
        var controller = new CartController(service.Object);

        var result = await controller.Get("cart-1");

        var objectResult = Assert.IsType<ObjectResult>(result.Result);
        Assert.Equal(500, objectResult.StatusCode);
        Assert.Equal("cart failed", objectResult.Value);
    }

    [Fact]
    public async Task Remove_CallsServiceAndReturnsOk()
    {
        var service = new Mock<ICartService>();
        var controller = new CartController(service.Object);
        var dto = new RemoveCartItemDTO { CartId = "cart-1", ProductId = 9 };

        var result = await controller.Remove(dto);

        Assert.IsType<OkResult>(result);
        service.Verify(s => s.RemoveItem("cart-1", 9), Times.Once);
    }
}
