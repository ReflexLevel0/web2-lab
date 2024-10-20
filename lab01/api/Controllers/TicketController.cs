using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("ticket")]
public class TicketController : ControllerBase
{
    private IDbHelper _dbHelper;
    private ConfigurationManager _configurationManager;

    public TicketController(IDbHelper dbHelper, ConfigurationManager configurationManager)
    {
        _dbHelper = dbHelper;
        _configurationManager = configurationManager;
    }

    [HttpGet]
    [Route("count")]
    public async Task<int> GetTicketCount()
    {
        return await _dbHelper.GetTicketCount();
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<IResult> GetTicket(Guid id)
    {
        var authString = Request.Headers["Authorization"].ToString().Split(' ').Last();
        var validator = await new TokenValidator(_configurationManager).ValidateToken(authString);
        if (validator == null) return Results.Unauthorized();
        var ticket = await _dbHelper.GetTicket(id);
        if (ticket == null) return Results.NotFound(id);
        return Results.Ok(ticket);
    }

    [HttpPost]
    [Authorize]
    [Route("add")]
    public async Task<IResult> AddTicket([FromBody] TicketInput ticket)
    {
        try
        {
            return Results.File(await _dbHelper.AddTicket(ticket), "image/png");
        }
        catch (Exception ex) when (ex is MissingFieldException || ex is TooManyTicketsException)
        {
            return Results.BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            return Results.Problem(ex.Message);
        }
    }
}
