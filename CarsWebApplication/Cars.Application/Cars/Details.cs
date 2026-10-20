using Cars.Domain;
using Cars.Infrastructure;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Cars.Application.Cars;

public static class Details
{
    public class Query : IRequest<Car?>
    {
        public Guid Id { get; set; }
    }

    public class Handler(DataContext context) : IRequestHandler<Query, Car?>
    {
        public async Task<Car?> Handle(
            Query request,
            CancellationToken cancellationToken)
        {
            return await context.Cars
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
        }
    }
}