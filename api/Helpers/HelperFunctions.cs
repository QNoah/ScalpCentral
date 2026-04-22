using System.Text;
using Dapper;

    public static class HelperFunctions
    {
        #region Filter functions
        public static (StringBuilder sql, DynamicParameters p) FilterCheck(
            string filter,
            string colName,
            string paramName,
            StringBuilder sql,
            DynamicParameters p)
        {
            if (!string.IsNullOrWhiteSpace(filter))
            {
                sql.Append($" AND {colName} ILIKE @{paramName}");
                p.Add(paramName, $"%{filter}%");
            }
            return (sql, p);
        }

        #endregion
    }