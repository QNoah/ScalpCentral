public interface ICartService
{
    public Task AddToCart(string cartId, int productId, int quantity);
    public Task<List<CartItemDTO>> GetCart(string cartId);
    public Task ClearCart(string cartId);
    public Task UpdateQuantity(string cartId, int productId, int quantity);
    public Task RemoveItem(string cartId, int productId);
}