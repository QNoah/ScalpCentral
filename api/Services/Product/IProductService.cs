using Microsoft.AspNetCore.Mvc;

public interface IProductService
{
    Task<List<ProductModel>> GetFiltered(ProductFilter filter);
    Task<ProductModel?> GetById(long id);
    Task<long> Create(CreateProductDto product);
    Task<long> Update(ProductModel product);
    Task<long> SoftDelete(long id);
    Task HardDelete();
}