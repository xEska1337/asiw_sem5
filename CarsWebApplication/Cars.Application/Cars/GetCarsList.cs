using Cars.Domain;
using Cars.Infrastructure;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Cars.Application.Cars;

public static class GetCarsList
{
    public class Query : IRequest<List<Car>>
    {
    }

    public class Handler(DataContext context) : IRequestHandler<Query, List<Car>>
    {
        public async Task<List<Car>> Handle(
            Query request,
            CancellationToken cancellationToken)
        {
            return await context.Cars
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }
    }
}