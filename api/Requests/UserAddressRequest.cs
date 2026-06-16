public class UserAddressRequest
{
    public string? PhoneNumber { get; set; }
    public required string Country { get; set; }
    public required string City { get; set; }
    public required string Postcode { get; set; }
    public required string StreetName { get; set; }
    public required string StreetNumber { get; set; }
}
