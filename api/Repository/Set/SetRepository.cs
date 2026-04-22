using System.Text;
using api.Models.DTOs.Set;
using Dapper;
using ScalpCentral.Api.Repository;

namespace ScalpCentral.Api.Repository
{

    public class SetRepository : RepositoryAccessBase, ISetRepository
    {
        public override string Table() => "sets";

        public async Task<List<SetModel>> GetAllSetsAsync()
        {
            string sql = "SELECT * FROM sets";
            var sets = await _con.QueryAsync<SetModel>(sql);
            return sets.ToList();
        }
        public async Task<List<SetModel>> GetSets(SetFilters filter)
        {
            var sql = new StringBuilder("SELECT * FROM sets WHERE 1=1");
            var p = new DynamicParameters();

            (sql, p) = HelperFunctions.FilterCheck(filter.Id, "id", "Id", sql, p);
            (sql, p) = HelperFunctions.FilterCheck(filter.Name, "name", "Name", sql, p);
            (sql, p) = HelperFunctions.FilterCheck(filter.Series, "series", "Series", sql, p);

            if (!string.IsNullOrWhiteSpace(filter.ReleaseDate.ToString()))
            {
                sql.Append(" AND release_date = @ReleaseDate");
                p.Add("ReleaseDate", filter.ReleaseDate);
            }

            var sets = await _con.QueryAsync<SetModel>(sql.ToString(), p);
            return sets.ToList();
        }
        public async Task Add(SetDTO set)
        {
            string sql = @"INSERT into sets (name, series, total_cards, release_date, image_logo) VALUES (@Name, @Series, @TotalCards, @ReleaseDate, @ImageLogo);";
            await _con.ExecuteAsync(sql.ToString(), new
            {
                set.Name,
                set.Series,
                set.TotalCards,
                set.ReleaseDate,
                set.ImageLogo
            });
        }
        public async Task Delete(int id)
        {
            string sql = $"DELETE FROM sets WHERE id = {id}";
            await _con.ExecuteAsync(sql);
        }
        public async Task UpdateSet(SetDTO set)
        {
            string sql = @"UPDATE sets (name, series, total_cards, release_date, image_logo) VALUES (@Name, @Series, @TotalCards, @ReleaseDate, @ImageLogo) WHERE Id = @Id;";
            await _con.ExecuteAsync(sql.ToString(), new
            {
                set.Id,
                set.Name,
                set.Series,
                set.TotalCards,
                set.ReleaseDate,
                set.ImageLogo
            });
        }
    }
}