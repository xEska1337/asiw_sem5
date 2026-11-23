using Cars.Application.Cars.DTOs;
using Cars.Domain;
using Cars.Infrastructure;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Cars.Application.Cars;

public class AddCarPhoto
{
    public class Command : IRequest<CarPhotoDto?>
    {
        public Guid CarId { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
    }

    public class Handler(DataContext context) : IRequestHandler<Command, CarPhotoDto?>
    {
        public async Task<CarPhotoDto?> Handle(
            Command request,
            CancellationToken cancellationToken)
        {
            var carExists = await context.Cars
                .AnyAsync(car => car.Id == request.CarId, cancellationToken);

            if (!carExists)
            {
                return null;
            }

            var hasAnyPhoto = await context.CarPhotos
                .AnyAsync(photo => photo.CarId == request.CarId, cancellationToken);

            var photo = new CarPhoto
            {
                CarId = request.CarId,
                FileName = request.FileName,
                Url = request.Url,
                IsMain = !hasAnyPhoto,
            };

            context.CarPhotos.Add(photo);
            await context.SaveChangesAsync(cancellationToken);

            return new CarPhotoDto(photo.Id, photo.Url, photo.IsMain);
        }
    }
}