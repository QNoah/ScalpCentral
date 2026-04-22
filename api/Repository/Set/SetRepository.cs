using System.Text;
using api.Models.DTOs.Set;
using Dapper;
using ScalpCentral.Api.Repository;

namespace ScalpCentral.Api.Repository
{

    public class SetRepository : RepositoryAccessBase, ISetRepository
    {
        public override string Table() => "sets";
        public List<SetModel> GetSets(SetFilters filter)
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

            return _con.Query<SetModel>(sql.ToString(), p).ToList();
        }
        public void Add(SetDTO set)
        {
            string sql = @"INSERT into sets (name, series, total_cards, release_date, image_logo) VALUES (@Name, @Series, @TotalCards, @ReleaseDate, @ImageLogo);";
            _con.Execute(sql.ToString(), new
            {
                set.Name,
                set.Series,
                set.TotalCards,
                set.ReleaseDate,
                set.ImageLogo
            });
        }
        public void Delete(int id)
        {
            string sql = $"DELETE FROM sets WHERE id = {id}";
            _con.Execute(sql);
        }
        public void UpdateSet(SetDTO set)
        {
            string sql = @"UPDATE sets (name, series, total_cards, release_date, image_logo) VALUES (@Name, @Series, @TotalCards, @ReleaseDate, @ImageLogo) WHERE Id = @Id;";
            _con.Execute(sql.ToString(), new
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