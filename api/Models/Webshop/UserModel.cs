namespace ScalpCentral.Api.Models;

public class UserModel
{
    public int Id {get; set;}
    public required string FirstName {get; set;}
    public required string LastName {get; set;}
    public required string Email {get; set;}
    public required string Password {get; set;}
    public required string Iban {get; set;}
    public required string Postcode {get; set;}
    public required string Country {get; set;}
    public required string City {get; set;}
    public required string StreetName {get; set;}
    public required string StreetNumber {get; set;}
    public required string PhoneNumber {get; set;}
    public required int NegativeSellerCount {get; set;}
    public required int PositiveSellerCount {get; set;}
    public required string Role {get; set;} = "User";
    public required DateTime CreatedAt {get; set;}
    public bool SoftDelete { get; set; }
}