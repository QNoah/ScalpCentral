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

    public async Task AddToCart(string userId, string productId, int quantity)
    {
        await _cartRepo.AddItemAsync(userId, productId, quantity);
        await _cartRepo.SetExpiryAsync(userId);
    }

    public async Task<List<CartItemDTO>> GetCart(string userId)
    {
        var data = await _cartRepo.GetCartAsync(userId);

        var productIds = data.Select(x => (int)x.Name).ToList();
        var products = await _productRepo.GetAllById(productIds);

        var quantityMap = data.ToDictionary(
            x => (int)x.Name,
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

    public async Task ClearCart(string userId)
    {
        await _cartRepo.RemoveCartAsync(userId);
    }
}