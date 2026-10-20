using Cars.Domain;
using Cars.Infrastructure;
using FluentValidation;
using MediatR;

namespace Cars.Application.Cars;

public static class Edit
{
    public class Command : IRequest<bool>
    {
        public Guid Id { get; set; }
        public required Car Car { get; set; }
    }

    public class Handler(DataContext context) : IRequestHandler<Command, bool>
    {
        public async Task<bool> Handle(Command request, CancellationToken cancellationToken)
        {
            var car = await context.Cars.FindAsync(
                [request.Id],
                cancellationToken);

            if (car is null)
            {
                return false;
            }

            car.Brand = request.Car.Brand;
            car.Model = request.Car.Model;
            car.DoorsNumber = request.Car.DoorsNumber;
            car.LuggageCapacity = request.Car.LuggageCapacity;
            car.EngineCapacity = request.Car.EngineCapacity;
            car.FuelType = request.Car.FuelType;
            car.ProductionDate = request.Car.ProductionDate;
            car.AverageFuelConsumption = request.Car.AverageFuelConsumption;
            car.BodyType = request.Car.BodyType;

            await context.SaveChangesAsync(cancellationToken);

            return true;
        }
    }

    public class CommandValidator : AbstractValidator<Command>
    {
        public CommandValidator()
        {
            RuleFor(x => x.Car).SetValidator(new CarValidator());
        }
    }
}