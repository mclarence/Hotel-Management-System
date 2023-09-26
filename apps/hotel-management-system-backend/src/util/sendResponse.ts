import {ApiResponse} from "@hotel-management-system/models";
import express from "express";

const sendResponse = <T>(res: express.Response, responseObj: ApiResponse<T>) => {
    res.status(responseObj.statusCode).json(responseObj);
}

export default sendResponse;