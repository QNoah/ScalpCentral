using ScalpCentral.Api.Repository;

public class CartService : ICartService
{
    private readonly ICartRepository _cartRepo;
    private readonly IProductRepository _productRepo;

    public CartService(ICartRepository cRepo, IProductRepository pRepo)
    {
        _cartRepo = cRepo;
        _productRepo = pRepo;
    }

    public async Task AddToCart(string cartId, int productId, int quantity)
    {
        await _cartRepo.AddItemAsync(cartId, productId, quantity);
        await _cartRepo.SetExpiryAsync(cartId);
    }

    public async Task<List<CartItemDTO>> GetCart(string cartId)
    {
        var data = await _cartRepo.GetCartAsync(cartId);

        var productIds = data.Select(x => int.Parse(x.Name!)).ToList();
        var products = await _productRepo.GetAllById(productIds);

        var quantityMap = data.ToDictionary(
            x => int.Parse(x.Name!),
            x => (int)x.Value
        );

        var result = products
            .Select(product => new CartItemDTO
            {
                Product = product,
                Quantity = quantityMap[product.Id]
            })
            .ToList();

        return result;
    }

    public async Task ClearCart(string cartId)
    {
        await _cartRepo.RemoveCartAsync(cartId);
    }

    public async Task RemoveItem(string cartId, int productId)
    {
        await _cartRepo.RemoveItem(cartId, productId);
    }
}