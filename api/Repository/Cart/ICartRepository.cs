using StackExchange.Redis;
public interface ICartRepository
{
    public Task AddItemAsync(string userId, string productId, int quantity);
    public Task<HashEntry[]> GetCartAsync(string userId);
    public Task SetExpiryAsync(string userId);
    public Task RemoveCartAsync(string userId);
}