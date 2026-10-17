namespace Cars.Domain;

public enum FuelType
{
    Petrol,
    Diesel,
    Hybrid,
    Electric,
    LPG
}

public enum BodyType
{
    Hatchback,
    Sedan,
    Kombi,
    SUV,
    Roadster
}

public class Car
{
    public Guid Id { get; set; }
    public string Brand { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public int DoorsNumber { get; set; }
    public int LuggageCapacity { get; set; }
    public int EngineCapacity { get; set; }
    public FuelType FuelType { get; set; }
    public DateTime ProductionDate { get; set; }
    public double AverageFuelConsumption { get; set; }
    public BodyType BodyType { get; set; }
}