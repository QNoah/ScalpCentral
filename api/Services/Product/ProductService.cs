using Microsoft.AspNetCore.Mvc;
using ScalpCentral.Api.Repository;

public class ProductService : IProductService
{
    private readonly IProductRepository _productrepository;
    public ProductService()
    {
        _productrepository = new ProductRepository();
    }
    public Task<ActionResult> Create(ProductModel product)
    {
        throw new NotImplementedException();
    }

    public Task<ActionResult<ProductModel>> GetById(int id)
    {
        throw new NotImplementedException();
    }

    public Task<ActionResult<List<ProductModel>>> GetFiltered(ProductFilter filter)
    {
        throw new NotImplementedException();
    }

    public Task<ActionResult> HardDelete()
    {
        throw new NotImplementedException();
    }

    public Task<ActionResult> SoftDelete(int id)
    {
        throw new NotImplementedException();
    }

    public Task<ActionResult> Update(ProductModel product)
    {
        throw new NotImplementedException();
    }
}