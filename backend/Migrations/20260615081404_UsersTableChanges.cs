using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ittask4.Migrations
{
    /// <inheritdoc />
    public partial class UsersTableChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastActivities",
                table: "Users");

            migrationBuilder.AddColumn<DateTime>(
                name: "LastSeen",
                table: "Users",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<List<int>>(
                name: "LastWeekActivitesInMinutes",
                table: "Users",
                type: "integer[]",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastSeen",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "LastWeekActivitesInMinutes",
                table: "Users");

            migrationBuilder.AddColumn<string>(
                name: "LastActivities",
                table: "Users",
                type: "jsonb",
                nullable: true);
        }
    }
}
