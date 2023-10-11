import {ApiResponse} from "@hotel-management-system/models";
import express from "express";

/**
 * Send response to the client
 * @param res - express response object
 * @param responseObj - response object
 */
const sendResponse = <T>(res: express.Response, responseObj: ApiResponse<T>) => {
    res.status(responseObj.statusCode).json(responseObj);
}

export default sendResponse;