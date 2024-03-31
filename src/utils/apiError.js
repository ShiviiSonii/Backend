class apiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong!",
        errors = [],
        stack = ""
    ) {
        super(message); // Call the constructor of the parent class (Error) with the provided message.
        this.statusCode = statusCode; // The HTTP status code of the error.
        this.data = null; // Additional data associated with the error (not used in this implementation).
        this.message = message; // The error message.
        this.success = false; // Indicates failure.
        this.errors = errors; // Additional errors or error details.
        
        // If stack trace is provided, set it; otherwise, capture the stack trace.
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}


export default apiError;
