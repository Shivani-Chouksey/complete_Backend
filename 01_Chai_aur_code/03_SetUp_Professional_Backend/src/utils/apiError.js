// Custom error class for handling API errors in a structured way.
class ApiError extends Error {
  //Constructor for the ApiError class.
  constructor(
    statusCode,
    message = "something went wrong",
    errrors = [],
    statck = ""
  ) {
    super(message); //Call the built-in Error constructor with the message
    this.statusCode = statusCode; // HTTP status code (e.g., 404 for Not Found, 500 for Server Error)
    this.message = message; // Error message
    this.data = null; // No data is returned in an error
    this.success = false; // Always false for errors
    this.errors = this.errrors; // Additional error details (e.g., validation issues)

    // Set the stack trace for debugging
    if (statck) {
      this.stack = statck; // Use the provided stack trace
    } else {
      // Automatically generate the stack trace from the point where the error was thrown
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// Export the custom ApiError class
export { ApiError };
