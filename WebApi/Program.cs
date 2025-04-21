using Microsoft.EntityFrameworkCore;
using Application.Services;
using DataModel.Repository;
using DataModel.Mapper;
using Domain.Factory;
using Domain.IRepository;
using Domain.Model;
using DataModel.Model;
using DataModel.Repository.OperationRequest;
using Domain.Factory.OperationRequest;
using Microsoft.AspNetCore.Authentication.Google;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// "AbsanteeDatabase": "Server=vs1444.dei.isep.ipp.pt;Database=AbsanteeDatabase;User Id=sa;Password=ARQSI-SARM1;TrustServerCertificate=true;"
/*builder.Services.AddDbContext<GenericContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("AbsanteeDatabase"))
);*/

// Configura el contexto de la base de datos
//Data Source=AbsanteeDB.sqlite
builder.Services.AddDbContext<GenericContext>(opt =>
    opt.UseSqlite(builder.Configuration.GetConnectionString("AbsanteeDatabase"))
);

// Registrar HttpClient
builder.Services.AddHttpClient(); // Asegúrate de que HttpClient esté registrado

// Adicionar o CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Configurar autenticación de Google
/*builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = GoogleDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
})
.AddGoogle(options =>
{
    options.ClientId = "1035865566391-1gfqd9vngkrs6bkq5g6d10skpfrhn7ad.apps.googleusercontent.com";
    options.ClientSecret = "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";
    options.CallbackPath = "/signin-google"; 
});*/

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddTransient<IPatientRepository, PatientRepository>();
builder.Services.AddTransient<IPatientFactory, PatientFactory>();
builder.Services.AddTransient<PatientMapper>();
builder.Services.AddTransient<PatientService>();

builder.Services.AddTransient<IOperationTypeRepository, OperationTypeRepository>();
builder.Services.AddTransient<IOperationTypeFactory, OperationTypeFactory>();
builder.Services.AddTransient<OperationTypeMapper>();
builder.Services.AddTransient<OperationTypeService>();

builder.Services.AddTransient<IStaffRepository, StaffRepository>();
builder.Services.AddTransient<IStaffFactory, StaffFactory>();
builder.Services.AddTransient<StaffMapper>();
builder.Services.AddTransient<StaffService>();
builder.Services.AddTransient<IStaffIdGenerator, StaffIdGenerator>();

builder.Services.AddTransient<ISpecializationRepository, SpecializationRepository>();
builder.Services.AddTransient<ISpecializationFactory, SpecializationFactory>();
builder.Services.AddTransient<SpecializationMapper>();
builder.Services.AddTransient<SpecializationService>();

builder.Services.AddScoped<IAuditLogRepository, AuditLogRepository>();
builder.Services.AddTransient<IPatientAccountRepository, PatientAccountRepository>();

builder.Services.AddTransient<IPatientAccountFactory, PatientAccountFactory>();
builder.Services.AddTransient<PatientAccountMapper>();
builder.Services.AddTransient<PatientAccountService>();

builder.Services.AddTransient<IOperationRequestRepository, OperationRequestRepository>();
builder.Services.AddTransient<IOperationRequestFactory, OperationRequestFactory>();
builder.Services.AddTransient<OperationRequestMapper>();
builder.Services.AddTransient<OperationRequestService>();

// Registrar el servicio de correo electrónico
builder.Services.AddScoped<IEmailService, EmailService>(provider => 
    new EmailService(
        smtpServer: "smtp.gmail.com",
        smtpPort: 587,
        smtpUser: "asiermartinez101@gmail.com",
        smtpPass: "pube fslr bgzo xzlg"
    )
);
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection(); 
app.UseCors("AllowAll"); // Middleware do CORS
//app.UseAuthentication(); 
app.UseAuthorization();

app.MapControllers();

app.Run();

public partial class Program { }
