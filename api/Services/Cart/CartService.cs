public class CartService : ICartService
{
    private readonly ICartRepository _repo;

    public CartService(ICartRepository repo)
    {
        _repo = repo;
    }

    public async Task AddToCart(string userId, string productId, int quantity)
    {
        await _repo.AddItemAsync(userId, productId, quantity);
        await _repo.SetExpiryAsync(userId);
    }

    public async Task<Dictionary<string, int>> GetCart(string userId)
    {
        var data = await _repo.GetCartAsync(userId);

        return data.ToDictionary(
            x => x.Name.ToString(),
            x => (int)x.Value
        );
    }

    public async Task ClearCart(string userId)
    {
        await _repo.RemoveCartAsync(userId);
    }
}