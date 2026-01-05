export class ApiError extends Error {
  status?: number | string;
  constructor(message: string, status?: number | string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}
