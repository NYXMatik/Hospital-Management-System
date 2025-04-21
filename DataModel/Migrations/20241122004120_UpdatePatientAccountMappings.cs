using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataModel.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePatientAccountMappings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PatientAccounts",
                columns: table => new
                {
                    ProfileId = table.Column<string>(type: "TEXT", nullable: false),
                    Name_FirstName = table.Column<string>(type: "TEXT", nullable: false),
                    Name_LastName = table.Column<string>(type: "TEXT", nullable: false),
                    Name_FullName = table.Column<string>(type: "TEXT", nullable: false),
                    ContactInfo_Id = table.Column<int>(type: "INTEGER", nullable: false),
                    Contact_Email = table.Column<string>(type: "TEXT", nullable: false),
                    Contact_PhoneNumber = table.Column<string>(type: "TEXT", nullable: false),
                    ContactInfo_PatientAccountId = table.Column<string>(type: "TEXT", nullable: false),
                    BirthDate = table.Column<string>(type: "TEXT", nullable: false),
                    IsEmailVerified = table.Column<bool>(type: "INTEGER", nullable: false),
                    Address_Id = table.Column<int>(type: "INTEGER", nullable: true),
                    Address_Street = table.Column<string>(type: "TEXT", nullable: true),
                    Address_City = table.Column<string>(type: "TEXT", nullable: true),
                    Address_State = table.Column<string>(type: "TEXT", nullable: true),
                    Address_PostalCode = table.Column<string>(type: "TEXT", nullable: true),
                    Address_Country = table.Column<string>(type: "TEXT", nullable: true),
                    Address_PatientAccountId = table.Column<string>(type: "TEXT", nullable: true),
                    Active = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientAccounts", x => x.ProfileId);
                });

            migrationBuilder.CreateTable(
                name: "PatientAuditLogsDataModel",
                columns: table => new
                {
                    LogId = table.Column<Guid>(type: "TEXT", nullable: false),
                    ProfileId = table.Column<string>(type: "TEXT", nullable: false),
                    FieldName = table.Column<string>(type: "TEXT", nullable: false),
                    OldValue = table.Column<string>(type: "TEXT", nullable: false),
                    NewValue = table.Column<string>(type: "TEXT", nullable: false),
                    Date = table.Column<string>(type: "TEXT", nullable: false),
                    Operation = table.Column<string>(type: "TEXT", nullable: false),
                    ChangedBy = table.Column<string>(type: "TEXT", nullable: false),
                    PatientAccountDataModelProfileId = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientAuditLogsDataModel", x => x.LogId);
                    table.ForeignKey(
                        name: "FK_PatientAuditLogsDataModel_PatientAccounts_PatientAccountDataModelProfileId",
                        column: x => x.PatientAccountDataModelProfileId,
                        principalTable: "PatientAccounts",
                        principalColumn: "ProfileId");
                });

            migrationBuilder.CreateIndex(
                name: "IX_PatientAuditLogsDataModel_PatientAccountDataModelProfileId",
                table: "PatientAuditLogsDataModel",
                column: "PatientAccountDataModelProfileId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PatientAuditLogsDataModel");

            migrationBuilder.DropTable(
                name: "PatientAccounts");
        }
    }
}
