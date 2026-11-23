namespace Cars.Domain;

public class CarPhoto
{
    public Guid Id { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public bool IsMain { get; set; }
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public Guid CarId { get; set; }
    public Car Car { get; set; } = null!;
}