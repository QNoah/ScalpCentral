public class ReviewFilter
{
    public decimal? Stars {get; set;} = null;
    public int? ProductId {get; set;} = null;
    public int? UserId {get; set;} = null;

    public int? Page { get; set; } = 1;
}