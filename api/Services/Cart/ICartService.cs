public interface ICartService
{
    public Task AddToCart(string cartId, string productId, int quantity);
    public Task<List<CartItemDTO>> GetCart(string cartId);
    public Task ClearCart(string cartId);
}