public class ProductModel
{
    public int Id {get; set;}
    public required string Name {get; set;}
    public required string Type {get; set;}
    public required string Description {get; set;}
    public required decimal Price {get; set;}
    public required decimal Saleprice_modifier {get; set;} //discount
    public required int Stock {get; set;}
    public required DateTime Created_at {get; set;}
    public DateTime? Deleted_at {get; set;}
    public required bool SoftDeleted {get; set;}

//---------------------------------------------------
//   get from different tables
//---------------------------------------------------

    public required SetModel Set {get; set;}
    public required List<string> Images {get; set;}

}