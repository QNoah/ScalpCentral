using ScalpCentral.Api.Models;
using ScalpCentral.Api.Repository;

namespace ScalpCentral.Api.Services;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;

    public OrderService(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task<List<OrderModel>> GetAllOrdersAsync()
    {
        return await _orderRepository.GetAllAsync();
    }

    public async Task<OrderModel?> GetOrderByIdAsync(long id)
    {
        return await _orderRepository.GetByIdAsync(id);
    }


    public async Task<OrderInfoModel?> GetOrderInfoByIdAsync(long id)
    {
        return await _orderRepository.GetInfoByIdAsync(id);
    }

    public async Task<List<OrderModel>> GetOrdersByUserIdAsync(long userId)
    {
        return await _orderRepository.GetByUserIdAsync(userId);
    }

    public async Task<List<OrderInfoModel>> GetOrderInfoByUserIdAsync(long userId)
    {
        return await _orderRepository.GetInfoByUserIdAsync(userId);
    }

    public async Task<OrderModel> CreateOrderAsync(OrderModel order)
    {
        return await _orderRepository.CreateAsync(order);
    }

    public async Task<OrderModel?> UpdateOrderAsync(long id, OrderModel order)
    {
        return await _orderRepository.UpdateAsync(id, order);
    }

    public async Task<bool> DeleteOrderAsync(long id)
    {
        return await _orderRepository.DeleteAsync(id);
    }
}
