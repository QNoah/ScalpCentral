using Npgsql;

public static class RepoHelpers
{
    public static T TryQuery<T>(Func<T> query)
    {
        try
        {
            return query();
        }
        catch (PostgresException ex)
        {
            Console.WriteLine($"Database Exception: {ex.Message}");
            throw;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Exception: {ex.Message}");
            throw;
        }
    }

    public static void TryExecute(Action execute)
    {
        try
        {
            execute();
        }
        catch (PostgresException ex)
        {
            Console.WriteLine($"Database Exception: {ex.Message}");
            throw;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Exception: {ex.Message}");
            throw;
        }
    }

    public static async Task<T> TryQueryAsync<T>(Func<Task<T>> query)
    {
        try
        {
            return await query();
        }
        catch (PostgresException ex)
        {
            Console.WriteLine($"Database Exception: {ex.Message}");
            throw;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Exception: {ex.Message}");
            throw;
        }
    }

    public static async Task TryExecuteAsync(Func<Task> execute)
    {
        try
        {
            await execute();
        }
        catch (PostgresException ex)
        {
            Console.WriteLine($"Database Exception: {ex.Message}");
            throw;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Exception: {ex.Message}");
            throw;
        }
    }
}