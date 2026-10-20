using Cars.Domain;
using FluentValidation;

namespace Cars.Application.Cars;

public class CarValidator : AbstractValidator<Car>
{
    public CarValidator()
    {
        RuleFor(x => x.Brand)
            .NotEmpty()
            .WithMessage("Brand is required.")
            .MaximumLength(50)
            .WithMessage("Brand cannot be longer than 50 characters.");

        RuleFor(x => x.Model)
            .NotEmpty()
            .WithMessage("Model is required.")
            .MaximumLength(50)
            .WithMessage("Model cannot be longer than 50 characters.");

        RuleFor(x => x.DoorsNumber)
            .InclusiveBetween(2, 5)
            .WithMessage("Doors number must be between 2 and 5.");

        RuleFor(x => x.LuggageCapacity)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Luggage capacity cannot be negative.");

        RuleFor(x => x.EngineCapacity)
            .GreaterThan(0)
            .WithMessage("Engine capacity must be greater than 0.");

        RuleFor(x => x.ProductionDate)
            .LessThanOrEqualTo(DateTime.UtcNow)
            .WithMessage("Production date cannot be in the future.");

        RuleFor(x => x.AverageFuelConsumption)
            .GreaterThan(0)
            .WithMessage("Average fuel consumption must be greater than 0.");
    }
}