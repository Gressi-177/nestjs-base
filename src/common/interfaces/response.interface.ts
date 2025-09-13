export interface Meta {
  code: number;
  success: boolean;
  message: string;
}

export interface ApiResponse<T> {
  meta: Meta;
  data?: T;
}

export const createResponse = <T>(
  data: T,
  message = 'Success',
  code = 200,
  meta?: any,
): ApiResponse<T> => ({
  meta: {
    code,
    success: true,
    message,
    ...meta,
  },
  data,
});

export const createErrorResponse = (
  message: string,
  code: number,
): ApiResponse<null> => ({
  meta: {
    code,
    success: false,
    message,
  },
});
