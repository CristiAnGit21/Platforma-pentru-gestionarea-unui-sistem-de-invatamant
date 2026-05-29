using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudyPlatform.DataAccessLayer.Migrations
{
    /// <inheritdoc />
    public partial class AddGroupSpecializationAndProfessor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ProfessorId",
                table: "Groups",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Specialization",
                table: "Groups",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Groups_ProfessorId",
                table: "Groups",
                column: "ProfessorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Groups_Users_ProfessorId",
                table: "Groups",
                column: "ProfessorId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Groups_Users_ProfessorId",
                table: "Groups");

            migrationBuilder.DropIndex(
                name: "IX_Groups_ProfessorId",
                table: "Groups");

            migrationBuilder.DropColumn(
                name: "ProfessorId",
                table: "Groups");

            migrationBuilder.DropColumn(
                name: "Specialization",
                table: "Groups");
        }
    }
}
