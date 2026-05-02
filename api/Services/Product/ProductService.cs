using Microsoft.AspNetCore.Mvc;
using ScalpCentral.Api.Repository;

public class ProductService : IProductService
{
    private readonly IProductRepository _productrepository;
    public ProductService(IProductRepository productRepository)
    {
        _productrepository = productRepository;
    }
    public async Task<long> Create(CreateProductDto product)
    {
        return await _productrepository.Create(product);
    }

    public async Task<ProductModel?> GetById(long id)
    {
        return await  _productrepository.GetById(id);
    }

    public async Task<List<ProductModel>> GetFiltered(ProductFilter filter)
    {
        return await _productrepository.GetFiltered(filter);
    }

    public async Task<PagedResults<ProductModel>> GetPaged(ProductFilter filter, int limit)
    {
        return await _productrepository.GetPaged(filter, limit);
    }

    public async Task HardDelete()
    {
        await _productrepository.HardDelete();
    }

    public async Task<long> SoftDelete(long id)
    {
        return await _productrepository.SoftDelete(id);
    }

    public async Task<long> Update(ProductModel product)
    {
        return await _productrepository.Update(product);
    }
}