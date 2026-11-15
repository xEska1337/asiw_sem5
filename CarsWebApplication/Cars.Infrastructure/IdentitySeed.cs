using Cars.Domain;
using Microsoft.AspNetCore.Identity;

namespace Cars.Infrastructure;

public static class IdentitySeed
{
    public static async Task SeedAsync(
        UserManager<AppUser> userManager,
        RoleManager<IdentityRole> roleManager)
    {
        string[] roles = ["User", "Admin"];

        foreach (var roleName in roles)
        {
            if (!await roleManager.RoleExistsAsync(roleName))
            {
                await roleManager.CreateAsync(new IdentityRole(roleName));
            }
        }

        const string adminEmail = "admin@cars.local";

        var admin = await userManager.FindByEmailAsync(adminEmail);

        if (admin is null)
        {
            admin = new AppUser
            {
                UserName = "admin",
                Email = adminEmail,
                EmailConfirmed = true,
            };

            var result = await userManager.CreateAsync(admin, "Admin123!");

            if (!result.Succeeded)
            {
                throw new InvalidOperationException(
                    string.Join(" | ", result.Errors.Select(e => e.Description)));
            }
        }

        if (!await userManager.IsInRoleAsync(admin, "Admin"))
        {
            await userManager.AddToRoleAsync(admin, "Admin");
        }
    }
}