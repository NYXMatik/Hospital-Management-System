namespace DataModel.Repository;

using Microsoft.EntityFrameworkCore;

using DataModel.Model;

public interface IStaffContext
{
	DbSet<StaffDataModel> Staffs { get; set; }
}