using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Project5.Migrations
{
    /// <inheritdoc />
    public partial class webId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "webId",
                table: "User",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "webId",
                table: "User");
        }
    }
}
