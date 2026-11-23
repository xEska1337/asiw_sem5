using Cars.Domain;

namespace Cars.Application.Cars.DTOs;

public class CarDto
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
    public IReadOnlyCollection<CarPhotoDto> Photos { get; set; } = [];
    public IReadOnlyCollection<FeatureDto> Features { get; set; } = [];
}