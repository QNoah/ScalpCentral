using ScalpCentral.Api.Models;

public class ReviewModel
{
    public int Id { get; set; }
    public decimal Stars { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public DateTime? CreatedAt { get; set; }

    public string FirstName { get; set; } = "";
    public string LastName { get; set; } = "";
}