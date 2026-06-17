using Dapper;
using Npgsql;

namespace ScalpCentral.Api.Repository;

public class ProductRepository : RepositoryAccessBase, IProductRepository
{
    public override string Table() => "products";
    public string baseSql = """
        SELECT DISTINCT
        p.id, p.name, p.type, p.description, p.price, p.saleprice_modifier as SalepriceModifier, p.stock,
        s.id, s.name, s.series, s.total_cards as TotalCards, s.release_date as ReleaseDate, s.Image_logo as ImageLogo
        FROM products as p
        JOIN sets as s ON s.id = p.set_id
        WHERE p.soft_delete = false AND s.soft_delete = false
        """;

    public ProductRepository(IConfiguration config) : base(config) {}

    private (string, DynamicParameters) buildFilterQuery(ProductFilter? filter)
    {
        string whereClause = "";

        List<string> where = new List<string>();
        DynamicParameters parameters = new DynamicParameters();

        if (filter != null)
        {
            if (filter.InStock)
            {
                where.Add("p.stock > 0");
            }

            if (filter.OnSale)
            {
                where.Add("p.saleprice_modifier > 0");
            }

            if (filter.MinPrice != null)
            {
                where.Add("p.price >= @MinPrice");
                parameters.Add("MinPrice", filter.MinPrice);
            }

            if (filter.MaxPrice != null)
            {
                where.Add("p.price <= @MaxPrice");
                parameters.Add("MaxPrice", filter.MaxPrice);
            }

            if (!string.IsNullOrWhiteSpace(filter.Name))
            {
                where.Add("LOWER(p.name) LIKE LOWER(@Name)");
                parameters.Add("Name", $"%{filter.Name}%");
            }

            if (filter.Types != null)
            {
                where.Add("p.type = ANY(@Types)");
                parameters.Add("Types", filter.Types);
            }

            if(filter.SetNames != null)
            {
                where.Add("s.name = ANY(@Sets)");
                parameters.Add("Sets", filter.SetNames);
            }

            if(filter.Series != null)
            {
                where.Add("s.series = ANY(@Series)");
                parameters.Add("Series", filter.Series);
            }

            foreach (string condition in where)
            {
                whereClause += " AND " + condition;
            }
        }
        return (whereClause, parameters);
    }

    public async Task<List<ProductModel>> GetFiltered(ProductFilter? filter)
    {
        (string whereClause, DynamicParameters parameters) = buildFilterQuery(filter);

        string sql = baseSql + whereClause;

        return await RepoHelpers.TryQueryAsync(async () => {
                IEnumerable<ProductModel> result = await _con.QueryAsync<ProductModel, SetModel, ProductModel>(sql,(product, set) => {
                product.Set = set;
                return product;
                }, parameters, splitOn: "id");
                
                result = result.ToList();

                IEnumerable<(long productId, string imageUrl)> imageresult = await _con.QueryAsync<(long productId, string imageUrl)>("""
                SELECT
                i.product_id, i.image_url
                FROM product_images as i
                WHERE i.product_id = ANY(@Ids)
                """, new {Ids = result.Select(product => product.Id).ToList()});

                Dictionary<long, List<string>> images = imageresult.GroupBy(image => image.productId)
                .ToDictionary(group => group.Key, group => group.Select(i => i.imageUrl).ToList());

                foreach (ProductModel product in result)
                {
                    product.Images = images.GetValueOrDefault(product.Id);
                }

                return result.ToList();
            });
    }

    public async Task<PagedResults<ProductModel>> GetPaged(ProductFilter filter, int limit)
    {
        (string whereClause, DynamicParameters parameters) = buildFilterQuery(filter);

        string sql = baseSql + whereClause;
        if (filter.Sort != null)
        {

            if (filter.Sort == "priceLowHigh") sql += " ORDER BY p.price ASC";
            else if (filter.Sort == "priceHighLow") sql += " ORDER BY p.price DESC";
        }
        sql += " LIMIT @Limit OFFSET @PageOffset";
        parameters.Add("Limit", limit);
        parameters.Add("PageOffset", filter.Page * limit);

        string countSql = "SELECT COUNT(DISTINCT p.id) FROM products as p JOIN sets as s ON s.id = p.set_id WHERE p.soft_delete = false AND s.soft_delete = false" + whereClause;
        int count = await RepoHelpers.TryQueryAsync(async () =>
        {
            int result = await _con.QuerySingleAsync<int>(countSql, parameters);
            return result;
        });

        List<ProductModel> products = await RepoHelpers.TryQueryAsync(async () => {
            IEnumerable<ProductModel> result = await _con.QueryAsync<ProductModel, SetModel, ProductModel>(sql,(product, set) => {
            product.Set = set;
            return product;
            }, parameters, splitOn: "id");
            
            result = result.ToList();

            IEnumerable<(long productId, string imageUrl)> imageresult = await _con.QueryAsync<(long productId, string imageUrl)>("""
            SELECT
            i.product_id, i.image_url
            FROM product_images as i
            WHERE i.product_id = ANY(@Ids)
            """, new {Ids = result.Select(product => product.Id).ToList()});

            Dictionary<long, List<string>> images = imageresult.GroupBy(image => image.productId)
            .ToDictionary(group => group.Key, group => group.Select(i => i.imageUrl).ToList());

            foreach (ProductModel product in result)
            {
                product.Images = images.GetValueOrDefault(product.Id);
            }

            return result.ToList();
        });

        return new PagedResults<ProductModel>(count, products);
    }

