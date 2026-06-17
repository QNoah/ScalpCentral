public class ProductModel
{
    public required int Id {get; set;}
    public required string Name {get; set;}
    public required string Type {get; set;}
    public required string Description {get; set;}
    public required decimal Price {get; set;}
    public required decimal SalepriceModifier {get; set;} //discount
    public required int Stock {get; set;}

// get Set from Sets table, get images from ProductImages table
    public required SetModel Set {get; set;}
    public required List<string>? Images {get; set;}

}