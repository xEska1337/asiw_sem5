using Cars.Domain;
using Cars.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Cars.API.Controllers;

public class CarsController(DataContext context) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<List<Car>>> GetCars()
    {
        return await context.Cars.AsNoTracking().ToListAsync();
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Car>> GetCar(Guid id)
    {
        var car = await context.Cars.AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id);

        if (car is null) return NotFound();

        return car;
    }
    
    [HttpPost]
    public async Task<ActionResult<Car>> CreateCar(Car car)
    {
        context.Cars.Add(car);
        await context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCar), new { id = car.Id }, car);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateCar(Guid id, Car car)
    {
        var existingCar = await context.Cars.FindAsync(id);

        if (existingCar is null) return NotFound();

        existingCar.Brand = car.Brand;
        existingCar.Model = car.Model;
        existingCar.DoorsNumber = car.DoorsNumber;
        existingCar.LuggageCapacity = car.LuggageCapacity;
        existingCar.EngineCapacity = car.EngineCapacity;
        existingCar.FuelType = car.FuelType;
        existingCar.ProductionDate = car.ProductionDate;
        existingCar.AverageFuelConsumption = car.AverageFuelConsumption;
        existingCar.BodyType = car.BodyType;

        await context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteCar(Guid id)
    {
        var car = await context.Cars.FindAsync(id);

        if (car is null) return NotFound();

        context.Cars.Remove(car);
        await context.SaveChangesAsync();

        return NoContent();
    }
}