class ApiResponse<T> {
    code: number;
    message: string;
    data: T | null;

    constructor(code: number, message: string, data: T | null) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    static success<T>(data: T): ApiResponse<T> {
        return new ApiResponse(200, "Success", data);
    }

    static error(code: number, message: string): ApiResponse<null> {
        return new ApiResponse(code, message, null);
    }
}

export default ApiResponse;
  