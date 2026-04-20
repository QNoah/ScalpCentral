using ScalpCentral.Api.Models;

public class ReviewModel
{
    public int Id {get; set;}
    public required decimal Stars {get; set;}
    public required string Title {get; set;}
    public required string Description {get; set;}

//---------------------------------------------------
//   get from different tables
//---------------------------------------------------

    public required UserModel User {get; set;}
    public required ProductModel Product {get; set;}
}