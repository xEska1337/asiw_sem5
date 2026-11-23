using Cars.Application.Cars;
using Cars.Application.Cars.DTOs;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Cars.API.Controllers;

[Authorize]
public class FeaturesController(ISender sender) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<List<FeatureDto>>> GetFeatures()
    {
        return await sender.Send(new GetFeaturesList.Query());
    }
}