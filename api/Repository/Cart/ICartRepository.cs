using StackExchange.Redis;
public interface ICartRepository
{
    public Task AddItemAsync(string cartId, int productId, int quantity);
    public Task<HashEntry[]> GetCartAsync(string cartId);
    public Task SetExpiryAsync(string cartId);
    public Task RemoveCartAsync(string cartId);
}