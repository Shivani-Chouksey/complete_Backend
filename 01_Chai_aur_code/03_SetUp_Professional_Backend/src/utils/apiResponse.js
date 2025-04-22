/*  A reusable class to structure API responses consistently across your application. */
class ApiResponse {
  /* Constructor for the ApiResponse class. */
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode; //HTTP status code to indicate the result of the request.
    this.data = data; // The actual response data (can be any type: object, array, string, etc.).
    this.message = message; // Message describing the outcome of the request.

    // Boolean indicating success or failure.
    // If status code is less than 400, it's considered a successful response.
    this.success = statusCode < 400;
  }
}
