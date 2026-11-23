using Cars.Infrastructure;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Cars.Application.Cars;

public class DeleteCarPhoto
{
    public class Command : IRequest<string?>
    {
        public Guid CarId { get; set; }
        public Guid PhotoId { get; set; }
    }

    public class Handler(DataContext context) : IRequestHandler<Command, string?>
    {
        public async Task<string?> Handle(
            Command request,
            CancellationToken cancellationToken)
        {
            var photo = await context.CarPhotos
                .FirstOrDefaultAsync(
                    p => p.Id == request.PhotoId && p.CarId == request.CarId,
                    cancellationToken);

            if (photo is null)
            {
                return null;
            }

            var fileName = photo.FileName;

            context.CarPhotos.Remove(photo);
            await context.SaveChangesAsync(cancellationToken);

            return fileName;
        }
    }
}