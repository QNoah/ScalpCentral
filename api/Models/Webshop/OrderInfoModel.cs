public class OrderInfoModel
{
    public int Id {get; set;}
    public required string Ordernumber {get; set;}
    public required decimal Price {get; set;}
    public required DateTime Created_at {get; set;}
    public DateTime? Deleted_at {get; set;}
    public required bool SoftDeleted {get; set;}

//---------------------------------------------------
//   either
//---------------------------------------------------

    public required string Address {get; set;}
    public required string Email {get; set;}
    public required string Phonenumber {get; set;}

//---------------------------------------------------
//   get from different tables
//---------------------------------------------------
    public required UserModel User {get; set;}
    public required Dictionary<ProductModel, int> Cart {get; set;}
}