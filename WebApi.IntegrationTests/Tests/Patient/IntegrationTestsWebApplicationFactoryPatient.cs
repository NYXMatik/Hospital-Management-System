using System.Data.Common;
using DataModel.Repository;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Linq;
using System.Collections.Generic;

namespace WebApi.IntegrationTests;

public class IntegrationTestsWebApplicationFactoryPatient<TStartup>
    : WebApplicationFactory<TStartup> where TStartup : class
{
    public IntegrationTestsWebApplicationFactoryPatient()
    {
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        // Configuração em memória (ajuste conforme necessário)
        var configurationValues = new Dictionary<string, string>
        {
            // Adicione aqui suas configurações em memória, se necessário
        };

        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(configurationValues)
            .Build();

        builder
            .UseConfiguration(configuration)
            .ConfigureAppConfiguration(configurationBuilder =>
            {
                configurationBuilder.AddInMemoryCollection(configurationValues);
            });

        builder.ConfigureServices(services =>
        {
            // Remover o serviço do contexto original
            var dbContextDescriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<PatientContext>));
            if (dbContextDescriptor != null)
            {
                services.Remove(dbContextDescriptor);
            }

            var dbConnectionDescriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbConnection));
            if (dbConnectionDescriptor != null)
            {
                services.Remove(dbConnectionDescriptor);
            }

            // Criar conexão SQLite em memória
            services.AddSingleton<DbConnection>(container =>
            {
                var connection = new SqliteConnection("DataSource=:memory:");
                connection.Open();
                return connection;
            });

            // Configurar o PatientContext para usar a conexão SQLite
            services.AddDbContext<PatientContext>((container, options) =>
            {
                var connection = container.GetRequiredService<DbConnection>();
                options.UseSqlite(connection);
            });

            // Inicializar a base de dados
            var serviceProvider = services.BuildServiceProvider();
            using (var scope = serviceProvider.CreateScope())
            {
                var scopedServices = scope.ServiceProvider;
                var context = scopedServices.GetRequiredService<PatientContext>();

                // Inicializa a base de dados
                DatabaseInitializerPatient.Initialize(context);
            }
        });

        builder.UseEnvironment("Development");
    }
}
