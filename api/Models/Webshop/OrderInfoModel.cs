namespace ScalpCentral.Api.Models;

public class OrderInfoModel
{
    public required OrderModel Order { get; set; }
    public UserModel? User { get; set; }
    public required List<OrderItemModel> Items { get; set; }
}

public class OrderItemModel
{
    public long ProductId { get; set; }
    public required string ProductName { get; set; }
    public decimal UnitPrice { get; set; }
    public int Amount { get; set; }
}