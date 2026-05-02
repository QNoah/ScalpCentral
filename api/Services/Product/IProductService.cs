using Microsoft.AspNetCore.Mvc;

public interface IProductService
{
    Task<List<ProductModel>> GetFiltered(ProductFilter filter);
    Task<PagedResults<ProductModel>> GetPaged(ProductFilter filter, int limit);
    Task<ProductModel?> GetById(long id);
    Task<long> Create(CreateProductDto product);
    Task<long> Update(ProductModel product);
    Task<long> SoftDelete(long id);
    Task HardDelete();
}