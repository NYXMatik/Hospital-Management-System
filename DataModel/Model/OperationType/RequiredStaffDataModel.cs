namespace DataModel.Model;

using DataModel.Model;
using Domain.Model;
using Domain.Model.OperationType;
using Microsoft.CodeAnalysis.FlowAnalysis.DataFlow;
using System.ComponentModel.DataAnnotations;

public class RequiredStaffDataModel
{   
    [Key]
    
    public Guid Id { get; set; }

    public string Specialty { get; set; }
    public string Role { get; set; }
    public int Quantity { get; set; }

    public RequiredStaffDataModel() {}

    public RequiredStaffDataModel(RequiredStaff requiredStaff)
    {
        Id = new Guid();
        Specialty = requiredStaff.Specialty;
        Role = requiredStaff.Role;
        Quantity = requiredStaff.Quantity;
    }
}