namespace Domain.Model.OperationType;

public class RequiredStaff
{
    private string _specialty; // TODO: update with Specialty class
    public string Specialty
    {
        get { return _specialty; }
    }

    private string _role; // TODO: update with Role class
    public string Role
    {
        get { return _role; }
    }

    private int _quantity;
    public int Quantity
    {
        get { return _quantity; }
    }

    private RequiredStaff(){}

    public RequiredStaff(string specialty, string role, int quantity)
    {
        _specialty = specialty;
        _role = role;
        if(quantity <= 0)
        {
            throw new ArgumentNullException("Quantity must be greater than 0");
            
        }
        else
        {
            _quantity = quantity;
        }
    }


}