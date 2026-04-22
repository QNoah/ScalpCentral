using System.Text;
using api.Models.DTOs.Set;
using Dapper;
using ScalpCentral.Api.Repository;

namespace ScalpCentral.Api.Repository
{

    public class SetRepository : RepositoryAccessBase, ISetRepository
    {
        public override string Table() => "sets";

        public async Task<List<SetModel>> GetSets(SetFilters? filter)
        {
            var sql = new StringBuilder("SELECT * FROM sets WHERE 1=1");
            var p = new DynamicParameters();

            if (!string.IsNullOrWhiteSpace(filter.Id))
            {
                sql.Append(" AND id = @Id");
                p.Add("Id", filter.Id);
            }

            if (filter is not null && filter.Id is null)
            {
                (sql, p) = HelperFunctions.FilterCheck(filter.Name, "name", "Name", sql, p);
                (sql, p) = HelperFunctions.FilterCheck(filter.Series, "series", "Series", sql, p);


                if (!string.IsNullOrWhiteSpace(filter.ReleaseDate.ToString()))
                {
                    sql.Append(" AND release_date = @ReleaseDate");
                    p.Add("ReleaseDate", filter.ReleaseDate);
                }
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
        public async Task Update(SetDTO set)
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