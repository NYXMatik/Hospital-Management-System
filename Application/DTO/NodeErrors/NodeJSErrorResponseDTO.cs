public class NodeJsErrorResponse
{
    public int StatusCode { get; set; }
    public string Error { get; set; }
    public string Message { get; set; }
    public ValidationDetails Validation { get; set; }
}

public class ValidationDetails
{
    public ValidationBody Body { get; set; }
    public ValidationBody Query { get; set; }
}

public class ValidationBody
{
    public string Source { get; set; }
    public string[] Keys { get; set; }
    public string Message { get; set; }
}

public class ErrorResponse
{
    public string Message { get; set; }
}

public class ErrorResponseWithErrors
{
    public ErrorResponse Errors { get; set; }
}