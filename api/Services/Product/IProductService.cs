using Microsoft.AspNetCore.Mvc;

public interface IProductService
{
    Task<ActionResult<List<ProductModel>>> GetFiltered(ProductFilter filter);
    Task<ActionResult<ProductModel>> GetById(int id);
    Task<ActionResult> Create(ProductModel product);
    Task<ActionResult> Update(ProductModel product);
    Task<ActionResult> SoftDelete(int id);
    Task<ActionResult> HardDelete();
}