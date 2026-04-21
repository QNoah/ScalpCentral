using Microsoft.AspNetCore.Mvc;

namespace ScalpCentral.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productservice;
    public ProductsController()
    {
        _productservice = new ProductService();
    }

    [HttpGet("products")]
    public Task<ActionResult<List<ProductModel>>> Get()
    {
        throw new NotImplementedException();
    }

    [HttpGet("products/{Id}")]
}