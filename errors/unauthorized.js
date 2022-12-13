import CustomApiError from "./customApi.js";
import { StatusCodes } from "http-status-codes";

class UnAuthorizedError extends CustomApiError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

export default UnAuthorizedError;
