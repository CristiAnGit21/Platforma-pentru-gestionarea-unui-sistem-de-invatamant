using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudyPlatform.DataAccessLayer.Migrations
{
    public partial class AddPasswordAndStatus : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                ALTER TABLE ""Users"" ADD COLUMN IF NOT EXISTS ""Password"" text NOT NULL DEFAULT '';
                ALTER TABLE ""Users"" ADD COLUMN IF NOT EXISTS ""Status"" integer NOT NULL DEFAULT 0;
            ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "Password", table: "Users");
            migrationBuilder.DropColumn(name: "Status", table: "Users");
        }
    }
}
