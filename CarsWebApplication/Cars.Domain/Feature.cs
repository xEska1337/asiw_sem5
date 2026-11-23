namespace Cars.Domain;

public class Feature
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public ICollection<Car> Cars { get; set; } = new List<Car>();
}