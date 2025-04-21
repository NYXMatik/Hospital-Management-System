using Domain.Model.OperationType;

namespace Application.DTO;

public class RequiredStaffDTO
{
    private string _specialty;
    public string Specialty
    {
        get { return _specialty; }
        set { _specialty = value; }
    }

    private string _role;
    public string Role
    {
        get { return _role; }
        set { _role = value; }
    }

    private int _quantity;
    public int Quantity
    {
        get { return _quantity; }
        set { _quantity = value; }
    }

    public RequiredStaffDTO(){}

    public RequiredStaffDTO(string specialty, string role, int quantity)
    {
        _specialty = specialty;
        _role = role;
        _quantity = quantity;
    }

    static public RequiredStaffDTO ToDTO(RequiredStaff staff)
    {
        return new RequiredStaffDTO(staff.Specialty, staff.Role, staff.Quantity);
    }

    static public IEnumerable<RequiredStaffDTO> ToDTO(IEnumerable<RequiredStaff> requiredStaff)
    {
        List<RequiredStaffDTO> requiredStaffDTO = new List<RequiredStaffDTO>();

        foreach( RequiredStaff staff in requiredStaff ) {
            RequiredStaffDTO staffDTO = ToDTO(staff);

            requiredStaffDTO.Add(staffDTO);
        }

        return requiredStaffDTO;
    }

    static public RequiredStaff ToDomain(RequiredStaffDTO staffDTO)
    {
        return new RequiredStaff(staffDTO.Specialty, staffDTO.Role, staffDTO.Quantity);
    }

    
}