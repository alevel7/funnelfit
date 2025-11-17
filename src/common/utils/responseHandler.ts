import { ApiResponse } from '../interface/api.interface';

export class SendResponse {
  static success<T>(content: T, message: string): ApiResponse<T> {
    const data = { success: true, message, data: content } as ApiResponse<T>;
    return data;
  }

  static failure<T = null>(message: string, content = null): ApiResponse<T> {
    const data = { success: false, message, data: content } as ApiResponse<T>;
    return data;
  }
}
