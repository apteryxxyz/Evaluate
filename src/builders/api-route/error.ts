export class ApiError extends Error {
  public constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }

  public override get name() {
    return `ApiError(${this.status})`;
  }

  public toObject() {
    return {
      status: this.status,
      message: this.message,
    };
  }

  public static fromObject(object: ReturnType<ApiError['toObject']>): ApiError {
    return new ApiError(object.status, object.message);
  }
}
