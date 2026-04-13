public class CardQueryOptions
{
    public string? Search { get; set; }
    public List<string>? Types { get; set; }
    public List<string>? Subtypes { get; set; }
    public int? MinHp { get; set; }
    public int? MaxHp { get; set; }
}