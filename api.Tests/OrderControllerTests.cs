using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using ScalpCentral.Api.Controllers;
using ScalpCentral.Api.Models;
using ScalpCentral.Api.Services;

namespace api.Tests;

public class OrderControllerTests
{
    [Fact]
    public async Task GetOrderById_ReturnsNotFound_WhenOrderDoesNotExist()
    {
        var service = new Mock<IOrderService>();
        service.Setup(s => s.GetOrderByIdAsync(99)).ReturnsAsync((OrderModel?)null);
        var controller = CreateController(service.Object, userId: 7);

        var result = await controller.GetOrderById(99);

        Assert.IsType<NotFoundResult>(result.Result);
    }

    [Fact]
    public async Task GetOrderById_ReturnsOk_WhenOrderExists()
    {
        var order = TestData.Order();
        var service = new Mock<IOrderService>();
        service.Setup(s => s.GetOrderByIdAsync(1)).ReturnsAsync(order);
        var controller = CreateController(service.Object, userId: 7);

        var result = await controller.GetOrderById(1);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        Assert.Same(order, ok.Value);
    }

    [Fact]
    public async Task CreateOrder_ReturnsCreatedAtAction_WithCreatedOrder()
    {
        var order = TestData.Order(15);
        var service = new Mock<IOrderService>();
        service.Setup(s => s.CreateOrderAsync(order)).ReturnsAsync(order);
        var controller = CreateController(service.Object, userId: 7);

        var result = await controller.CreateOrder(order);

        var created = Assert.IsType<CreatedAtActionResult>(result.Result);
        Assert.Equal(nameof(OrderController.GetOrderById), created.ActionName);
        Assert.Equal(15L, created.RouteValues!["id"]);
        Assert.Same(order, created.Value);
    }

    [Fact]
    public async Task UpdateOrder_ReturnsBadRequest_WhenRouteIdAndBodyIdDoNotMatch()
    {
        var order = TestData.Order(2);
        var service = new Mock<IOrderService>();
        var controller = CreateController(service.Object, userId: 7, role: "Admin");

        var result = await controller.UpdateOrder(1, order);

        Assert.IsType<BadRequestObjectResult>(result.Result);
        service.Verify(s => s.UpdateOrderAsync(It.IsAny<long>(), It.IsAny<OrderModel>()), Times.Never);
    }

    [Fact]
    public async Task UpdateOrder_SetsRouteIdAndReturnsOk_WhenOrderExists()
    {
        var order = TestData.Order(0);
        var updated = TestData.Order(5);
        var service = new Mock<IOrderService>();
        service.Setup(s => s.UpdateOrderAsync(5, It.Is<OrderModel>(o => o.Id == 5))).ReturnsAsync(updated);
        var controller = CreateController(service.Object, userId: 7, role: "Admin");

        var result = await controller.UpdateOrder(5, order);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        Assert.Same(updated, ok.Value);
    }

    [Fact]
    public async Task DeleteOrder_ReturnsNoContent_WhenDeleteSucceeds()
    {
        var service = new Mock<IOrderService>();
        service.Setup(s => s.DeleteOrderAsync(4)).ReturnsAsync(true);
        var controller = CreateController(service.Object, userId: 7, role: "Admin");

        var result = await controller.DeleteOrder(4);

        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task DeleteOrder_ReturnsNotFound_WhenDeleteFails()
    {
        var service = new Mock<IOrderService>();
        service.Setup(s => s.DeleteOrderAsync(4)).ReturnsAsync(false);
        var controller = CreateController(service.Object, userId: 7, role: "Admin");

        var result = await controller.DeleteOrder(4);

        Assert.IsType<NotFoundResult>(result);
    }

    private static OrderController CreateController(IOrderService service, int userId, string role = "User")
    {
        var controller = new OrderController(service)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            }
        };

        controller.ControllerContext.HttpContext.User = new ClaimsPrincipal(
            new ClaimsIdentity(
                new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                    new Claim(ClaimTypes.Role, role)
                },
                "TestAuth"
            )
        );

        return controller;
    }
}
