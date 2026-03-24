using Dapper;
using ScalpCentral.Api.Models;

namespace ScalpCentral.Api.DataAccess;

public class UserAccess : AAccess, IUserAccess
{
	public override string Table() => "users";

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
		soft_deleted AS SoftDeleted";

	public async Task<List<UserModel>> GetAllAsync()
	{
		var sql = $@"
			SELECT {UserSelectColumns}
			FROM {Table()}
			WHERE soft_deleted = FALSE
			ORDER BY id;";

		var users = await _con.QueryAsync<UserModel>(sql);
		return users.ToList();
	}
}