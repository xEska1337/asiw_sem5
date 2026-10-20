using Cars.Infrastructure;
using MediatR;

namespace Cars.Application.Cars;

public static class Delete
{
    public class Command : IRequest<bool>
    {
        public Guid Id { get; set; }
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

            context.Cars.Remove(car);
            await context.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}