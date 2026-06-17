using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Moq;
using ScalpCentral.Api.Controllers;
using ScalpCentral.Api.Models;
using ScalpCentral.Api.Services;

namespace api.Tests;

public class UsersControllerTests
{
    [Fact]
    public async Task GetAllUsers_ReturnsOk_WithUsers()
    {
        var users = new List<UserDto> { TestData.UserDto() };
        var service = new Mock<IUserService>();
        service.Setup(s => s.GetAllUsersAsync()).ReturnsAsync(users);
        var controller = CreateController(service.Object);

        var result = await controller.GetAllUsers();

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        Assert.Same(users, ok.Value);
    }

    [Fact]
    public async Task CreateAccount_ReturnsBadRequest_WhenServiceCannotCreateUser()
    {
        var service = new Mock<IUserService>();
        service.Setup(s => s.CreateAccount(It.IsAny<RegisterRequest>())).ReturnsAsync(0);
        var controller = CreateController(service.Object);

        var result = await controller.CreateAccount(TestData.Register());

        Assert.IsType<ConflictObjectResult>(result.Result);
        service.Verify(s => s.GetById(It.IsAny<int>()), Times.Never);
    }

    [Fact]
    public async Task CreateAccount_ReturnsCreatedUser_WhenServiceCreatesAccount()
    {
        var user = TestData.User(12);
        var service = new Mock<IUserService>();
        service.Setup(s => s.CreateAccount(It.IsAny<RegisterRequest>())).ReturnsAsync(12);
        service.Setup(s => s.GetById(12)).ReturnsAsync(user);
        var controller = CreateController(service.Object);

        var result = await controller.CreateAccount(TestData.Register());

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        Assert.Same(user, ok.Value);
        Assert.False(string.IsNullOrWhiteSpace(user.Token));
    }

    [Fact]
    public async Task Login_ReturnsUnauthorized_WhenCredentialsAreInvalid()
    {
        var service = new Mock<IUserService>();
        service.Setup(s => s.Login(It.IsAny<LoginRequest>())).ReturnsAsync((UserModel?)null);
        var controller = CreateController(service.Object);

        var result = await controller.login(TestData.Login());

        Assert.IsType<UnauthorizedResult>(result.Result);
    }

    [Fact]
    public async Task GetById_ReturnsOk_WhenUserExists()
    {
        var user = TestData.User();
        var service = new Mock<IUserService>();
        service.Setup(s => s.GetById(1)).ReturnsAsync(user);
        var controller = CreateController(service.Object, userId: 1);

        var result = await controller.GetById(1);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        Assert.Same(user, ok.Value);
    }

    private static UsersController CreateController(IUserService service, int userId = 0, string role = "User")
    {
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Issuer"] = "ScalpCentral.Api",
                ["Jwt:Audience"] = "ScalpCentral.Frontend",
                ["Jwt:SigningKey"] = "12345678901234567890123456789012"
            })
            .Build();

        var controller = new UsersController(service, configuration)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            }
        };

        if (userId > 0)
        {
            controller.ControllerContext.HttpContext.User = new ClaimsPrincipal(
                new ClaimsIdentity(
                    new[]
                    {
                        new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                        new Claim(ClaimTypes.Role, role)
                    },
                    "TestAuth"
                )
            );
        }

        return controller;
    }
}
