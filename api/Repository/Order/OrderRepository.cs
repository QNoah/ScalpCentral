using Dapper;
using ScalpCentral.Api.Models;

namespace ScalpCentral.Api.Repository;

public class OrderRepository : RepositoryAccessBase, IOrderRepository
{
	private sealed class OrderLineRow
	{
		public long OrderId { get; set; }
		public long ProductId { get; set; }
		public required string ProductName { get; set; }
		public decimal UnitPrice { get; set; }
		public int Amount { get; set; }
	}

	public override string Table() => "orders";

	private static string OrderSelectColumns => @"
		id AS Id,
		order_number AS OrderNumber,
		user_id AS UserId,
		phone_number AS PhoneNumber,
		email AS Email,
		price AS Price,
		country AS Country,
		city AS City,
		postcode AS Postcode,
		street_name AS StreetName,
		street_number AS StreetNumber,
		created_at AS CreatedAt,
		deleted_at AS DeletedAt,
		soft_delete AS SoftDelete";

	private static string UserSelectColumns => @"
		id AS Id,
		first_name AS FirstName,
		last_name AS LastName,
		email AS Email,
		password AS Password,
		iban AS Iban,
		postcode AS Postcode,
		country AS Country,
		city AS City,
		street_name AS StreetName,
		street_number AS StreetNumber,
		phone_number AS PhoneNumber,
		negative_seller_count AS NegativeSellerCount,
		positive_seller_count AS PositiveSellerCount,
		role AS Role,
		created_at AS CreatedAt,
		deleted_at AS DeletedAt,
		soft_delete AS SoftDelete";
	
	public OrderRepository(IConfiguration config) : base(config) {}

	public async Task<List<OrderModel>> GetAllAsync()
	{
		var sql = $@"
			SELECT {OrderSelectColumns}
			FROM {Table()}
			WHERE soft_delete = FALSE
			ORDER BY id;";

		var orders = await RepoHelpers.TryQueryAsync(() => _con.QueryAsync<OrderModel>(sql));
		return orders.ToList();
	}

	public async Task<OrderModel?> GetByIdAsync(long id)
	{
		var sql = $@"
			SELECT {OrderSelectColumns}
			FROM {Table()}
			WHERE id = @Id
			  AND soft_delete = FALSE;";

		return await RepoHelpers.TryQueryAsync(() => _con.QuerySingleOrDefaultAsync<OrderModel>(sql, new { Id = id }));
	}

	public async Task<List<OrderModel>> GetByUserIdAsync(long userId)
	{
		var sql = $@"
			SELECT {OrderSelectColumns}
			FROM {Table()}
			WHERE user_id = @UserId
			  AND soft_delete = FALSE
			ORDER BY id;";

		var orders = await RepoHelpers.TryQueryAsync(() => _con.QueryAsync<OrderModel>(sql, new { UserId = userId }));
		return orders.ToList();
	}

	public async Task<OrderInfoModel?> GetInfoByIdAsync(long id)
	{
		var order = await GetByIdAsync(id);
		if (order is null)
		{
			return null;
		}

		var userSql = $@"
			SELECT {UserSelectColumns}
			FROM users
			WHERE id = @UserId;";

		var user = await RepoHelpers.TryQueryAsync(() => _con.QuerySingleOrDefaultAsync<UserModel>(userSql, new { UserId = order.UserId }));

		var itemsSql = @"
			SELECT
				oc.product_id AS ProductId,
				p.name AS ProductName,
				p.price AS UnitPrice,
				oc.amount AS Amount
			FROM order_contents oc
			JOIN products p ON p.id = oc.product_id
			WHERE oc.order_id = @OrderId
			ORDER BY oc.product_id;";

		var items = await RepoHelpers.TryQueryAsync(() => _con.QueryAsync<OrderItemModel>(itemsSql, new { OrderId = id }));

		return new OrderInfoModel
		{
			Order = order,
			User = user,
			Items = items.ToList()
		};
	}

