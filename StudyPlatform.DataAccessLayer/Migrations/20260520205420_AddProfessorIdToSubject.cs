using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudyPlatform.DataAccessLayer.Migrations
{
    /// <inheritdoc />
    public partial class AddProfessorIdToSubject : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ProfessorId",
                table: "Subjects",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Subjects_ProfessorId",
                table: "Subjects",
                column: "ProfessorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Subjects_Users_ProfessorId",
                table: "Subjects",
                column: "ProfessorId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Subjects_Users_ProfessorId",
                table: "Subjects");

            migrationBuilder.DropIndex(
                name: "IX_Subjects_ProfessorId",
                table: "Subjects");

            migrationBuilder.DropColumn(
                name: "ProfessorId",
                table: "Subjects");
        }
    }
}
