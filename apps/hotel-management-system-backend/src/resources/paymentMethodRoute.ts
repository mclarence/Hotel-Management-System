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
import strings from "../util/strings";

interface IPaymentMethodRoute {
    router: express.Router
}

/**
 * Payment Method Route
 * @param paymentMethodsDAO - payment methods DAO
 * @param guestsDAO - guests DAO
 * @param log - db event logger
 * @param authentication - authentication middleware
 * @param authorization - authorization middleware
 */
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
     * HTTP GET /api/payment-methods
     * Get all payment methods
     */
    router.get("/", authentication, authorization("paymentMethods.read"), async (req: express.Request, res: express.Response, next) => {
        try {
            const paymentMethods = await getPaymentMethods();
            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: strings.api.generic.success,
                data: paymentMethods,
            })
        } catch (e) {
            next(e);
        }
    })

    /**
     * HTTP GET /api/payment-methods/:paymentMethodId
     * Add a payment method
     */
    router.post("/add", authentication, authorization("paymentMethods.write"), async (req: express.Request, res: express.Response, next) => {
        try {
            const schema = Joi.object({
                guestId: Joi.number().required(),
                type: Joi.string().required().valid(...Object.values(PaymentMethodTypes)),
                cardNumber: Joi.string().creditCard().optional().allow("", null),
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

            if (req.body.cardCVV && req.body.cardCVV.length !== 3) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: strings.api.paymentMethods.invalidCardCVV,
                    data: null,
                })
            }

            // check if guest exists
            const guestId = await checkGuestExistsById(req.body.guestId);

            if (!guestId) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.NOT_FOUND,
                    message: strings.api.guest.guestNotFound(req.body.guestId),
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
                statusCode: StatusCodes.CREATED,
                message: strings.api.generic.success,
                data: paymentMethod,
            })
        } catch (e) {
            next(e);
        }
    })

    /**
     * HTTP GET /api/payment-methods/:paymentMethodId
     * Update payment method id
     */
    router.patch("/:paymentMethodId", authentication, authorization("paymentMethods.write"), async (req: express.Request, res: express.Response, next) => {
        try {
            const schema = Joi.object({
                paymentMethodId: Joi.number().required(),
                guestId: Joi.number().required(),
                type: Joi.string().required().valid({...Object.values(PaymentMethodTypes)}),
                cardNumber: Joi.string().creditCard().optional().allow("", null),
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
                    message: strings.api.paymentMethods.paymentMethodNotFound(req.body.paymentMethodId),
                    data: null,
                })
            }

            // check if guest exists
            const guestId = await checkGuestExistsById(req.body.guestId);

            if (!guestId) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.NOT_FOUND,
                    message: strings.api.guest.guestNotFound(req.body.guestId),
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
                message: strings.api.generic.success,
                data: paymentMethod,
            })
        } catch (e) {
            next(e);
        }
    })

    /**
     * HTTP DELETE /api/payment-methods/:paymentMethodId
     * Delete payment method by id
     */
    router.delete("/:paymentMethodId", authentication, authorization("paymentMethods.delete"), async (req: express.Request, res: express.Response, next) => {
        try {
            const id = parseInt(req.params.paymentMethodId);

            if (isNaN(id)) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: strings.api.paymentMethods.invalidPaymentMethodId(id),
                    data: null,
                })
            }

            const paymentMethodExists = await checkPaymentMethodExistsById(id);

            if (!paymentMethodExists) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.NOT_FOUND,
                    message: strings.api.paymentMethods.paymentMethodNotFound(id),
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
                message: strings.api.generic.success,
                data: null,
            })
        } catch (e) {
            next(e);
        }
    })

    return {
        router
    }
}