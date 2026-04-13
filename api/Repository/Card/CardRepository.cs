using System.ComponentModel.DataAnnotations.Schema;
using Dapper;

namespace ScalpCentral.Api.Repository;

public class CardRepository : RepositoryAccessBase, ICardRepository
{
    public override string Table() => "cards";

    public List<CardModel> GetPaged(int limit, int offset)
    {
        string sql = $@"
        SELECT * FROM {Table()}
        
        LIMIT @Limit OFFSET @Offset";
        return _con.Query<CardModel>(sql, new { Limit = limit, Offset = offset }).ToList();
    }
}