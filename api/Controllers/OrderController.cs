using Microsoft.AspNetCore.Mvc;
using Npgsql;
using ScalpCentral.Api.Models;
using ScalpCentral.Api.Services;

namespace ScalpCentral.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrderController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrderController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpGet]
    public async Task<ActionResult<List<OrderModel>>> GetAllOrders()
    {
        var orders = await _orderService.GetAllOrdersAsync();
        return Ok(orders);
    }

    [HttpGet("{id:long}")]
    public async Task<ActionResult<OrderModel>> GetOrderById(long id)
    {
        var order = await _orderService.GetOrderByIdAsync(id);
        if (order is null)
        {
            return NotFound();
        }

        return Ok(order);
    }

    [HttpGet("{id:long}/details")]
    public async Task<ActionResult<OrderInfoModel>> GetOrderDetailsById(long id)
    {
        var orderInfo = await _orderService.GetOrderInfoByIdAsync(id);
        if (orderInfo is null)
        {
            return NotFound();
        }

        return Ok(orderInfo);
    }

    [HttpGet("user/{userId:long}")]
    public async Task<ActionResult<List<OrderModel>>> GetOrdersByUserId(long userId)
    {
        var orders = await _orderService.GetOrdersByUserIdAsync(userId);
        return Ok(orders);
    }

    [HttpGet("user/{userId:long}/details")]
    public async Task<ActionResult<List<OrderInfoModel>>> GetOrderDetailsByUserId(long userId)
    {
        var orders = await _orderService.GetOrderInfoByUserIdAsync(userId);
        return Ok(orders);
    }

    [HttpPost]
    public async Task<ActionResult<OrderModel>> CreateOrder([FromBody] OrderModel order)
    {
        try
        {
            var createdOrder = await _orderService.CreateOrderAsync(order);
            return CreatedAtAction(nameof(GetOrderById), new { id = createdOrder.Id }, createdOrder);
        }
        catch (PostgresException ex) when (ex.SqlState == PostgresErrorCodes.ForeignKeyViolation)
        {
            return BadRequest("Invalid reference data. Check that userId exists before creating an order.");
        }
    }

    [HttpPut("{id:long}")]
    public async Task<ActionResult<OrderModel>> UpdateOrder(long id, [FromBody] OrderModel order)
    {
        if (order.Id != 0 && order.Id != id)
        {
            return BadRequest("Route id and body id do not match.");
        }

        order.Id = id;
        try
        {
            var updatedOrder = await _orderService.UpdateOrderAsync(id, order);
            if (updatedOrder is null)
            {
                return NotFound();
            }

            return Ok(updatedOrder);
        }
        catch (PostgresException ex) when (ex.SqlState == PostgresErrorCodes.ForeignKeyViolation)
        {
            return BadRequest("Invalid reference data. Check that userId exists before updating an order.");
        }
    }

    [HttpDelete("{id:long}")]
    public async Task<IActionResult> DeleteOrder(long id)
    {
        try
        {
            var deleted = await _orderService.DeleteOrderAsync(id);
            if (!deleted)
            {
                return NotFound();
            }

            return NoContent();
        }
        catch (PostgresException ex) when (ex.SqlState == PostgresErrorCodes.ForeignKeyViolation)
        {
            return Conflict("Order cannot be deleted because it still has related order items.");
        }
    }
}