	public async Task<List<OrderInfoModel>> GetInfoByUserIdAsync(long userId)
	{
		var orders = await GetByUserIdAsync(userId);
		if (!orders.Any())
		{
			return new List<OrderInfoModel>();
		}

		var userSql = $@"
			SELECT {UserSelectColumns}
			FROM users
			WHERE id = @UserId;";

		var user = await RepoHelpers.TryQueryAsync(() => _con.QuerySingleOrDefaultAsync<UserModel>(userSql, new { UserId = userId }));

		var orderIds = orders.Select(order => order.Id).ToList();
		var itemsSql = @"
			SELECT
				oc.order_id AS OrderId,
				oc.product_id AS ProductId,
				p.name AS ProductName,
				p.price AS UnitPrice,
				oc.amount AS Amount
			FROM order_contents oc
			JOIN products p ON p.id = oc.product_id
			WHERE oc.order_id = ANY(@OrderIds)
			ORDER BY oc.order_id, oc.product_id;";

		var itemRows = await RepoHelpers.TryQueryAsync(() => _con.QueryAsync<OrderLineRow>(itemsSql, new { OrderIds = orderIds }));
		var itemLookup = itemRows
			.GroupBy(row => row.OrderId)
			.ToDictionary(
				group => group.Key,
				group => group.Select(row => new OrderItemModel
				{
					ProductId = row.ProductId,
					ProductName = row.ProductName,
					UnitPrice = row.UnitPrice,
					Amount = row.Amount
				}).ToList()
			);

		return orders.Select(order => new OrderInfoModel
		{
			Order = order,
			User = user,
			Items = itemLookup.GetValueOrDefault(order.Id, new List<OrderItemModel>())
		}).ToList();
	}

	public async Task<OrderModel> CreateAsync(OrderModel order)
	{
		var sql = $@"
			INSERT INTO {Table()} (
				order_number,
				user_id,
				phone_number,
				email,
				price,
				country,
				city,
				postcode,
				street_name,
				street_number
			)
			VALUES (
				@OrderNumber,
				@UserId,
				@PhoneNumber,
				@Email,
				@Price,
				@Country,
				@City,
				@Postcode,
				@StreetName,
				@StreetNumber
			)
			RETURNING {OrderSelectColumns};";

		return await RepoHelpers.TryQueryAsync(async () =>
		{
			if (_con.State != System.Data.ConnectionState.Open)
			{
				await _con.OpenAsync();
			}

			await using var transaction = await _con.BeginTransactionAsync();
			try
			{
				var createdOrder = await _con.QuerySingleAsync<OrderModel>(sql, order, transaction);

				var items = order.Items
					.Where(item => item.ProductId > 0 && item.Amount > 0)
					.Select(item => new
					{
						OrderId = createdOrder.Id,
						item.ProductId,
						item.Amount
					})
					.ToList();

				if (items.Any())
				{
					var itemSql = @"
						INSERT INTO order_contents (
							order_id,
							product_id,
							amount
						)
						VALUES (
							@OrderId,
							@ProductId,
							@Amount
						);";

					await _con.ExecuteAsync(itemSql, items, transaction);
				}

				await transaction.CommitAsync();
				return createdOrder;
			}
			catch
			{
				await transaction.RollbackAsync();
				throw;
			}
		});
	}

	public async Task<OrderModel?> UpdateAsync(long id, OrderModel order)
	{
		var sql = $@"
			UPDATE {Table()}
			SET order_number = @OrderNumber,
				user_id = @UserId,
				phone_number = @PhoneNumber,
				email = @Email,
				price = @Price,
				country = @Country,
				city = @City,
				postcode = @Postcode,
				street_name = @StreetName,
				street_number = @StreetNumber
			WHERE id = @Id
			    AND soft_delete = FALSE
			RETURNING {OrderSelectColumns};";

		var parameters = new
		{
			Id = id,
			order.OrderNumber,
			order.UserId,
			order.PhoneNumber,
			order.Email,
			order.Price,
			order.Country,
			order.City,
			order.Postcode,
			order.StreetName,
			order.StreetNumber
		};

		return await RepoHelpers.TryQueryAsync(() => _con.QuerySingleOrDefaultAsync<OrderModel>(sql, parameters));
	}

	public async Task<bool> DeleteAsync(long id)
	{
		var sql = $@"
			DELETE FROM {Table()}
			WHERE id = @Id;";

		var affectedRows = await RepoHelpers.TryQueryAsync(async () => await _con.ExecuteAsync(sql, new { Id = id }));
		return affectedRows > 0;
	}
}
