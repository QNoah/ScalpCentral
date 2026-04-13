using Microsoft.AspNetCore.Mvc;
using ScalpCentral.Api.Models;
using ScalpCentral.Api.Services;

namespace ScalpCentral.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet("users")]
    public async Task<ActionResult<List<UserModel>>> GetAllUsers()
    {
        var users = await _userService.GetAllUsersAsync();
        return Ok(users);
    }
}