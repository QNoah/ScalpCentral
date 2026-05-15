using System.Collections.Specialized;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.SqlTypes;
using System.Text;
using Dapper;

namespace ScalpCentral.Api.Repository;

public class CardRepository : RepositoryAccessBase, ICardRepository
{
    public override string Table() => "cards";

    public CardRepository(IConfiguration config) : base(config) {}

    public List<CardModel> GetPagedCards(CardQueryOptions options, int limit, int offset)
    {
        List<string> cardIds = GetPagedCardIds(options, limit, offset);

        if (!cardIds.Any())
            return new List<CardModel>();

        List<CardModel> cards = GetBaseCards(cardIds);
        Dictionary<string, List<string>> subtypes = GetSubtypes(cardIds);
        Dictionary<string, List<string>> types = GetTypes(cardIds);
        Dictionary<string, List<string>> rules = GetRules(cardIds);
        Dictionary<string, List<AttackModel>> attacks = GetAttacks(cardIds);
        Dictionary<string, List<AbilityModel>> abilities = GetAbilities(cardIds);
        Dictionary<string, ImageModel> images = GetImages(cardIds);


        foreach (CardModel card in cards)
        {
            card.Subtypes = subtypes.GetValueOrDefault(card.Id, new());
            card.Types = types.GetValueOrDefault(card.Id, new());
            card.Rules = rules.GetValueOrDefault(card.Id, new());
            card.Attacks = attacks.GetValueOrDefault(card.Id, new());
            card.Abilities = abilities.GetValueOrDefault(card.Id, new());
            card.Images = images.GetValueOrDefault(card.Id)!;
        }

        return cards;
    }

    public List<string> GetPagedCardIds(CardQueryOptions options, int limit, int offset)
    {
        string sql = "SELECT DISTINCT c.id FROM cards c";

        List<string> where = new();
        DynamicParameters parameters = new();

        if (!string.IsNullOrWhiteSpace(options.Search))
        {
            where.Add("LOWER(c.name) LIKE LOWER(@Search)");
            parameters.Add("Search", $"%{options.Search}%");
        }

        if (options.MinHp.HasValue)
        {
            where.Add("CAST(c.hp AS INT) >= @MinHp");
            parameters.Add("MinHp", options.MinHp.Value);
        }

        if (options.Types?.Any() == true)
        {
            sql += @"
                JOIN cards_to_types ct ON ct.card_id = c.id
                JOIN types t ON t.id = ct.type_id
            ";

            where.Add("t.name = ANY(@Types)");
            parameters.Add("Types", options.Types);
        }

        if (options.Subtypes?.Any() == true)
        {
            sql += @"
                JOIN cards_to_subtypes cs ON cs.card_id = c.id
                JOIN subtypes s ON s.id = cs.subtype_id
            ";

            where.Add("s.name = ANY(@Subtypes)");
            parameters.Add("Subtypes", options.Subtypes);
        }

        if (where.Any())
        {
            sql += " WHERE " + string.Join(" AND ", where);
        }

        sql += " ORDER BY c.id LIMIT @Limit OFFSET @Offset";

        parameters.Add("Limit", limit);
        parameters.Add("Offset", offset);

        return _con.Query<string>(sql, parameters).ToList();
    }

    public List<CardModel> GetBaseCards(List<string> ids)
    {
        string sql = @"SELECT id, name, supertype, hp, evolves_from as EvolvesFrom, artist, rarity, flavor_text as FlavorText, soft_delete as SoftDeleted
            FROM cards WHERE id = ANY(@Ids)";
        return _con.Query<CardModel>(sql, new { Ids = ids }).ToList();
    }

    public Dictionary<string, List<string>> GetTypes(List<string> ids)
    {
        IEnumerable<(string cardId, string typeName)> rows = _con.Query<(string cardId, string typeName)>(@"
            SELECT ctt.card_id, t.name
            FROM cards_to_types ctt
            JOIN types t ON t.id = ctt.type_id
            WHERE ctt.card_id = ANY(@Ids)
        ", new { Ids = ids });

        return rows
            .GroupBy(x => x.cardId)
            .ToDictionary(
                g => g.Key,
                g => g.Select(x => x.typeName).Distinct().ToList()
            );
    }

    public Dictionary<string, List<string>> GetSubtypes(List<string> ids)
    {
        IEnumerable<(string cardId, string name)> rows = _con.Query<(string cardId, string name)>(@"
        SELECT cts.card_id, st.name
        FROM cards_to_subtypes cts
        JOIN subtypes st ON st.id = cts.subtype_id
        WHERE cts.card_id = ANY(@Ids)
        ", new { Ids = ids });

        return rows
            .GroupBy(x => x.cardId)
            .ToDictionary(
                g => g.Key,
                g => g.Select(x => x.name).ToList()
            );
    }

    public Dictionary<string, List<AttackModel>> GetAttacks(List<string> ids)
    {
        IEnumerable<(string cardId, string name, string damage, string description)> rows = _con.Query<(string cardId, string name, string damage, string description)>(@"
        SELECT cta.card_id, a.name, a.damage, a.description
        FROM cards_to_attacks cta
        JOIN attacks a ON a.id = cta.attack_id
        WHERE cta.card_id = ANY(@Ids)
        ", new { Ids = ids });

        return rows
            .GroupBy(x => x.cardId)
            .ToDictionary(
                g => g.Key,
                g => g.Select( x => 
                new AttackModel
                {
                    Name = x.name,
                    Damage = x.damage,
                    Description = x.description
                }
                ).ToList()
            );
    }

    public Dictionary<string, List<AbilityModel>> GetAbilities(List<string> ids)
    {
        IEnumerable<(string cardId, string name, string type, string description)> rows = _con.Query<(string cardId, string name, string type, string description)>(@"
        SELECT cta.card_id, a.name, a.type, a.description
        FROM cards_to_abilities cta
        JOIN abilities a ON a.id = cta.ability_id
        WHERE cta.card_id = ANY(@Ids)
        ", new { Ids = ids });
        
        return rows
            .GroupBy(x => x.cardId)
            .ToDictionary(
                g => g.Key,
                g => g.Select( x => 
                new AbilityModel
                {
                    Name = x.name,
                    Type = x.type,
                    Description = x.description
                }
                ).ToList()
            );
    }


    public Dictionary<string, List<string>> GetRules(List<string> ids)
    {
        IEnumerable<(string cardId, string description)> rows = _con.Query<(string cardId, string description)>(@"
            SELECT ctr.card_id, r.description
            FROM cards_to_rules ctr
            JOIN rules r ON r.id = ctr.rule_id
            WHERE ctr.card_id = ANY(@Ids)
        ", new { Ids = ids });
        return rows
            .GroupBy(x => x.cardId)
            .ToDictionary(
                g => g.Key,
                g => g.Select(x => x.description).ToList()
            );
    }


    public Dictionary<string, ImageModel> GetImages(List<string> ids)
    {
        IEnumerable<(string cardId, string small, string large)> rows = _con.Query<(string cardId, string small, string large)>(@"
            SELECT c.id, i.small, i.large
            FROM cards c
            JOIN card_images i ON i.id = c.images_id
            WHERE c.id = ANY(@Ids)
        ", new { Ids = ids });

        return rows.ToDictionary(
            x => x.cardId,
            x => new ImageModel
            {
                Small = x.small,
                Large = x.large
            }
        );
    }
}