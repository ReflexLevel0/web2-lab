using DataModel;
using LinqToDB;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "allow vue website",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173").AllowAnyMethod().AllowAnyHeader();
        });
});
builder.Services.AddControllers();
builder.Services.AddSingleton<ConfigurationManager>(builder.Configuration);

// Enabling Auth0 authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    options.Authority = builder.Configuration["M2M:Authority"];
    options.Audience = builder.Configuration["M2M:Audience"];
    options.RequireHttpsMetadata = false;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = $"https://{builder.Configuration["M2M:Domain"]}/",
        ValidateAudience = true,
        ValidAudience = builder.Configuration["M2M:Audience"],
        ValidateLifetime = true,
        ValidateIssuerSigningKey = false,
        SignatureValidator = delegate (string token, TokenValidationParameters parameters)
        {
            var jwt = new Microsoft.IdentityModel.JsonWebTokens.JsonWebToken(token);
            return jwt;
        }
    };
});

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
app.UseAuthentication();
app.UseAuthorization();
app.Run();
