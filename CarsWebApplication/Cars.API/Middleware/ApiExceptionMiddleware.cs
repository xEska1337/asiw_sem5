using FluentValidation;
using System.Net;

namespace Cars.API.Middleware;

public class ApiExceptionMiddleware(
    RequestDelegate next,
    ILogger<ApiExceptionMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (ValidationException ex)
        {
            context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            context.Response.ContentType = "application/json";

            var errors = ex.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(
                    group => group.Key,
                    group => group.Select(e => e.ErrorMessage).ToArray());

            await context.Response.WriteAsJsonAsync(new
            {
                title = "Validation error",
                status = 400,
                errors
            });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An unexpected error occurred.");

            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            context.Response.ContentType = "application/json";

            await context.Response.WriteAsJsonAsync(new
            {
                title = "Server error",
                status = 500,
                detail = "An unexpected error occurred."
            });
        }
    }
}