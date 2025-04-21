namespace DataModel.Repository;

using Microsoft.EntityFrameworkCore;

using DataModel.Model;

public interface IPatientContext{
	DbSet<PatientDataModel> Patients { get; set; }
}