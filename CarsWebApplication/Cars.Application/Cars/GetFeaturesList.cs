using Cars.Application.Cars.DTOs;
using Cars.Infrastructure;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Cars.Application.Cars;

public class GetFeaturesList
{
    public class Query : IRequest<List<FeatureDto>>
    {
    }

    public class Handler(DataContext context) : IRequestHandler<Query, List<FeatureDto>>
    {
        public async Task<List<FeatureDto>> Handle(
            Query request,
            CancellationToken cancellationToken)
        {
            return await context.Features
                .AsNoTracking()
                .OrderBy(feature => feature.Name)
                .Select(feature => new FeatureDto(feature.Id, feature.Name))
                .ToListAsync(cancellationToken);
        }
    }
}