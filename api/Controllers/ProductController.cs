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
    public Task<ActionResult<List<ProductModel>>> GetFiltered([FromQuery] ProductFilter filter)
    {
        return _productservice.GetFiltered(filter);
    }

    [HttpGet("product/{id}")]
    public Task<ActionResult<ProductModel>> GetById([FromRoute] int id)
    {
        return _productservice.GetById(id);
    }

    [HttpPost("products/create")]
    public Task<ActionResult> Create([FromBody] ProductModel product)
    {
        return _productservice.Create(product);
    }

    [HttpPut("products/update")]
    public Task<ActionResult> Update([FromBody] ProductModel product)
    {
        return _productservice.Update(product);
    }

    [HttpPost("products/delete/{id}")]
    public Task<ActionResult> SoftDelete([FromRoute] int id)
    {
        return _productservice.SoftDelete(id);
    }

    [HttpPost("products/delete")]
    public Task<ActionResult> HardDelete()
    {
        return _productservice.HardDelete();
    }
}