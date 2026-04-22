public class ProductFilter
{
    public int? MinPrice { get; set; }
    public int? MaxPrice { get; set; }
    public string? Name { get; set; }
    public bool InStock { get; set; } = true;//by default get all products, when true remove all out of stock products.
    public List<string>? Types { get; set; }
    public List<string>? SetNames { get; set; }
}