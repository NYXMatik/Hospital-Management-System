namespace Domain.Model.OperationType;

using System.ComponentModel.DataAnnotations;
using System.Globalization;

public class OperationType : IOperationType
{
    [Key]
	private string _name;
	public string Name
	{
		get { return _name; }
	}

    private SortedSet<Version> _versions;

    public SortedSet<Version> Versions
    {
        get { return _versions; }
    }

	private OperationType(){}


    public OperationType(string name, SortedSet<Version> versions){
        if(name == null || name == ""){
            throw new ArgumentNullException("Name is not valid");
        }
        _name = name;

        _versions = versions;
    }

    public bool checkIfLastPending(){
        return Versions.Last().GetPending();
    }

    public void AddVersion(Version version){
        if(Versions.Count == 0){
            version.SetVersion(1);
        }
        else{
            if(checkIfLastPending()){
            Versions.Remove(Versions.Last());
            }
            else{
            version.SetVersion(Versions.Last().VersionNumber + 1);
            }
        }
        Versions.Add(version);
        //changePendingStatus(version);
    }

    public void changePendingStatus(Version version){
        if(Versions.Last().GetStartDate().CompareTo(DateTime.Now) < 0){
            foreach(var v in Versions.Reverse()){
                v.ChangePending(false);
            }
            Versions.Last().ChangePending(false);
        }
    }

    public Version currentVersion(){
        foreach(var v in Versions.Reverse()){
            if(!v.GetPending()){
                return v;
            }
        }
        return null;
    }

    public string getName()
    {
        return _name;
    }

    public bool getStatus()
    {
        return Versions.Last().GetStatus();
    }

    public void setStatus(bool status)
    {
        Versions.Last().ChangeStatus(status);
    }

}
