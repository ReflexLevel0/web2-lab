using DataModel;
using LinqToDB;

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
builder.Services.AddControllers();

// Connecting to the database
string? connectionString = builder.Configuration.GetConnectionString("PostgreDbConnection");
if (connectionString == null) throw new Exception("Connection string not set in appsettings file");
var ticketsDb = new TicketsDb(new DataOptions<TicketsDb>(new DataOptions().UsePostgreSQL(connectionString)));
string? serverUrl = (string?)builder.Configuration.GetValue(typeof(string), "ServerUrl");
if (serverUrl == null) throw new Exception("Server URL not set in appsettings file");
var dbHelper = new DbHelper(ticketsDb, serverUrl);
builder.Services.AddScoped<IDbHelper>(sp => dbHelper);

var app = builder.Build();
app.UseCors("allow vue website");
app.MapControllers();
if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}
app.UseHttpsRedirection();
app.Run();
