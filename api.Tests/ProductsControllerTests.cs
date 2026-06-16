using Microsoft.AspNetCore.Mvc;
using Moq;
using ScalpCentral.Api.Controllers;

namespace api.Tests;

public class ProductsControllerTests
{
    [Fact]
    public async Task GetFiltered_ReturnsProducts_FromService()
    {
        var products = new List<ProductModel> { TestData.Product() };
        var service = new Mock<IProductService>();
        service.Setup(s => s.GetFiltered(It.IsAny<ProductFilter>())).ReturnsAsync(products);
        var controller = new ProductsController(service.Object);

        var result = await controller.GetFiltered(new ProductFilter());

        Assert.Same(products, result.Value);
    }

    [Fact]
    public async Task GetFiltered_ReturnsStatus500_WhenUnexpectedErrorOccurs()
    {
        var service = new Mock<IProductService>();
        service.Setup(s => s.GetFiltered(It.IsAny<ProductFilter>())).ThrowsAsync(new InvalidOperationException("boom"));
        var controller = new ProductsController(service.Object);

        var result = await controller.GetFiltered(new ProductFilter());

        var objectResult = Assert.IsType<ObjectResult>(result.Result);
        Assert.Equal(500, objectResult.StatusCode);
        Assert.Equal("boom", objectResult.Value);
    }

    [Fact]
    public async Task GetPaged_PassesLimitHeaderValue_ToService()
    {
        var paged = new PagedResults<ProductModel>(1, new List<ProductModel> { TestData.Product() });
        var service = new Mock<IProductService>();
        service.Setup(s => s.GetPaged(It.IsAny<ProductFilter>(), 25)).ReturnsAsync(paged);
        var controller = new ProductsController(service.Object);

        var result = await controller.GetPaged(new ProductFilter(), 25);

        Assert.Same(paged, result.Value);
    }

    [Fact]
    public async Task Create_ReturnsCreatedProductId()
    {
        var dto = new CreateProductDto
        {
            SetId = "base1",
            Name = "Booster Pack",
            Type = "Sealed",
            Description = "Pokemon booster pack",
            Price = 4.99m,
            Stock = 10
        };
        var service = new Mock<IProductService>();
        service.Setup(s => s.Create(dto)).ReturnsAsync(33);
        var controller = new ProductsController(service.Object);

        var result = await controller.Create(dto);

        Assert.Equal(33, result.Value);
    }

    [Fact]
    public async Task HardDelete_ReturnsOkStatus_WhenServiceCompletes()
    {
        var service = new Mock<IProductService>();
        var controller = new ProductsController(service.Object);

        var result = await controller.HardDelete();

        var status = Assert.IsType<StatusCodeResult>(result);
        Assert.Equal(200, status.StatusCode);
        service.Verify(s => s.HardDelete(), Times.Once);
    }
}
