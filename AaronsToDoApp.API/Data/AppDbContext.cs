using AaronsToDoApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AaronsToDoApp.API.Data;

class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<ToDoTask> ToDoTasks { get; set; }
}
