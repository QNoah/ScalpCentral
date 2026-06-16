using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Diagnostics;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using ScalpCentral.Api.Models;
using ScalpCentral.Api.Services;
using Microsoft.IdentityModel.Tokens;

namespace ScalpCentral.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IConfiguration _configuration;

    public UsersController(IUserService userService, IConfiguration configuration)
    {
        _userService = userService;
        _configuration = configuration;
    }

    [Authorize(Policy = "AdminOnly")]
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
        user.Token = CreateToken(user);
        AppendAuthCookie(user.Token);
        return Ok(user);
    }

    [Authorize]
    [HttpPut("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDTO dto)
    {
        await _userService.ResetPassword(dto.Email, dto.Password);
        return Ok();
    }

    [HttpGet]
    public async Task<ActionResult<UserModel?>> GetById(int id)
    {
        if (!CanAccessUserData(id))
            return Forbid();

        UserModel? user = await _userService.GetById(id);
        if(user == null)
            return Unauthorized();
        return Ok(user);
    }

    [HttpGet("{id}/bookmarks")]
    public async Task<ActionResult<List<int>>> GetBookmarks(int id)
    {
        var bookmarks = await _userService.GetBookmarks(id);
        return Ok(bookmarks);
    }

    [HttpPost("{id}/bookmarks")]
    public async Task<IActionResult> AddBookmark(int id, [FromBody] BookmarkRequest request)
    {
        await _userService.AddBookmark(request.UserId, request.ProductId);
        return Ok();
    }

    [HttpDelete("{id}/bookmarks/{productId}")]
    public async Task<IActionResult> RemoveBookmark(int id, int productId)
    {
        await _userService.RemoveBookmark(id, productId);
        return Ok();
        
    private string CreateToken(UserModel user)
    {
        var issuer = _configuration["Jwt:Issuer"] ?? "ScalpCentral.Api";
        var audience = _configuration["Jwt:Audience"] ?? "ScalpCentral.Frontend";
        var signingKey = _configuration["Jwt:SigningKey"];

        if (string.IsNullOrWhiteSpace(signingKey))
        {
            signingKey = "K0pe2Q912SPbrCpdqlV9JXTfrvauEijv";
        }

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(signingKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.Email),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Role, user.Role)
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private void AppendAuthCookie(string token)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = Request.IsHttps,
            SameSite = SameSiteMode.Lax,
            Expires = DateTimeOffset.UtcNow.AddDays(7),
            Path = "/"
        };

        Response.Cookies.Append("authToken", token, cookieOptions);
    }

    private long GetCurrentUserId()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (long.TryParse(userId, out long parsedUserId))
            return parsedUserId;

        return 0;
    }

    private bool CanAccessUserData(long userId)
    {
        if (User.IsInRole("Admin"))
            return true;

        return GetCurrentUserId() == userId;
    }
}