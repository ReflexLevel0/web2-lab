using Microsoft.AspNetCore.Mvc;

[Route("[controller]")]
public class TicketController : Controller
{
	private IDbHelper _dbHelper;

	public TicketController(IDbHelper dbHelper)
	{
		_dbHelper = dbHelper;
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
		var ticket = await _dbHelper.GetTicket(id);
		if (ticket == null) return Results.NotFound(id);
		return Results.Ok(ticket);
	}

	[HttpPost]
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
