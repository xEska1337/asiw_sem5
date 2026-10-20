using Cars.Domain;
using Cars.Infrastructure;
using FluentValidation;
using MediatR;

namespace Cars.Application.Cars;

public static class Create
{
    public class Command : IRequest<Car>
    {
        public required Car Car { get; set; }
    }

    public class Handler(DataContext context) : IRequestHandler<Command, Car>
    {
        public async Task<Car> Handle(Command request, CancellationToken cancellationToken)
        {
            context.Cars.Add(request.Car);
            await context.SaveChangesAsync(cancellationToken);

            return request.Car;
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