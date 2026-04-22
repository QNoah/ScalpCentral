namespace ScalpCentral.Api.Repository;

public interface IProductRepository
{
    Task<List<ProductModel>> GetFiltered(ProductFilter filter);
    Task<ProductModel?> GetById(long id);
    Task<long> Create(ProductModel product);
    Task<long> SoftDelete(long id);
    Task HardDelete();
    Task<long> Update(ProductModel product);
}