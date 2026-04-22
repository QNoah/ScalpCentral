using ScalpCentral.Api.Models;

namespace ScalpCentral.Api.Services;

public interface IOrderService
{
    Task<List<OrderModel>> GetAllOrdersAsync();
    Task<OrderModel?> GetOrderByIdAsync(long id);
    Task<OrderInfoModel?> GetOrderInfoByIdAsync(long id);
    Task<List<OrderModel>> GetOrdersByUserIdAsync(long userId);
    Task<List<OrderInfoModel>> GetOrderInfoByUserIdAsync(long userId);
    Task<OrderModel> CreateOrderAsync(OrderModel order);
    Task<OrderModel?> UpdateOrderAsync(long id, OrderModel order);
    Task<bool> DeleteOrderAsync(long id);
}
