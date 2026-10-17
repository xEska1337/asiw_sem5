using Cars.Domain;
using Microsoft.EntityFrameworkCore;

namespace Cars.Infrastructure;

public static class Seed
{
    public static async Task SeedData(DataContext context)
    {
        if (await context.Cars.AnyAsync()) return;

        var cars = new List<Car>
        {
            new Car
            {
                Brand = "Mazda",
                Model = "CX-60",
                DoorsNumber = 5,
                LuggageCapacity = 570,
                EngineCapacity = 2488,
                FuelType = FuelType.Hybrid,
                ProductionDate = DateTime.UtcNow.AddMonths(-6),
                AverageFuelConsumption = 1.5,
                BodyType = BodyType.SUV
            },
            new Car
            {
                Brand = "Renault",
                Model = "Clio",
                DoorsNumber = 5,
                LuggageCapacity = 391,
                EngineCapacity = 999,
                FuelType = FuelType.Petrol,
                ProductionDate = DateTime.UtcNow.AddYears(-4),
                AverageFuelConsumption = 5.8,
                BodyType = BodyType.Hatchback
            },
            new Car
            {
                Brand = "Toyota",
                Model = "Corolla",
                DoorsNumber = 4,
                LuggageCapacity = 471,
                EngineCapacity = 1798,
                FuelType = FuelType.Hybrid,
                ProductionDate = DateTime.UtcNow.AddYears(-2),
                AverageFuelConsumption = 4.7,
                BodyType = BodyType.Sedan
            }
        };

        await context.Cars.AddRangeAsync(cars);
        await context.SaveChangesAsync();
    }
}