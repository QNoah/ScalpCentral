public class CreateProductDto
{
    public required string SetId { get; set; }
    public required string Name { get; set; }
    public required string Type { get; set; }
    public required string Description { get; set; }
    public required decimal Price { get; set; }
    public int Stock { get; set; } = 0;
    public List<string>? Images { get; set; }
}