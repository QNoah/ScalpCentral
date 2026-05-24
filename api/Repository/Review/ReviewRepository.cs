using Dapper;
using ScalpCentral.Api.Repository;

public class ReviewRepository : IReviewRepository, RepositoryAccessBase
{
    public override string Table() => "product_reviews";
    public string baseSql = $"""
    SELECT DISTINCT
    r.id, r.stars, r.title, r.description, r.created_at AS CreatedAt
    JOIN 
    """;
    public ReviewRepository(IConfiguration config)  : base(config) {}
}