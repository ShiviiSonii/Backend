class apiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode; // The HTTP status code of the response.
        this.data = data; // The data to be sent in the response.
        this.message = message; // The message associated with the response.
        this.success = statusCode < 400; // Indicates if the response is successful (status code < 400).
    }
}

export default apiResponse
