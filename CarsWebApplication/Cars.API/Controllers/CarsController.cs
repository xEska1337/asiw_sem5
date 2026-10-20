using Cars.Application.Cars;
using Cars.Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Cars.API.Controllers;

public class CarsController(ISender sender) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<List<Car>>> GetCars()
    {
        return await sender.Send(new GetCarsList.Query());
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Car>> GetCar(Guid id)
    {
        var car = await sender.Send(new Details.Query { Id = id });

        if (car is null)
        {
            return NotFound();
        }

        return car;
    }

    [HttpPost]
    public async Task<ActionResult<Car>> CreateCar(Car car)
    {
        var result = await sender.Send(new Create.Command { Car = car });

        return CreatedAtAction(
            nameof(GetCar),
            new { id = result.Id },
            result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateCar(Guid id, Car car)
    {
        var result = await sender.Send(new Edit.Command
        {
            Id = id,
            Car = car
        });

        if (!result)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteCar(Guid id)
    {
        var result = await sender.Send(new Delete.Command { Id = id });

        if (!result)
        {
            return NotFound();
        }

        return NoContent();
    }
}