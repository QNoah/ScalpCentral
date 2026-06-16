namespace ScalpCentral.Api.Models;

public class OrderModel
{
    public long Id { get; set; }
    public required string OrderNumber { get; set; }
    public long UserId { get; set; }
    public string? PhoneNumber { get; set; }
    public required string Email { get; set; }
    public decimal Price { get; set; }
    public required string Country { get; set; }
    public required string City { get; set; }
    public required string Postcode { get; set; }
    public required string StreetName { get; set; }
    public required string StreetNumber { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
    public bool SoftDelete { get; set; }
    public List<OrderContentModel> Items { get; set; } = new();
}

public class OrderContentModel
{
    public long ProductId { get; set; }
    public int Amount { get; set; }
}
