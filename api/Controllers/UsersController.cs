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
    public async Task<ActionResult<List<UserDto>>> GetAllUsers()
    {
        var users = await _userService.GetAllUsersAsync();
        return Ok(users);
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserModel?>> CreateAccount([FromBody] RegisterRequest userinfo)
    {

        int? id = await _userService.CreateAccount(userinfo);

        if (id is null || id == 0)
            return BadRequest();

        var user = await _userService.GetById(id.Value);

        return Ok(user);
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserModel?>> login([FromBody] LoginRequest userinfo)
    {
        UserModel? user = await _userService.Login(userinfo);
        if(user == null)
            return Unauthorized();
        return Ok(user);
    }

    [HttpPut("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDTO dto)
    {
        await _userService.ResetPassword(dto.Email, dto.Password);
        return Ok();
    }

    [HttpGet]
    public async Task<ActionResult<UserModel?>> GetById(int id)
    {
        UserModel? user = await _userService.GetById(id);
        if(user == null)
            return Unauthorized();
        return Ok(user);
    }
}