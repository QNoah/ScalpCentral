using ScalpCentral.Api.Models;

namespace ScalpCentral.Api.Repository;

public interface ICardRepository
{
    List<CardModel> GetPaged(int limit, int offset);
}