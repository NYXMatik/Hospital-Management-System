using System;

namespace Application.DTO.OperationRequest
{
    public class OperationRequestDTO
    {
        public required string Id { get; set; }
        public required string PatientId { get; set; }
        public required string DoctorId { get; set; }
        public required string OperationTypeId { get; set; }
        public required string Description { get; set; }
        public DateTime RequestDate { get; set; }
        public required string Status { get; set; } // e.g., "Pending", "Approved", "Rejected"
        public required string Priority { get; set; } // e.g., "High", "Medium", "Low"
        public DateTime Deadline { get; set; }
    }
}