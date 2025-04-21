namespace Domain.Model;

public interface ISpecialization 
{
	//long Id { get; } // Propriedade apenas leitura para o Id
    string GetName(); 
    string GetDescription(); 
}