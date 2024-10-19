using DataModel;
using LinqToDB;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

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
string domain = (string)builder.Configuration["auth0_domain"]!;
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
	options.Authority = builder.Configuration["Auth0:Authority"];
	options.Audience = builder.Configuration["Auth0:Audience"];
	options.RequireHttpsMetadata = false;
	options.TokenValidationParameters = new TokenValidationParameters
	{
		ValidateIssuer = true,
		ValidIssuer = $"https://{builder.Configuration["Auth0:Domain"]}/",
		ValidateAudience = true,
		ValidAudience = builder.Configuration["Auth0:Audience"],
		ValidateLifetime = true,
		ValidateIssuerSigningKey = false,
		SignatureValidator = delegate (string token, TokenValidationParameters parameters)
		{
			var jwt = new Microsoft.IdentityModel.JsonWebTokens.JsonWebToken(token);
			return jwt;
		}
	};
	options.Events = new JwtBearerEvents
	{
		OnAuthenticationFailed = context =>
		{
			// Log the error message
			Console.WriteLine("Authentication failed: " + context.Exception.Message);

			// Optionally log the token or request details for debugging
			var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
			if (!string.IsNullOrEmpty(token))
			{
				Console.WriteLine("Failed token: " + token);
			}

			// Customize the response if needed
			if (!context.Response.HasStarted)
			{
				context.Response.StatusCode = StatusCodes.Status401Unauthorized; // Set status code to 401
				context.Response.ContentType = "application/json"; // Set content type to JSON

				// Create a custom error response
				var responseMessage = new
				{
					error = "Authentication failed",
					message = "Your token is invalid or expired."
				};

				// Write the custom response
				return Task.CompletedTask;
			}

			return Task.CompletedTask;
		},
		OnForbidden = context =>
		{
			// Log the forbidden event (user authenticated but not authorized)
			Console.WriteLine("Access forbidden. User is authenticated but lacks permission.");

			// You can log additional details if needed, like the user's identity or claims
			if (context.HttpContext.User.Identity != null)
			{
				var userName = context.HttpContext.User.Identity.Name;
				Console.WriteLine($"Authenticated user: {userName}");
			}

			// Customize the response if needed
			context.Response.StatusCode = StatusCodes.Status403Forbidden;
			context.Response.ContentType = "application/json";
			var responseMessage = new
			{
				error = "Access forbidden: You do not have permission to access this resource."
			};

			// Write a custom response message
			return context.Response.WriteAsJsonAsync(responseMessage);
		},
		OnChallenge = (context) =>
		{
			// Log the challenge event
			Console.WriteLine("Authentication challenge triggered.");

			// Check if the response has already been handled
			if (context.Response.HasStarted)
			{
				return Task.CompletedTask;
			}

			// Customize the response if the user is not authenticated
			context.Response.StatusCode = StatusCodes.Status401Unauthorized; // Set status code to 401
			context.Response.ContentType = "application/json"; // Set content type to JSON

			// Create a custom error response
			var responseMessage = new
			{
				error = "Unauthorized",
				message = "You are not authorized to access this resource."
			};

			// Write the custom response
			return Task.CompletedTask;
		},
		OnMessageReceived = (context) =>
		{
			// Check if the token is present in the "Authorization" header (default behavior)
			var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

			// If not present in the Authorization header, check for a token in the query string
			if (string.IsNullOrEmpty(token))
			{
				token = context.Request.Query["access_token"];
			}

			// If not present in the query string, check for a token in a cookie
			if (string.IsNullOrEmpty(token))
			{
				token = context.Request.Cookies["jwt-token"];
			}

			// If a token was found, set it as the token for further processing
			if (!string.IsNullOrEmpty(token))
			{
				context.Token = token;
			}

			// Log the token received for debugging purposes (optional)
			Console.WriteLine($"Token received: {context.Token}");

			return Task.CompletedTask;
		},
		OnTokenValidated = (context) =>
		{
			// Log that the token was successfully validated
			Console.WriteLine("Token successfully validated.");

			// Access the claims principal (the user)
			var claimsPrincipal = context.Principal!;

			// Extract specific claims if needed (for example, the 'sub' claim for user ID)
			var userId = claimsPrincipal.FindFirst("sub")?.Value;
			var userName = claimsPrincipal.Identity?.Name;

			// Log user information
			Console.WriteLine($"User ID: {userId}");
			Console.WriteLine($"Username: {userName}");
			return Task.CompletedTask;
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
