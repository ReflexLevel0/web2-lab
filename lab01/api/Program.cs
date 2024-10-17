using DataModel;
using LinqToDB;
using Microsoft.AspNetCore.Mvc;

const string serverUrl = "http://localhost:5242";
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
	options.AddPolicy(name: "allow vue website",
		policy =>
		{
			policy.WithOrigins("http://localhost:5173");
		});
});
builder.Configuration.AddJsonFile("appsettings.json");
var app = builder.Build();
app.UseCors("allow vue website");

string? connectionString = app.Configuration.GetConnectionString("PostgreDbConnection");
if (connectionString == null)
{
	throw new Exception("Connection string not set in appsettings.json!");
}

var ticketsDb = new TicketsDb(new DataOptions<TicketsDb>(new DataOptions().UsePostgreSQL(connectionString)));
var dbHelper = new DbHelper(ticketsDb, serverUrl);

if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapGet("/ticket/count", async () =>
{
	return await dbHelper.GetTicketCount();
}).WithOpenApi();

app.MapPost("/ticket/add", async ([FromBody] TicketInput ticket) =>
{
	return Results.File(await dbHelper.AddTicket(ticket), "image/png");
});

app.MapGet("/ticket/{id}", async (Guid id) =>
{
	return await dbHelper.GetTicket(id);
});

app.Run();
