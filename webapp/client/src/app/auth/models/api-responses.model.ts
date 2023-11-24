import { User } from "src/app/auth/models/user.model";

export interface LoginSuccessResponse {
  user: User;
}

export interface ErrorResponse {
  message: string;
}

export interface FormErrorResponse extends ErrorResponse {
  validationErrors?: string[];
}

export type ErrorKind = FormErrorResponse & ErrorResponse;