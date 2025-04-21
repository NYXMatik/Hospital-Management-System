namespace DataModel.Repository
{
    using Microsoft.EntityFrameworkCore;
    using DataModel.Model;
    using DataModel.Mapper;
    using Domain.Model.OperationAppointment;
    using Domain.IRepository;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public class OperationAppointmentRepository : IOperationAppointmentRepository
    {
        private readonly GenericContext _context;
        private readonly OperationAppointmentMapper _operationAppointmentMapper;

        public OperationAppointmentRepository(GenericContext context, OperationAppointmentMapper mapper)
        {
            _context = context;
            _operationAppointmentMapper = mapper;
        }

        // Method to get all operation appointments
        public async Task<IEnumerable<OperationAppointment>> GetAppointmentsAsync()
        {
            var appointmentsDataModel = await _context.Set<OperationAppointmentDataModel>()
                .Include(a => a.StaffList)
                .ToListAsync();

            return _operationAppointmentMapper.ToDomain(appointmentsDataModel);
        }

        // Method to add a new operation appointment
        public async Task AddAppointmentAsync(OperationAppointment appointment)
        {
            var appointmentDataModel = _operationAppointmentMapper.ToDataModel(appointment);
            await _context.Set<OperationAppointmentDataModel>().AddAsync(appointmentDataModel);
            await _context.SaveChangesAsync();
        }

        // Method to get an operation appointment by ID
        public async Task<OperationAppointment> GetAppointmentByIdAsync(int id)
        {
            var appointmentDataModel = await _context.Set<OperationAppointmentDataModel>()
                .Include(a => a.StaffList)
                .FirstOrDefaultAsync(a => a.AppointmentId.ToString() == id.ToString());

            return _operationAppointmentMapper.ToDomain(appointmentDataModel);
        }

        // Method to update an existing operation appointment
        public async Task UpdateAppointmentAsync(OperationAppointment appointment)
        {
            var appointmentDataModel = _operationAppointmentMapper.ToDataModel(appointment);
            _context.Set<OperationAppointmentDataModel>().Update(appointmentDataModel);
            await _context.SaveChangesAsync();
        }

        // Method to delete an operation appointment by ID
        public async Task DeleteAppointmentAsync(int id)
        {
            var appointmentDataModel = await _context.Set<OperationAppointmentDataModel>().FindAsync(id);
            if (appointmentDataModel != null)
            {
                _context.Set<OperationAppointmentDataModel>().Remove(appointmentDataModel);
                await _context.SaveChangesAsync();
            }
        }
    }
}