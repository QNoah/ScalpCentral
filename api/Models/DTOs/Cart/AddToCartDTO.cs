public class AddToCartDTO
{
    public required string CartId { get; set; }
    public required int ProductId { get; set; }
    public required int Quantity { get; set; }
}