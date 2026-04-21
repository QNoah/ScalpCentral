using ScalpCentral.Api.Models;

namespace ScalpCentral.Api.Repository;

public interface ICardRepository
{
    List<CardModel> GetPagedCards(CardQueryOptions options, int limit, int offset);
    List<string> GetPagedCardIds(CardQueryOptions options, int limit, int offset);
    List<CardModel> GetBaseCards(List<string> ids);
    Dictionary<string, List<string>> GetTypes(List<string> ids);
    Dictionary<string, List<string>> GetSubtypes(List<string> ids);
    Dictionary<string, List<AttackModel>> GetAttacks(List<string> ids);
    Dictionary<string, List<AbilityModel>> GetAbilities(List<string> ids);
    Dictionary<string, List<string>> GetRules(List<string> ids);
    Dictionary<string, ImageModel> GetImages(List<string> ids);
}