public class CardModel
{
    public required string Id {get; set;}
    public required string Name {get; set;}
    public required string Supertype {get; set;}
    public string? Hp {get; set;}
    public string? EvolvesFrom {get; set;}
    public required string Artist {get; set;}
    public string? Rarity {get; set;}
    public string? FlavorText {get; set;}
    public required bool SoftDeleted {get; set;}

//---------------------------------------------------
//   get from different tables
//---------------------------------------------------

    public required List<string> Subtypes {get; set;}
    public required List<string> Types {get; set;}
    public required List<string> Rules {get; set;}
    public required ImageModel Images {get; set;}
    public required List<AttackModel> Attacks {get; set;}
    public required List<AbilityModel> Abilities {get; set;}
}