using System;
using System.ComponentModel.DataAnnotations;

namespace DataModel.Model.OperationRequest
{
    public class OperationRequestDataModel
    {
        [Key]
        public string Id { get; set; }
        public string PatientId { get; set; }
        public string DoctorId { get; set; }
        public string OperationTypeId { get; set; }
        public string Description { get; set; }
        public DateTime RequestDate { get; set; }
        public string Status { get; set; } // e.g., "Pending", "Approved", "Rejected"
        public string Priority { get; set; } // e.g., "High", "Medium", "Low"
        public DateTime Deadline { get; set; }

        public OperationRequestDataModel() {}
    }
}