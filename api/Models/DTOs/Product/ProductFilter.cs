using Npgsql.Internal.Postgres;

public class ProductFilter
{
    public int? Page { get; set; } = 0;
    public int? MinPrice { get; set; }
    public int? MaxPrice { get; set; }
    public string? Name { get; set; }
    public bool InStock { get; set; } = false;//by default get all products, when true remove all out of stock products;
    public bool OnSale { get; set; } = false;//by default gets all products, when true onlt get products where saleprice_modifier > 0;
    public List<string>? Types { get; set; }
    public List<string>? SetNames { get; set; }
    public List<string>? Series { get; set; }

    // sort options
    public string? Sort { get; set; }
}