using Microsoft.AspNetCore.Mvc;
using Moq;

namespace api.Tests;

public class SetControllerTests
{
    [Fact]
    public async Task GetSets_UsesEmptyFilter_WhenQueryFilterIsNull()
    {
        var sets = new List<SetModel> { TestData.Set() };
        var service = new Mock<ISetService>();
        service.Setup(s => s.GetSets(It.IsAny<SetFilters>())).ReturnsAsync(sets);
        var controller = new ScalpCentral.Api.Controllers.SetController(service.Object);

        var result = await controller.GetSets(null);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        Assert.Same(sets, ok.Value);
        service.Verify(s => s.GetSets(It.Is<SetFilters>(filter => filter != null)), Times.Once);
    }
}
