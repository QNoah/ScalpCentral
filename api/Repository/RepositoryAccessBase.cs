using System;
using Npgsql;
using Dapper;



public abstract class RepositoryAccessBase
{
    protected NpgsqlConnection _con;

    public abstract string Table();

    public RepositoryAccessBase()
    {
        string connectionString =
            Environment.GetEnvironmentVariable("DB_CONNECTION") ??
            "Host=127.0.0.1;Port=5432;Username=postgres;Password=;Database=scalpcentral";

        _con = new NpgsqlConnection(connectionString);
    }
}