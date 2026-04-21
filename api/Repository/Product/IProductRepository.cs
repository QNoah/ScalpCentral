namespace ScalpCentral.Api.Repository;

public interface IProductRepository
{
    List<ProductModel> GetPaged(int page, int pagesize);
    List<ProductModel> GetFiltered(ProductFilter filter);
    ProductModel? GetById(int id);
    void Add(ProductModel product);
    void SoftDelete(ProductModel product);
    void HardDelete();
    void Update(ProductModel product);
}