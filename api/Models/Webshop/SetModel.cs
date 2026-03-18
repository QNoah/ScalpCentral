public class SetModel
{
    public required string Id {get; set;}
    public required string Name {get; set;}
    public required int Series {get; set;}
    public required int Total_cards {get; set;}
    public required int Release_date {get; set;}
    public required string? Image_logo {get; set;}
    public required bool SoftDeleted {get; set;}
}