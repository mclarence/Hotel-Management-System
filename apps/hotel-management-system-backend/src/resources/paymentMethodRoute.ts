import express from "express";
import {IAuthorizationMiddleware} from "../middleware/authorization";
import {IAuthenticationMiddleware} from "../middleware/authentication";
import {IPaymentMethodsDAO} from "../database/paymentMethods";
import sendResponse from "../util/sendResponse";
import {StatusCodes} from "http-status-codes";
import Joi from "joi";
import {IGuestDAO} from "../database/guests";
import {PaymentMethodTypes} from "../../../../libs/models/src/lib/enums/PaymentMethodTypes";
import {IEventLogger} from "../util/logEvent";
import {LogEventTypes} from "../../../../libs/models/src/lib/enums/LogEventTypes";

interface IPaymentMethodRoute {
    router: express.Router
}

export const makePaymentMethodRoute = (
    paymentMethodsDAO: IPaymentMethodsDAO,
    guestsDAO: IGuestDAO,
    log: IEventLogger,
    authentication: IAuthenticationMiddleware,
    authorization: IAuthorizationMiddleware,
): IPaymentMethodRoute => {
    const {
        getPaymentMethods,
        getPaymentMethodById,
        addPaymentMethod,
        updatePaymentMethod,
        deletePaymentMethod,
        checkPaymentMethodExistsById,
    } = paymentMethodsDAO

    const {
        checkGuestExistsById,
    } = guestsDAO

    const router = express.Router();


    /**
     * Get all payment methods
     */
    router.get("/", authentication, authorization("paymentMethods.read"), async (req: express.Request, res: express.Response) => {
        try {
            const paymentMethods = await getPaymentMethods();
            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: "Payment methods fetched successfully",
                data: paymentMethods,
            })
        } catch (err) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Failed to fetch payment methods",
                data: err.message,
            })
        }
    })

    /**
     * Add a payment method
     */
    router.post("/add", authentication, authorization("paymentMethods.write"), async (req: express.Request, res: express.Response) => {
        try {
            const schema = Joi.object({
                guestId: Joi.number().required(),
                type: Joi.string().required().valid(...Object.values(PaymentMethodTypes)),
                cardNumber: Joi.string().optional().allow("", null),
                cardCVV: Joi.string().optional().allow("", null),
                cardExpiration: Joi.date().optional().allow("", null),
                cardHolderName: Joi.string().optional().allow("", null),
                bankAccountNumber: Joi.string().optional().allow("", null),
                bankBSB: Joi.string().optional().allow("", null),
            })


            const {error} = schema.validate(req.body);

            if (error) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: error.message,
                    data: null,
                })
            }

            // check if guest exists
            const guestId = await checkGuestExistsById(req.body.guestId);

            if (!guestId) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.NOT_FOUND,
                    message: "Guest not found",
                    data: null,
                })
            }

            const paymentMethod = await addPaymentMethod(req.body);

            log(
                LogEventTypes.PAYMENT_METHOD_CREATE,
                req.userId,
                "Created a new payment method for guest: " + req.body.guestId + " with type: " + req.body.type,
            )

            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: "Payment method added successfully",
                data: paymentMethod,
            })
        } catch (err) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Failed to add payment method",
                data: err.message,
            })
        }
    })

    /**
     * Update payment method id
     */
    router.patch("/:paymentMethodId", authentication, authorization("paymentMethods.write"), async (req: express.Request, res: express.Response) => {
        try {
            const schema = Joi.object({
                paymentMethodId: Joi.number().required(),
                guestId: Joi.number().required(),
                type: Joi.string().required().valid({...Object.values(PaymentMethodTypes)}),
                cardNumber: Joi.string().optional().allow("", null),
                cardCVV: Joi.string().optional().allow("", null),
                cardExpiration: Joi.date().optional().allow("", null),
                cardHolderName: Joi.string().optional().allow("", null),
                bankAccountNumber: Joi.string().optional().allow("", null),
                bankBSB: Joi.string().optional().allow("", null),
            })

            const {error} = schema.validate(req.body);

            if (error) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: error.message,
                    data: null,
                })
            }

            // check if the payment method exists
            const paymentMethodId = await checkPaymentMethodExistsById(req.body.paymentMethodId);

            if (!paymentMethodId) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.NOT_FOUND,
                    message: "Payment method not found",
                    data: null,
                })
            }

            // check if guest exists
            const guestId = await checkGuestExistsById(req.body.guestId);

            if (!guestId) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.NOT_FOUND,
                    message: "Guest not found",
                    data: null,
                })
            }

            const paymentMethod = await updatePaymentMethod(req.body);

            log(
                LogEventTypes.PAYMENT_METHOD_UPDATE,
                req.userId,
                "Updated payment method with id: " + req.body.paymentMethodId + " for guest: " + req.body.guestId + " with type: " + req.body.type,
            )

            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: "Payment method updated successfully",
                data: paymentMethod,
            })
        } catch (err) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Failed to update payment method",
                data: err.message,
            })
        }
    })

    /**
     * Delete payment method by id
     */
    router.delete("/:paymentMethodId", authentication, authorization("paymentMethods.delete"), async (req: express.Request, res: express.Response) => {
        try {

            const id = parseInt(req.params.paymentMethodId);

            if (isNaN(id)) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: "Invalid payment method id",
                    data: null,
                })
            }

            const paymentMethodExists = await checkPaymentMethodExistsById(id);

            if (!paymentMethodExists) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.NOT_FOUND,
                    message: "Payment method not found",
                    data: null,
                })
            }

            await deletePaymentMethod(id);

            log(
                LogEventTypes.PAYMENT_METHOD_DELETE,
                req.userId,
                "Deleted payment method with id: " + id,
            )

            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: "Payment method deleted successfully",
                data: null,
            })
        } catch (err) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Failed to delete payment method",
                data: err.message,
            })
        }
    })

    return {
        router
    }
}