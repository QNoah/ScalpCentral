

using Microsoft.AspNetCore.Mvc;

namespace ScalpCentral.Api.Controllers
{
    [ApiController]
    [Route("api/sets")]
    public class SetController : ControllerBase
    {
        public readonly ISetService _setService;
        public SetController(ISetService setService) => _setService = setService;
        [HttpGet]
        public async Task<ActionResult<List<SetModel>>> GetSets([FromQuery] SetFilters? filter)
        {
            filter ??= new SetFilters();
            var sets = await _setService.GetSets(filter);
            return Ok(sets);
        }

    }
}