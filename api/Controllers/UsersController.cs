using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Diagnostics;
using Microsoft.AspNetCore.Mvc.Infrastructure;
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

    [HttpPost("register")]
    public async ActionResult CreateAccount([FromBody] LoginRequest userinfo)
    {
        if(_userService.CreateAccount(userinfo))
            return Ok();
        return BadRequest();
    }
}