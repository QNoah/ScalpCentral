using Npgsql;

public abstract class RepositoryAccessBase
{
    protected NpgsqlConnection _con;

    public abstract string Table();

    public RepositoryAccessBase(IConfiguration config)
    {
        string connectionString =
            config.GetConnectionString("postgres") ??
            throw new InvalidOperationException("Postgres connection string not configured");

        _con = new NpgsqlConnection(connectionString);
    }
}