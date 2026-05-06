public interface ICartService
{
    public Task AddToCart(string userId, string productId, int quantity);
    public Task<List<CartItemDTO>> GetCart(string userId);
    public Task ClearCart(string userId);
}