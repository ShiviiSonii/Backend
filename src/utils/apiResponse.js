/**
 * Class representing an API response.
 */
class apiResponse {
    /**
     * Create an API response.
     * @param {number} statusCode - The HTTP status code of the response.
     * @param {any} data - The data to be sent in the response.
     * @param {string} message - The message associated with the response (default: "Success").
     */
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode; // The HTTP status code of the response.
        this.data = data; // The data to be sent in the response.
        this.message = message; // The message associated with the response.
        this.success = statusCode < 400; // Indicates if the response is successful (status code < 400).
    }
}
