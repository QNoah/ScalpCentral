using StackExchange.Redis;

public class CartRepository : ICartRepository
{
    private readonly IDatabase _db;

    public CartRepository(IConnectionMultiplexer redis)
    {
        _db = redis.GetDatabase();
    }

    public async Task AddItemAsync(string userId, string productId, int quantity)
    {
        var key = $"cart:{userId}";
        await _db.HashIncrementAsync(key, productId, quantity);
    }

    public async Task<HashEntry[]> GetCartAsync(string userId)
    {
        return await _db.HashGetAllAsync($"cart:{userId}");
    }

    public async Task SetExpiryAsync(string userId)
    {
        var key = $"cart:{userId}";
        await _db.KeyExpireAsync(key, TimeSpan.FromDays(7));
    }

    public async Task RemoveCartAsync(string userId)
    {
        var key = $"cart:{userId}";
        await _db.KeyDeleteAsync(key);
    }
}