    public async Task<Dictionary<string, string[]>> GetFilters(ProductFilter filter)
    {
        Dictionary<string, string[]> results = [];
        (string whereClause, DynamicParameters parameters) = buildFilterQuery(filter);

        results.Add("types", await RepoHelpers.TryQueryAsync(async () =>
        {
            IEnumerable<string> types = await _con.QueryAsync<string>(GetFilterSql("p.type") + whereClause, parameters);
            return types.ToArray();
        }));

        results.Add("sets", await RepoHelpers.TryQueryAsync(async () =>
        {
            IEnumerable<string> sets = await _con.QueryAsync<string>(GetFilterSql("s.name") + whereClause, parameters);
            return sets.ToArray();
        }));

        results.Add("series", await RepoHelpers.TryQueryAsync(async () =>
        {
            IEnumerable<string> series = await _con.QueryAsync<string>(GetFilterSql("s.series") + whereClause, parameters);
            return series.ToArray();
        }));

        return results;
    }

    private string GetFilterSql(string column)
    {
        return $"""
        SELECT DISTINCT {column}
        FROM products as p 
        JOIN sets as s ON s.id = p.set_id 
        WHERE p.soft_delete = false AND s.soft_delete = false
        """;
    }
    public async Task<ProductModel?> GetById(long id)
    {
        string sql = baseSql + $" AND p.id = @Id";

        ProductModel? product = await RepoHelpers.TryQueryAsync(async () => {
            IEnumerable<ProductModel> result = await _con.QueryAsync<ProductModel,SetModel, ProductModel>(sql, 
            (product, set) => {
            product.Set = set;
            return product;
            }, new { Id = id }, splitOn: "id");

            return result.ToList().FirstOrDefault();
        });

        if (product == null) return null;
        
        List<string> images = await RepoHelpers.TryQueryAsync(async () => {
            IEnumerable<string> result = await _con.QueryAsync<string>($"""
            SELECT
            i.image_url
            FROM product_images as i
            WHERE i.product_id = @Id
            """, new { Id = id });

            return result.ToList();
        });

        product.Images = images.Count > 0 ? images : null;

        return product;
    }

    public Task<long> Create(CreateProductDto product)
    {
        string insertProduct = """
        INSERT INTO products (set_id, name, type, description, price, stock) VALUES (@SetId, @Name, @Type, @Description, @Price, @Stock)
        RETURNING id
        """;

        string insertImage = """
        INSERT INTO product_images (product_id, image_url) VALUES (@ProductId, @Url)
        """;

        DynamicParameters productParameters = new ();
        productParameters.Add("SetId", product.SetId);
        productParameters.Add("Name", product.Name);
        productParameters.Add("Type", product.Type);
        productParameters.Add("Description", product.Description);
        productParameters.Add("Price", product.Price);
        productParameters.Add("Stock", product.Stock);

        return RepoHelpers.TryQueryAsync(async () => {
                long newId = await _con.QuerySingleAsync<long>(insertProduct, productParameters);
                if (product.Images == null) return newId;

                foreach (string url in product.Images)
                {
                    DynamicParameters imageParameters = new();
                    imageParameters.Add("ProductId", newId);
                    imageParameters.Add("Url", url);
                    await _con.ExecuteAsync(insertImage, imageParameters);
                }
                
                return newId;
            });
    }

    

    public async Task<long> SoftDelete(long id)
    {
        string sql = """
        UPDATE products
        SET soft_delete = NOT soft_delete
        WHERE id = @Id
        RETURNING id
        """;

        return await RepoHelpers.TryQueryAsync(async () => await _con.QuerySingleAsync<long>(sql, new {Id = id}));
    }

    public async Task HardDelete()
    {
        string sql = """
        DELETE FROM products
        WHERE soft_delete = true
        """;

        await RepoHelpers.TryExecuteAsync(async () => await _con.ExecuteAsync(sql));
    }

    public async Task<long> Update(ProductModel product)
    {
        string sql = """
        UPDATE products
        SET
        name = @Name,
        type = @Type,
        description = @Description,
        price = @Price,
        saleprice_modifier = @SalepriceModifier,
        stock = @Stock,
        set_id = @SetId
        WHERE id = @Id
        RETURNING id
        """;

        return await RepoHelpers.TryQueryAsync(async () => await _con.QuerySingleAsync<long>(sql, new {
        product.Name,
        product.Type,
        product.Description,
        product.Price,
        product.SalepriceModifier,
        product.Stock,
        SetId = product.Set.Id,
        product.Id
        }));
    }

    public async Task<List<ProductModel>> GetAllById(List<int> ids)
    {
        var sql = """
        SELECT 
            p.id, 
            p.name, 
            p.type, 
            p.description, 
            p.price, 
            p.saleprice_modifier AS SalepriceModifier, 
            p.stock,

            s.id AS Id, 
            s.name AS Name, 
            s.series, 
            s.release_date,

            pi.image_url

        FROM products p
        INNER JOIN sets s ON p.set_id = s.id
        LEFT JOIN product_images pi ON p.id = pi.product_id

        WHERE p.soft_delete = FALSE
        AND p.id = ANY(@Ids)
        """;

        var productDict = new Dictionary<int, ProductModel>();

        var result = await RepoHelpers.TryQueryAsync(async () =>
            await _con.QueryAsync<ProductModel, SetModel, string, ProductModel>(
                sql,
                (product, set, image) =>
                {
                    if (!productDict.TryGetValue(product.Id, out var existing))
                    {
                        existing = product;
                        existing.Set = set;
                        existing.Images = new List<string>();
                        productDict.Add(existing.Id, existing);
                    }

                    if (image != null)
                    {
                        existing.Images!.Add(image);
                    }

                    return existing;
                },
                new { Ids = ids },
                splitOn: "Id,image_url"
            )
        );

        return productDict.Values.ToList();
    }
}