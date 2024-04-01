/**
 * Higher-order function to handle asynchronous operations in middleware.
 * The asynchronous function to be wrapped.
 * A function that wraps the provided asynchronous function and handles errors.
 */
const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next); // Invokes the provided asynchronous function.
    } catch (error) {
        // Handles errors by sending an appropriate error response.
        res.status(error.code || 500).json({
            success: false, // Indicates failure.
            message: error.message // Error message.
        });
    }
};

// Exporting the asyncHandler function to be used in other parts of the code.
export default asyncHandler;
