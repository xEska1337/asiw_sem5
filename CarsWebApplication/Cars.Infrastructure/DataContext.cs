using Cars.Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Cars.Infrastructure;

public class DataContext(DbContextOptions<DataContext> options)
    : IdentityDbContext<AppUser, IdentityRole, string>(options)
{
    public DbSet<Car> Cars => Set<Car>();
}