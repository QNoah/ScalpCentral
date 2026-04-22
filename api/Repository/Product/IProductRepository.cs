namespace ScalpCentral.Api.Repository;

public interface IProductRepository
{
    List<ProductModel> GetPaged(int page, int pagesize);
    List<ProductModel> GetFiltered(ProductFilter filter);
    ProductModel? GetById(int id);
    long Create(ProductModel product);
    long SoftDelete(ProductModel product);
    void HardDelete();
    long Update(ProductModel product);
}