using System;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Collections.Generic;

namespace Domain.Model
{
    public class PatientAccount
    {
        [Key]
        private string _profileId;
        public string ProfileId => _profileId;

        private Name _name;
        public Name Name => _name;

        private ContactInfo _contactInfo;
        public ContactInfo ContactInfo => _contactInfo;

        private string _birthDate;
        public string BirthDate => _birthDate;

        private bool _isEmailVerified;
        public bool IsEmailVerified => _isEmailVerified;
        public void UpdateIsEmailVerified(bool isEmailVerified)
        {
            _isEmailVerified = isEmailVerified;
            Console.WriteLine($"Email verification status updated to: {isEmailVerified} {_contactInfo.Email}");

        }
        
        private List<Appointment> _appointments;
        public List<Appointment> Appointments => _appointments ??= new List<Appointment>(); // Lazy initialization
        public string AppointmentId { get; set; }  // This should exist in the Appointment class

        private Address _address;
        public Address Address
        {
            get => _address;
            set => _address = value ?? throw new ArgumentNullException(nameof(Address), "Address cannot be null!"); // Ensures Address cannot be null
        }
        public List<PatientAccountAuditLog> GetAuditLogs()
        {
            return _auditLogs ?? new List<PatientAccountAuditLog>();  // Return the list, or an empty list if it's null
        }

        private bool _active;
        public bool Active => _active;
        
        private List<PatientAccountAuditLog> _auditLogs;
        public List<PatientAccountAuditLog> AuditLogs
        {
            get => _auditLogs ??= new List<PatientAccountAuditLog>(); // Lazy initialization
        }
        public string GetProfileId()
        {
            return ProfileId; // Assuming ProfileId is a field or property of PatientAccount
        }
        public Address GetAddress()
        {
            return Address; // Assuming Address is a field or property of PatientAccount
        }
        public bool GetIsEmailVerified() => _isEmailVerified;
        public void UpdateStreet(string street)
        {
            _address.Street = street ?? _address.Street;
        }

        public void UpdateCity(string city)
        {
            _address.City = city ?? _address.City;
        }

        public void UpdateState(string state)
        {
            _address.State = state ?? _address.State;
        }

        public void UpdatePostalCode(string postalCode)
        {
            _address.PostalCode = postalCode ?? _address.PostalCode;
        }

        public void UpdateCountry(string country)
        {
            _address.Country = country ?? _address.Country;
        }
        public string GetStreet() => _address.Street;
        public string GetCity() => _address.City;
        public string GetState() => _address.State;
        public string GetPostalCode() => _address.PostalCode;
        public string GetCountry() => _address.Country;

        public string GetFullName()
        {
            return Name.FullName;
        }
        public string GetEmail() => ContactInfo.Email;

        public string GetPhoneNumber() => ContactInfo.PhoneNumber;

        public string GetBirthDate() => BirthDate;

        public bool GetIsActive() => Active;
        // Set Birth Date
        public void SetBirthDate(string birthDate)
        {
            if (!string.IsNullOrEmpty(birthDate) && IsValidISO8601Date(birthDate))
            {
                _birthDate = birthDate;
            }
            else
            {
                throw new ArgumentException("Invalid birth date!");
            }
        }

        // Set Address
        public void SetAddress(Address address)
        {
            if (address == null)
            {
                throw new ArgumentNullException(nameof(address), "Address cannot be null!");
            }

            _address = address;
        }

        public List<Appointment> GetAppointments() => Appointments;
        // Constructor
        public PatientAccount(string profileId, string name, string email, string phone, string birthDate,bool isEmailVerified, Address address = null, List<Appointment> appointments = null)
        {
            if (ValidateParameters(name, email, phone, birthDate))
            {
                _profileId = profileId;
                _name = new Name(name);
                _contactInfo = new ContactInfo(email, phone);
                _birthDate = birthDate;
                _address = address ?? new Address();  // Default address if null
                _isEmailVerified = isEmailVerified;  // Default value
                _active = true;  // Default value
                _auditLogs = new List<PatientAccountAuditLog>();
                _appointments = appointments ?? new List<Appointment>(); // Initialize if null
            }
            else
            {
                throw new ArgumentException("Invalid parameters!");
            }
        }

