using Cars.Domain;
using Microsoft.EntityFrameworkCore;

namespace Cars.Infrastructure;

public static class FeatureSeed
{
    public static async Task SeedAsync(DataContext context)
    {
        if (await context.Features.AnyAsync())
        {
            return;
        }

        var features = new List<Feature>
        {
            new() { Name = "ABS" },
            new() { Name = "ESP" },
            new() { Name = "Air conditioning" },
            new() { Name = "Navigation" },
            new() { Name = "Cruise control" },
            new() { Name = "Rear view camera" },
            new() { Name = "Parking sensors" },
            new() { Name = "Heated seats" },
        };

        context.Features.AddRange(features);
        await context.SaveChangesAsync();
    }
}