public class PagedResults<T>
{
    public int TotalCount { get; set; }
    public List<T> Result { get; set; } = new List<T>();
    public PagedResults(int totalCount, List<T> result)
    {
        TotalCount = totalCount;
        Result = result;
    }
}