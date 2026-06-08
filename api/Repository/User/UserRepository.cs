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

    public UserRepository(IConfiguration config) : base(config) {}


	public async Task<List<UserModel>> GetAllAsync()
	{
		var sql = $@"
			SELECT {UserSelectColumns}
			FROM {Table()}
			WHERE soft_deleted = FALSE
			ORDER BY id;";

		var users = await RepoHelpers.TryQuery(async() => await _con.QueryAsync<UserModel>(sql));
		return users.ToList();
	}

	public async Task<bool> EmailExists(string email)
	{
		var sql = $@"
		SELECT 1
		FROM {Table()}
		WHERE email = @Email and soft_deleted = FALSE";

		var result = RepoHelpers.TryQueryAsync(async() => await _con.QueryFirstOrDefaultAsync<int?>(sql, new { Email = email }));
		int? value = await result;
		return value.HasValue;
	}

	public async Task<int?> CreateAccount(RegisterRequest userinfo)
	{
		var sql = $@"
		INSERT INTO {Table()}
		(first_name, last_name, email, password, role, created_at)
		VALUES (@FName, @LName, @Email, @Password, @Role, @createdAt)
		RETURNING id";
		return await RepoHelpers.TryQueryAsync(async() => await _con.QuerySingleAsync<int>(sql, new {
			FName = userinfo.FName, LName = userinfo.LName, 
			Email = userinfo.Email, Password = userinfo.Password,
			createdAt = DateTime.Now, Role = "User"
			}));
	}

	public async Task<UserModel?> Login(LoginRequest userinfo)
	{
		var sql = $@"
		SELECT {UserSelectColumns}
		FROM {Table()}
		WHERE soft_deleted = FALSE and email = @Email";
		return await RepoHelpers.TryQueryAsync(async() => await _con.QueryFirstOrDefaultAsync<UserModel?>(sql, new {Email = userinfo.Email}));
	}

	public async Task<UserModel?> GetById(int id)
	{
		var sql = $@"
		SELECT {UserSelectColumns}
		FROM {Table()}
		WHERE soft_deleted = FALSE and id = @Id";
		return await RepoHelpers.TryQueryAsync(async() => await _con.QueryFirstOrDefaultAsync<UserModel>(sql, new {Id = id}));
	}

	public async Task<UserModel?> GetByEmail(string email)
	{
		var sql = $@"
		SELECT {UserSelectColumns}
		FROM {Table()}
		WHERE soft_deleted = FALSE and email = @email";
		return await RepoHelpers.TryQueryAsync(async() => await _con.QueryFirstOrDefaultAsync<UserModel>(sql, new {mail = email}));
	}

	public async Task SoftDelete(UserModel user)
	{
		var sql = $@"
		UPDATE {Table()}
		SET soft_deleted = NOT soft_deleted AND deleted_at = @Date
		WHERE id = Id";
		await RepoHelpers.TryExecuteAsync(async() => await _con.ExecuteAsync(sql, new {Id = user.Id, Date = DateTime.Now}));
	}

	public async Task HardDelete(UserModel user)
	{
		var sql = $@"
		DELETE FROM {Table()}
		WHERE id = Id";
		await RepoHelpers.TryExecuteAsync(async() => await _con.ExecuteAsync(sql, new {Id = user.Id}));
	}

	public async Task Update(UserModel user)
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
		await RepoHelpers.TryExecuteAsync(async() => await _con.ExecuteAsync(sql, user));
	}
}