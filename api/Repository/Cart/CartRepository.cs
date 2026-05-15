using StackExchange.Redis;

public class CartRepository : ICartRepository
{
    private readonly IDatabase _db;

    public CartRepository(IConnectionMultiplexer redis)
    {
        _db = redis.GetDatabase();
    }

    public async Task AddItemAsync(string cartId, string productId, int quantity)
    {
        var key = $"cart:{cartId}";
        await _db.HashIncrementAsync(key, productId, quantity);
    }

    public async Task<HashEntry[]> GetCartAsync(string cartId)
    {
        return await _db.HashGetAllAsync($"cart:{cartId}");
    }

    public async Task SetExpiryAsync(string cartId)
    {
        var key = $"cart:{cartId}";
        await _db.KeyExpireAsync(key, TimeSpan.FromDays(7));
    }

    public async Task RemoveCartAsync(string cartId)
    {
        var key = $"cart:{cartId}";
        await _db.KeyDeleteAsync(key);
    }
}