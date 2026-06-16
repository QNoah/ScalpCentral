using ScalpCentral.Api.Models;

namespace api.Tests;

internal static class TestData
{
    public static UserDto UserDto(int id = 1) => new()
    {
        Id = id,
        FirstName = "Ash",
        LastName = "Ketchum",
        Email = "ash@example.com",
        Role = "User"
    };

    public static UserModel User(int id = 1, string password = "hashed-password") => new()
    {
        Id = id,
        FirstName = "Ash",
        LastName = "Ketchum",
        Email = "ash@example.com",
        Password = password,
        Iban = "NL91ABNA0417164300",
        Postcode = "3011AA",
        Country = "Netherlands",
        City = "Rotterdam",
        StreetName = "Coolsingel",
        StreetNumber = "1",
        PhoneNumber = "0612345678",
        NegativeSellerCount = 0,
        PositiveSellerCount = 10,
        Role = "User",
        CreatedAt = new DateTime(2026, 1, 1)
    };

    public static OrderModel Order(long id = 1) => new()
    {
        Id = id,
        OrderNumber = $"ORD-{id}",
        UserId = 7,
        Email = "buyer@example.com",
        Price = 29.95m,
        Country = "Netherlands",
        City = "Rotterdam",
        Postcode = "3011AA",
        StreetName = "Coolsingel",
        StreetNumber = "1",
        CreatedAt = new DateTime(2026, 1, 2)
    };

    public static SetModel Set(string id = "base1") => new()
    {
        Id = id,
        Name = "Base Set",
        Series = "Base",
        TotalCards = 102,
        ReleaseDate = new DateOnly(1999, 1, 9),
        ImageLogo = "https://example.com/base.png"
    };

    public static ProductModel Product(int id = 1) => new()
    {
        Id = id,
        Name = "Booster Pack",
        Type = "Sealed",
        Description = "Pokemon booster pack",
        Price = 4.99m,
        SalepriceModifier = 1m,
        Stock = 12,
        Set = Set(),
        Images = new List<string> { "https://example.com/product.png" }
    };

    public static LoginRequest Login(string password = "secret") => new()
    {
        Email = "ash@example.com",
        Password = password
    };

    public static RegisterRequest Register(string password = "secret") => new()
    {
        FName = "Ash",
        LName = "Ketchum",
        Email = "ash@example.com",
        Password = password
    };
}
