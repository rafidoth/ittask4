using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ittask4.Migrations
{
    /// <inheritdoc />
    public partial class UsersTableChanges1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastWeekActivitesInMinutes",
                table: "Users");

            migrationBuilder.AddColumn<Dictionary<DateOnly, int>>(
                name: "ActivitesInMinutes",
                table: "Users",
                type: "jsonb",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ActivitesInMinutes",
                table: "Users");

            migrationBuilder.AddColumn<List<int>>(
                name: "LastWeekActivitesInMinutes",
                table: "Users",
                type: "integer[]",
                nullable: true);
        }
    }
}
