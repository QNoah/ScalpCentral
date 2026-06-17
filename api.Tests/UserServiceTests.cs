using Moq;
using ScalpCentral.Api.Models;
using ScalpCentral.Api.Repository;
using ScalpCentral.Api.Services;

namespace api.Tests;

public class UserServiceTests
{
    [Fact]
    public async Task CreateAccount_ReturnsZero_WhenEmailAlreadyExists()
    {
        var repository = new Mock<IUserRepository>();
        repository.Setup(r => r.EmailExists("ash@example.com")).ReturnsAsync(true);
        var service = new UserService(repository.Object);

        var result = await service.CreateAccount(TestData.Register());

        Assert.Equal(0, result);
        repository.Verify(r => r.CreateAccount(It.IsAny<RegisterRequest>()), Times.Never);
    }

    [Fact]
    public async Task CreateAccount_HashesPassword_BeforeSaving()
    {
        var repository = new Mock<IUserRepository>();
        RegisterRequest? savedRequest = null;
        repository.Setup(r => r.EmailExists("ash@example.com")).ReturnsAsync(false);
        repository
            .Setup(r => r.CreateAccount(It.IsAny<RegisterRequest>()))
            .Callback<RegisterRequest>(request => savedRequest = request)
            .ReturnsAsync(42);
        var service = new UserService(repository.Object);

        var result = await service.CreateAccount(TestData.Register("plain-password"));

        Assert.Equal(42, result);
        Assert.NotNull(savedRequest);
        Assert.NotEqual("plain-password", savedRequest.Password);
        Assert.False(string.IsNullOrWhiteSpace(savedRequest.Password));
    }

    [Fact]
    public async Task Login_ReturnsUser_WhenPasswordMatchesStoredHash()
    {
        var repository = new Mock<IUserRepository>();
        var service = new UserService(repository.Object);
        var registerRequest = TestData.Register("correct-password");

        RegisterRequest? savedRequest = null;
        repository.Setup(r => r.EmailExists(registerRequest.Email)).ReturnsAsync(false);
        repository
            .Setup(r => r.CreateAccount(It.IsAny<RegisterRequest>()))
            .Callback<RegisterRequest>(request => savedRequest = request)
            .ReturnsAsync(1);
        await service.CreateAccount(registerRequest);

        repository
            .Setup(r => r.Login(It.Is<LoginRequest>(request => request.Email == registerRequest.Email)))
            .ReturnsAsync(TestData.User(password: savedRequest!.Password));

        var result = await service.Login(TestData.Login("correct-password"));

        Assert.NotNull(result);
        Assert.Equal("ash@example.com", result.Email);
    }

    [Fact]
    public async Task Login_ReturnsNull_WhenPasswordDoesNotMatchStoredHash()
    {
        var repository = new Mock<IUserRepository>();
        repository
            .Setup(r => r.Login(It.IsAny<LoginRequest>()))
            .ReturnsAsync(TestData.User(password: "different-hash"));
        var service = new UserService(repository.Object);

        var result = await service.Login(TestData.Login("wrong-password"));

        Assert.Null(result);
    }
}
