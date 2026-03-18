public class UserModel
{
    public int Id {get; set;}
    public required string FName {get; set;}
    public required string LName {get; set;}
    public required string Email {get; set;}
    public required string Password {get; set;}
    public required string Iban {get; set;}
    public required string Postcode {get; set;}
    public required string Country {get; set;}
    public required string City {get; set;}
    public required string StreetName {get; set;}
    public required string StreetNumber {get; set;}
    public required string Phonenumber {get; set;}
    public required int NegativeCount {get; set;}
    public required int PositiveCount {get; set;}
    public required string Role {get; set;}
    public required DateTime Created_at {get; set;}
    public DateTime? Deleted_at {get; set;}
    public bool SoftDeleted {get; set;}
}