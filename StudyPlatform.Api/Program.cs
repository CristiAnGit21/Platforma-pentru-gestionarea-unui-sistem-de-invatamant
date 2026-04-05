using System.Text.Json.Serialization;
using StudyPlatform.DataAccessLayer.Context;
using StudyPlatform.BusinessLayer.Interfaces;
using StudyPlatform.BusinessLayer.Core;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<PlatformDbContext>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "https://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(System.Text.Json.JsonNamingPolicy.CamelCase));
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.UseInlineDefinitionsForEnums();
});

// Services
builder.Services.AddScoped<IUserLogic, UserLogic>();
builder.Services.AddScoped<IGroupLogic, GroupLogic>();
builder.Services.AddScoped<ISubjectLogic, SubjectLogic>();
builder.Services.AddScoped<IGradeLogic, GradeLogic>();
builder.Services.AddScoped<IAttendanceLogic, AttendanceLogic>();
builder.Services.AddScoped<IReportLogic, ReportLogic>();
builder.Services.AddScoped<IEventLogic, EventLogic>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("Frontend");
app.MapControllers();

app.Run();