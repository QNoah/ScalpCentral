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

        try
        {
            _con.Open();
            Console.WriteLine("Connected to PostgreSQL");
        }
        catch (Exception e)
        {
            Console.WriteLine("Connection failed: " + e.Message);
            throw;
        }
    }
}