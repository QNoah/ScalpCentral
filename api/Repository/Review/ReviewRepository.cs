using Dapper;
using ScalpCentral.Api.Repository;

public class ReviewRepository : RepositoryAccessBase, IReviewRepository
{
    public override string Table() => "product_reviews";
    public string baseSql = $"""
    SELECT DISTINCT
    r.id, r.stars, r.title, r.description, r.created_at AS CreatedAt,
    u.first_name AS FirstName, u.last_name AS LastName 
    FROM product_reviews as r
    JOIN users as u ON u.id = r.user_id
    WHERE u.soft_delete = false
    """;
    public ReviewRepository(IConfiguration config)  : base(config) {}

    private (string, DynamicParameters) buildFilterQuery(ReviewFilter filter)
    {
        DynamicParameters parameters = new DynamicParameters();
        string whereClause = "";

        if (filter.Stars is not null)
        {
            whereClause += " AND r.stars >= @Stars";
            parameters.Add("Stars", filter.Stars);
        }

        if (filter.UserId is not null)
        {
            whereClause += " AND r.user_id = @Uid";
            parameters.Add("Uid", filter.UserId);
        }   

        if (filter.ProductId is not null)
        {
            whereClause += " AND r.product_id = @Pid";
            parameters.Add("Pid", filter.ProductId);
        }

        return (whereClause, parameters);
    }

    public async Task<ReviewModel?> GetById(long id)
    {
        string sql = baseSql + " AND r.id = @Id";
        DynamicParameters parameters = new DynamicParameters();
        parameters.Add("Id", id);

        return await RepoHelpers.TryQueryAsync(async() => 
            await _con.QuerySingleAsync<ReviewModel>(sql, parameters)
        );
    }

    public async Task<List<ReviewModel>> GetFiltered(ReviewFilter filter)
    {
        (string whereClause, DynamicParameters parameters) = buildFilterQuery(filter);
        string sql = baseSql + whereClause;

        return await RepoHelpers.TryQueryAsync(async() =>
        {
            IEnumerable<ReviewModel> filtered = await _con.QueryAsync<ReviewModel>(sql, parameters);
            return filtered.ToList();
        });
    }

    public async Task<PagedResults<ReviewModel>> GetPaged(ReviewFilter filter, int limit)
    {
         (string whereClause, DynamicParameters parameters) = buildFilterQuery(filter);
        string sql = baseSql + whereClause;

        sql += " LIMIT @Limit OFFSET @Page";
        parameters.Add("Page", filter.Page - 1);
        parameters.Add("Limit", limit);

        string countSql = "SELECT COUNT(DISTINCT r.id) FROM product_reviews as r JOIN users as u ON u.id = r.user_id WHERE u.soft_delete = false" + whereClause;
        int count = await RepoHelpers.TryQueryAsync(async () =>
        {
            int result = await _con.QuerySingleAsync<int>(countSql, parameters);
            return result;
        });

        List<ReviewModel> page = await RepoHelpers.TryQueryAsync(async() =>
        {
            IEnumerable<ReviewModel> filtered = await _con.QueryAsync<ReviewModel>(sql, parameters);
            return filtered.ToList();
        });

        return new PagedResults<ReviewModel>(count, page);
    }


    public async Task<long> Create(ReviewDTO review)
    {
        string sql = """
            INSERT INTO product_reviews (user_id, product_id, stars, title, description)
            VALUES (@Uid, @Pid, @Stars, @Title, @Description)
            RETURNING id
            """;

        DynamicParameters parameters = new DynamicParameters();

        parameters.Add("Uid", review.UserId);
        parameters.Add("Pid", review.ProductId);
        parameters.Add("Stars", review.Stars);
        parameters.Add("Title", review.Title);
        parameters.Add("Description", review.Description);

        long id = await RepoHelpers.TryQueryAsync(async() => await _con.QuerySingleAsync<long>(sql, parameters));

        return id;
    }

    public async Task<long> Update(ReviewDTO review, long id)
    {
        string sql = """
        UPDATE product_reviews SET
        """;
        DynamicParameters parameters = new DynamicParameters();

        if (review.UserId is not null)
        {
            sql += " user_id = @Uid,";
            parameters.Add("Uid", review.UserId);
        }

        if (review.ProductId is not null)
        {
            sql += " product_id = @Pid,";
            parameters.Add("Pid", review.ProductId);
        }

        if (review.Stars is not null)
        {
            sql += " stars = @Stars,";
            parameters.Add("Stars", review.Stars);
        }

        if (review.Title is not null)
        {
            sql += " title = @Title,";
            parameters.Add("Title", review.Title);
        }

        if (review.Description is not null)
        {
            sql += " description = @Description,";
            parameters.Add("Description", review.Description);
        }

        sql = sql.TrimEnd(',') + " WHERE id = @Id RETURNING id";
        parameters.Add("Id", id);

        return await RepoHelpers.TryQueryAsync(async () => await _con.QuerySingleAsync<long>(sql, parameters));

    }

    public async Task Delete(long id)
    {
        string sql = "DELETE FROM product_reviews WHERE id = @Id";
        DynamicParameters parameters = new DynamicParameters();
        parameters.Add("Id", id);

        await RepoHelpers.TryExecuteAsync(async () => await _con.ExecuteAsync(sql, parameters));
    }
}
