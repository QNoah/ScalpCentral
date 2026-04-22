public class SetModel
{
    public required string Id { get; set; }
    public required string Name { get; set; }
    public required string Series { get; set; }
    public required int TotalCards { get; set; }
    public required DateOnly ReleaseDate { get; set; }
    public required string? ImageLogo { get; set; }
}