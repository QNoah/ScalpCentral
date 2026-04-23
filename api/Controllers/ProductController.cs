using Microsoft.AspNetCore.Mvc;
using Npgsql;

namespace ScalpCentral.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productservice;
    public ProductsController(IProductService productService)
    {
        _productservice = productService;
    }

    [HttpGet()]
    public async Task<ActionResult<List<ProductModel>>> GetFiltered([FromQuery] ProductFilter filter)
    {
        try
        {
            return new ActionResult<List<ProductModel>>(await _productservice.GetFiltered(filter));
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
    public async Task<ActionResult<ProductModel?>> GetById([FromRoute] long id)
    {
        try
        {
            return new ActionResult<ProductModel?>(await _productservice.GetById(id));
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

    [HttpPost("create")]
    public async Task<ActionResult<long>> Create([FromBody] CreateProductDto product)
    {
        try
        {
            return new ActionResult<long>(await _productservice.Create(product));
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

    [HttpPut("update")]
    public async Task<ActionResult<long>> Update([FromBody] ProductModel product)
    {
        try
        {
            return new ActionResult<long>(await _productservice.Update(product));
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

    [HttpDelete("delete/{id}")]
    public async Task<ActionResult<long>> SoftDelete([FromRoute] long id)
    {
        try
        {
            return new ActionResult<long>(await _productservice.SoftDelete(id));
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

    [HttpDelete("delete")]
    public async Task<ActionResult> HardDelete()
    {
        try
        {
            await _productservice.HardDelete();
            return StatusCode(200);
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