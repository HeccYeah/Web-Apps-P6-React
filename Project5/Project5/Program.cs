using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Project5.Areas.Identity.Data;
using Project5.Data;
using Project5.Controllers;
using Project5.Models;
using Microsoft.AspNetCore.Authentication.Cookies;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("Project5ContextConnection") ?? throw new InvalidOperationException("Connection string 'Project5ContextConnection' not found.");

builder.Services.AddDbContext<Project5Context>(options => options.UseMySql(connectionString, new MySqlServerVersion(new Version(10,4,27))));

builder.Services.AddDefaultIdentity<Project5User>(options => options.SignIn.RequireConfirmedAccount = true).AddEntityFrameworkStores<Project5Context>();


// Add services to the container.
builder.Services.AddControllersWithViews();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
};

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.MapRazorPages();






app.Run();
