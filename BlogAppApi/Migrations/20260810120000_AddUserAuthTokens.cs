using System;
using BlogAppApi.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BlogAppApi.Migrations;

[DbContext(typeof(ApplicationDbContext))]
[Migration("20260810120000_AddUserAuthTokens")]
public partial class AddUserAuthTokens : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "UserAuthTokens",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                AccessTokenHash = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                RefreshTokenHash = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                ExpiresAt = table.Column<DateTime>(type: "datetime2", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_UserAuthTokens", x => x.Id);
                table.ForeignKey(
                    name: "FK_UserAuthTokens_Users_UserId",
                    column: x => x.UserId,
                    principalTable: "Users",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateIndex(name: "IX_UserAuthTokens_AccessTokenHash", table: "UserAuthTokens", column: "AccessTokenHash", unique: true);
        migrationBuilder.CreateIndex(name: "IX_UserAuthTokens_RefreshTokenHash", table: "UserAuthTokens", column: "RefreshTokenHash", unique: true);
        migrationBuilder.CreateIndex(name: "IX_UserAuthTokens_UserId", table: "UserAuthTokens", column: "UserId");
    }

    protected override void Down(MigrationBuilder migrationBuilder) =>
        migrationBuilder.DropTable(name: "UserAuthTokens");
}
