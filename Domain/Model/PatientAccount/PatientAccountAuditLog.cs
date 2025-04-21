using System;

namespace Domain.Model
{
    public class PatientAccountAuditLog
    {
        public string ProfileId { get; private set; }   // Asociado al perfil del paciente
        public string FieldName { get; private set; }    // Campo que fue modificado
        public string OldValue { get; private set; }     // Valor anterior
        public string NewValue { get; private set; }     // Nuevo valor
        public DateTime Timestamp { get; private set; }   // Fecha y hora del cambio
        public string ChangedBy { get; private set; }     // Persona que realizó el cambio
        public string Operation { get; private set; }     // Tipo de operación (por ejemplo, "Update")

        // Constructor para inicializar los detalles del log de auditoría
        public PatientAccountAuditLog(string profileId, string fieldName, string oldValue, string newValue, string changedBy, string operation)
        {
            ProfileId = profileId ?? throw new ArgumentNullException(nameof(profileId));
            FieldName = fieldName ?? throw new ArgumentNullException(nameof(fieldName));
            OldValue = oldValue ?? throw new ArgumentNullException(nameof(oldValue));
            NewValue = newValue ?? throw new ArgumentNullException(nameof(newValue));
            Timestamp = DateTime.UtcNow;
            ChangedBy = changedBy ?? throw new ArgumentNullException(nameof(changedBy));
            Operation = operation ?? throw new ArgumentNullException(nameof(operation));
        }
    }
}
