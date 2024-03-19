/**
 * Class representing an API error.
 */
class apiError extends Error {
    /**
     * Create an API error.
     * @param {number} statusCode - The HTTP status code of the error.
     * @param {string} message - The error message (default: "Something went wrong!").
     * @param {Array} errors - An array of additional errors or error details (default: []).
     * @param {string} stack - The stack trace of the error (default: "").
     */
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
