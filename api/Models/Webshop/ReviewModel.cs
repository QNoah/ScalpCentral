using ScalpCentral.Api.Models;

public class ReviewModel
{
    public int Id {get; set;}
    public decimal Stars {get; set;}
    public string? Title {get; set;}
    public string? Description {get; set;}
    public DateTime? CreatedAt {get; set;}

    public required UserModel User {get; set;}
    public required ProductModel Product {get; set;}
}