using System;

namespace Domain.Model.OperationRequest
{
    public class OperationRequest
    {
        private string _id;
        private string _patientId;
        private string _doctorId;
        private string _operationTypeId;
        private string _description;
        private string _status;
        private string _priority;

        public string Id
        {
            get => _id;
            set => _id = value ?? throw new ArgumentNullException(nameof(Id));
        }

        public string PatientId
        {
            get => _patientId;
            set => _patientId = value ?? throw new ArgumentNullException(nameof(PatientId));
        }

        public string DoctorId
        {
            get => _doctorId;
            set => _doctorId = value ?? throw new ArgumentNullException(nameof(DoctorId));
        }

        public string OperationTypeId
        {
            get => _operationTypeId;
            set => _operationTypeId = value ?? throw new ArgumentNullException(nameof(OperationTypeId));
        }

        public string Description
        {
            get => _description;
            set => _description = value ?? throw new ArgumentNullException(nameof(Description));
        }

        public string Status
        {
            get => _status;
            set => _status = value ?? throw new ArgumentNullException(nameof(Status));
        }

        public string Priority
        {
            get => _priority;
            set => _priority = value ?? throw new ArgumentNullException(nameof(Priority));
        }

        public DateTime RequestDate { get; set; }
        public DateTime Deadline { get; set; }
    }
}