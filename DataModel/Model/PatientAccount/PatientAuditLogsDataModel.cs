using Domain.Model;

namespace DataModel.Model
{
    public class PatientAuditLogsDataModel
    {
            public Guid LogId { get; set; } // Nueva clave primaria

        public string ProfileId { get; set; }   // Relacionado con el PatientAccount
        public string FieldName { get; set; }   // Nombre del campo modificado
        public string OldValue { get; set; }    // Valor anterior
        public string NewValue { get; set; }    // Nuevo valor
        public string Date { get; set; }        // Fecha del cambio
        public string Operation { get; set; }   // Tipo de operación (por ejemplo, "Update")
        public string ChangedBy { get; set; }   // Quién realizó el cambio

        // Constructor vacío
        public PatientAuditLogsDataModel() {}

        // Constructor que recibe un PatientAccountAuditLog
        public PatientAuditLogsDataModel(PatientAccountAuditLog auditLog)
        {
            ProfileId = auditLog.ProfileId;       // Relaciona el log con el perfil del paciente
            FieldName = auditLog.FieldName;       // El nombre del campo modificado
            OldValue = auditLog.OldValue;         // El valor anterior del campo
            NewValue = auditLog.NewValue;         // El nuevo valor del campo
            Date = auditLog.Timestamp.ToString("yyyy-MM-dd HH:mm:ss"); // Fecha en formato legible
            Operation = auditLog.Operation;       // Tipo de operación (por ejemplo, "Update")
            ChangedBy = auditLog.ChangedBy;       // Quién realizó el cambio
        }
    }
}
