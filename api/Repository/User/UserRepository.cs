using Dapper;
using ScalpCentral.Api.Models;

namespace ScalpCentral.Api.Repository;

public class UserRepository : RepositoryAccessBase, IUserRepository
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
		created_at AS CreatedAt";

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

	public bool EmailExists(string email)
	{
		var sql = $@"
		SELECT 1
		FROM {Table()}
		WHERE email = @Email and soft_deleted = FALSE";

		var result = _con.QueryFirstOrDefault<int?>(sql, new { Email = email });
		return result.HasValue;
	}

	public bool CreateAccount(LoginRequest userinfo)
	{
		var sql = $@"
		INSERT INTO {Table()}
		(email, password)
		VALUES (@Email, @Password)";
		_con.Execute(sql, new {Email = userinfo.Email, Password = userinfo.Password});
		return true;
	}

	public UserModel? Login(LoginRequest userinfo)
	{
		var sql = $@"
		SELECT {UserSelectColumns}
		FROM {Table()}
		WHERE soft_deleted = FALSE and email = @Email";
		return _con.QueryFirstOrDefault<UserModel>(sql, new {Email = userinfo.Email});
	}

	public UserModel? GetById(int id)
	{
		var sql = $@"
		SELECT {UserSelectColumns}
		FROM {Table()}
		WHERE soft_deleted = FALSE and id = @Id";
		return _con.QueryFirstOrDefault<UserModel>(sql, new {Id = id});
	}

	public void SoftDelete(UserModel user)
	{
		var sql = $@"
		UPDATE {Table()}
		SET soft_deleted = NOT soft_deleted AND deleted_at = @Date
		WHERE id = Id";
		_con.Execute(sql, new {Id = user.Id, Date = DateTime.Now});
	}

	public void HardDelete(UserModel user)
	{
		var sql = $@"
		DELETE FROM {Table()}
		WHERE id = Id";
		_con.Execute(sql, new {Id = user.Id});
	}

	public void Update(UserModel user)
	{
		var sql = $@"
		UPDATE {Table()}
		SET 
			first_name = @FirstName,
			last_name = @LastName,
			email = @Email,
			password = @Password,
			iban = @Iban,
			postcode = @Postcode,
			country = @Country,
			city = @City,
			street_name = @StreetName,
			street_number = @StreetNumber,
			phone_number = @PhoneNumber,
			negative_seller_count = @NegativeSellerCount,
			positive_seller_count = @PositiveSellerCount,
			role = @Role
		WHERE id = @Id";
		_con.Execute(sql, user);
	}
}