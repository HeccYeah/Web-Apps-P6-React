using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Project5.Migrations
{
    /// <inheritdoc />
    public partial class FixUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "user_cat_year",
                table: "User");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "user_cat_year",
                table: "User",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