        public void AddAppointment(Appointment appointment)
        {
            if (appointment == null)
            {
                throw new ArgumentException("Appointment cannot be null!");
            }

            Appointments.Add(appointment);
        }

        public void UpdateAppointments(List<Appointment> appointments)
        {
            if (appointments == null)
            {
                throw new ArgumentException("Appointments list cannot be null!");
            }
            _appointments = appointments;
        }

        public bool UpdateName(string fullName)
        {
            if (!Name.IsValidName(fullName))
            {
                return false;
            }
            var names = fullName.Split(' ', StringSplitOptions.RemoveEmptyEntries);
            var firstName = names.Length > 0 ? names[0] : "";
            var lastName = names.Length > 1 ? names[names.Length - 1] : "";

            return _name.UpdateFullName(fullName) && _name.UpdateFirstName(firstName) && _name.UpdateLastName(lastName);
        }
       
        public Appointment GetAppointmentById(string appointmentId)
        {
            if (_appointments != null)
            {
                var appointment = _appointments.FirstOrDefault(a => a.AppointmentId == appointmentId);

                if (appointment != null)
                {
                    return appointment;
                }
                else
                {
                    throw new ArgumentException("Appointment not found!");
                }
            }
            else
            {
                throw new ArgumentException("No appointments available!");
            }
        }

        public bool UpdateEmail(string email) => _contactInfo.UpdateEmail(email);

        public bool UpdatePhoneNumber(string phoneNumber) => _contactInfo.UpdatePhoneNumber(phoneNumber);

        public void UpdateAddress(string street, string city, string state, string postalCode, string country)
        {
            if (_address == null)
            {
                _address = new Address();
            }
            _address.Street = street ?? _address.Street;
            _address.City = city ?? _address.City;
            _address.State = state ?? _address.State;
            _address.PostalCode = postalCode ?? _address.PostalCode;
            _address.Country = country ?? _address.Country;
        }

        public bool UpdateAuditList(List<PatientAccountAuditLog> auditLogs)
        {
            if (auditLogs != null)
            {
                _auditLogs = auditLogs;
                return true;
            }
            return false;
        }

        public void UpdateAuditLogs(List<PatientAccountAuditLog> auditLogs)
        {
            _auditLogs = auditLogs ?? new List<PatientAccountAuditLog>();
        }

        public void UpdateBirthDate(string birthDate)
        {
            if (!string.IsNullOrEmpty(birthDate) && IsValidISO8601Date(birthDate))
            {
                _birthDate = birthDate;
            }
            else
            {
                throw new ArgumentException("Invalid birth date!");
            }
        }

        // Validation methods
        private bool ValidateParameters(string name, string email, string phone, string birthDate)
        {
            return IsValidName(name) && IsValidEmail(email) && IsValidPhone(phone) && IsValidISO8601Date(birthDate);
        }

        private bool IsValidName(string name)
        {
            if (!Name.IsValidName(name))
            {
                throw new ArgumentException("Invalid name!");
            }
            return true;
        }

        private bool IsValidEmail(string email)
        {
            if (!ContactInfo.IsValidEmailAddres(email))
            {
                throw new ArgumentException("Invalid email!");
            }
            return true;
        }

        private bool IsValidPhone(string phone)
        {
            if (!ContactInfo.IsValidPhoneNumber(phone))
            {
                throw new ArgumentException("Invalid phone number!");
            }
            return true;
        }

        private bool IsValidISO8601Date(string dateString)
        {
            if (string.IsNullOrWhiteSpace(dateString))
                return false;

            string iso8601Format = "yyyy-MM-dd";
            return DateTime.TryParseExact(dateString, iso8601Format,
                                          CultureInfo.InvariantCulture,
                                          DateTimeStyles.None,
                                          out _);
        }
    }
}
