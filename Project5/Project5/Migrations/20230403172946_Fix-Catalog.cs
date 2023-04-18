using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Project5.Migrations
{
    /// <inheritdoc />
    public partial class FixCatalog : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Catalog_User_UserId",
                table: "Catalog");

            migrationBuilder.DropIndex(
                name: "IX_Catalog_UserId",
                table: "Catalog");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Catalog");

            migrationBuilder.CreateTable(
                name: "CatalogUser",
                columns: table => new
                {
                    UsersId = table.Column<int>(type: "int", nullable: false),
                    catalogsId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CatalogUser", x => new { x.UsersId, x.catalogsId });
                    table.ForeignKey(
                        name: "FK_CatalogUser_Catalog_catalogsId",
                        column: x => x.catalogsId,
                        principalTable: "Catalog",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CatalogUser_User_UsersId",
                        column: x => x.UsersId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_CatalogUser_catalogsId",
                table: "CatalogUser",
                column: "catalogsId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CatalogUser");

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "Catalog",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Catalog_UserId",
                table: "Catalog",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Catalog_User_UserId",
                table: "Catalog",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id");
        }
    }
}
