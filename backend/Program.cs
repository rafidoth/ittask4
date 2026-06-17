using ittask4.Application.Service;
using ittask4.Data;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using Resend;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var dataSourceBuilder = new NpgsqlDataSourceBuilder(builder.Configuration.GetConnectionString("PG"));
dataSourceBuilder.EnableDynamicJson();
var dataSource = dataSourceBuilder.Build();

builder.Services.AddHttpContextAccessor();

builder.Services.Configure<ResendClientOptions>(options =>
{
    options.ApiToken = builder.Configuration.GetConnectionString("RESEND")!;
});
builder.Services.AddHttpClient<ResendClient>();
builder.Services.AddTransient<IResend, ResendClient>();
builder.Services.AddScoped<IEmailService, EmailService>();

builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseNpgsql(dataSource));

builder.Services.AddScoped<IUsersService, UsersService>();
builder.Services.AddScoped<ValidateUserFilter>();

builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}
app.UseCors("AllowAll");
app.UseHttpsRedirection();
app.MapControllers();
app.Run();
