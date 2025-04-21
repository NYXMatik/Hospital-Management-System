using System.Data.Common;
using DataModel.Repository; // Altere para o namespace correto
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Linq;
using System.Collections.Generic;
using DataModel.Model;
using Domain.Model;

public class DatabaseInitializer
{
    public static void Initialize(StaffContext context)
    {
        context.Database.EnsureCreated();

        if (context.Staffs.Any())
        {
            return;
        }

        context.Staffs.Add(new StaffDataModel
        {
            LicenseNumber = "ABC123",
            Id = "N2019000001",
            Name = new NameDataModel(new Name("Jane Doe")),
            Contact = new ContactInfoDataModel
            {
                Email = "jane.doe@example.com",
                PhoneNumber = "+345 123456789"
            },
            Specialization = "Pediatrics"
        });

        context.SaveChanges();
    }
}
