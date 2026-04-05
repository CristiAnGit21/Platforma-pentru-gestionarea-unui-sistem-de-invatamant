using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudyPlatform.DataAccessLayer.Migrations
{
    /// <inheritdoc />
    public partial class AddProfessorNameAndJsonConfig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProfessorName",
                table: "Events",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProfessorName",
                table: "Events");
        }
    }
}
