import {StatusCodes} from "http-status-codes";

export type ApiResponse<T> = {
    success: boolean;
    statusCode: StatusCodes;
    message: string;
    data: T;
}