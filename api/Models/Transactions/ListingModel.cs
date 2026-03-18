public class ListingModel
{
    public required int Id {get; set;}
    public required string UserEmail {get; set;}
    public required string Title {get; set;}
    public string? Description {get; set;}
    public required decimal Price {get; set;}
    public required bool Sold {get; set;}
    public required bool Bids_permitted {get; set;}
    public required DateTime Created_at {get; set;}
    public DateTime? Deleted_at {get; set;}
    public required bool SoftDeleted {get; set;}

//---------------------------------------------------
//   get from different tables
//---------------------------------------------------
    public required CardModel Card {get; set;}
    public required UserModel User {get; set;}
    public required List<string> Image {get; set;}
    public List<BidModel>? Bids {get; set;}

}