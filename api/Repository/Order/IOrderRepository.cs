using ScalpCentral.Api.Models;

namespace ScalpCentral.Api.Repository;

public interface IOrderRepository
{
    Task<List<OrderModel>> GetAllAsync();
    Task<OrderModel?> GetByIdAsync(long id);
    Task<OrderInfoModel?> GetInfoByIdAsync(long id);
    Task<List<OrderModel>> GetByUserIdAsync(long userId);
    Task<List<OrderInfoModel>> GetInfoByUserIdAsync(long userId);
    Task<OrderModel> CreateAsync(OrderModel order);
    Task<OrderModel?> UpdateAsync(long id, OrderModel order);
    Task<bool> DeleteAsync(long id);
}
