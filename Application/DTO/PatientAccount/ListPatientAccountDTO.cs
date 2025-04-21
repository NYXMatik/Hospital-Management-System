using System;
using System.Collections.Generic;
using Domain.Model;

namespace Application.DTO
{
    public class ListPatientAccountDTO
    {
        public string ProfileId { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string BirthDate { get; set; }
        public bool IsEmailVerified { get; set; }
        public bool Active { get; set; }
        public string Address { get; set; }

        // Constructor vacío
        public ListPatientAccountDTO() { }

        // Constructor con parámetros
        public ListPatientAccountDTO(string profileId, string fullName, string email, string phoneNumber, string birthDate, bool isEmailVerified, bool active, string address)
        {
            ProfileId = profileId;
            FullName = fullName;
            Email = email;
            PhoneNumber = phoneNumber;
            BirthDate = birthDate;
            IsEmailVerified = isEmailVerified;
            Active = active;
            Address = address;
        }

        // Método estático para convertir un PatientAccount a ListPatientAccountDTO
        public static ListPatientAccountDTO ToDTO(PatientAccount patientAccount)
        {
            // Se asume que los datos de la dirección se concatenan en un solo string para la simplicidad
            string address = patientAccount.GetAddress() != null
                ? $"{patientAccount.GetAddress().Street}, {patientAccount.GetAddress().City}, {patientAccount.GetAddress().State}, {patientAccount.GetAddress().PostalCode}, {patientAccount.GetAddress().Country}"
                : string.Empty;

            return new ListPatientAccountDTO(
                patientAccount.GetProfileId(),
                patientAccount.GetFullName(),
                patientAccount.GetEmail(),
                patientAccount.GetPhoneNumber(),
                patientAccount.GetBirthDate(),
                patientAccount.IsEmailVerified,
                patientAccount.GetIsActive(),
                address
            );
        }

        // Método estático para convertir una lista de PatientAccount a una lista de ListPatientAccountDTO
        public static IEnumerable<ListPatientAccountDTO> ToDTO(IEnumerable<PatientAccount> patientAccounts)
        {
            List<ListPatientAccountDTO> patientAccountDTOs = new List<ListPatientAccountDTO>();

            foreach (var patientAccount in patientAccounts)
            {
                patientAccountDTOs.Add(ToDTO(patientAccount)); 
            }

            return patientAccountDTOs; 
        }

    }
}
