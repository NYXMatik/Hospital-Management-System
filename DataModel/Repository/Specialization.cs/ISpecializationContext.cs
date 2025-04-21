namespace DataModel.Repository;

using DataModel.Model;
using Microsoft.EntityFrameworkCore;

public interface ISpecializationContext
{
	DbSet<SpecializationDataModel> Specializations { get; set; }
}