import express from "express";
import {ITransactionDAO} from "../database/transaction";
import {IAuthenticationMiddleware} from "../middleware/authentication";
import {IAuthorizationMiddleware} from "../middleware/authorization";
import sendResponse from "../util/sendResponse";
import {StatusCodes} from "http-status-codes";
import strings from "../util/strings";
import Joi from "joi";
import {IGuestDAO} from "../database/guests";
import {Transaction} from "@hotel-management-system/models";
import {IEventLogger} from "../util/logEvent";
import {LogEventTypes} from "../../../../libs/models/src/lib/enums/LogEventTypes";

export interface ITransactionRoute {
    router: express.Router;
}

export const makeTransactionsRoute = (
    transactionsDAO: ITransactionDAO,
    guestDAO: IGuestDAO,
    log: IEventLogger,
    authentication: IAuthenticationMiddleware,
    authorization: IAuthorizationMiddleware
): ITransactionRoute => {
    const router = express.Router();

    const {
        getTransactions,
        getTransaction,
        createTransaction,
        updateTransaction,
        deleteTransaction,
        checkTransactionExistsById
    } = transactionsDAO

    const {
        getPaymentMethodsByGuestId,
        checkGuestExistsById
    } = guestDAO

    /**
     * Get all transactions
     */
    router.get('/', authentication, authorization('transactions.read'), async (req: any, res) => {
        try {
            const transactions = await getTransactions();
            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: strings.api.success,
                data: transactions
            })
        } catch (e) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: strings.api.serverError,
                data: e
            })
        }
    });

    /**
     * Get transaction by id
     */
    router.get('/:transactionId', authentication, authorization('transactions.read'), async (req: any, res) => {
        try {
            const transactionId = parseInt(req.params.transactionId)

            if (isNaN(transactionId)) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: strings.api.invalidTransactionId,
                    data: null
                })
            }

            // check if transaction exists
            const exists = checkTransactionExistsById(transactionId);

            if (!exists) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.NOT_FOUND,
                    message: strings.api.transactionIdNotFound(transactionId),
                    data: null
                })
            }

            const transaction = await getTransaction(transactionId);
            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: strings.api.success,
                data: transaction
            })
        } catch (e) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: strings.api.serverError,
                data: e
            })
        }
    })

    /**
     * Create transaction
     */
    router.post('/add', authentication, authorization('transactions.write'), async (req: any, res) => {
        try {
            const schema = Joi.object({
                paymentMethodId: Joi.number().required(),
                guestId: Joi.number().required(),
                amount: Joi.number().required(),
                description: Joi.string().required(),
                date: Joi.date().required()
            })

            const {error} = schema.validate(req.body);

            if (error) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: strings.api.invalidTransaction,
                    data: error
                })
            }

            // check if the guest exists
            const exists = checkGuestExistsById(req.body.guestId);

            if (!exists) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.NOT_FOUND,
                    message: strings.api.guestIdNotFound(req.body.guestId),
                    data: null
                })
            }

            // check if the payment method exists and belongs to the guest
            const paymentMethods = await getPaymentMethodsByGuestId(req.body.guestId);

            if (!paymentMethods.some(paymentMethod => paymentMethod.paymentMethodId === req.body.paymentMethodId)) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.NOT_FOUND,
                    message: strings.api.paymentMethodIdNotFound(req.body.paymentMethodId),
                    data: null
                })
            }

            const newTransaction: Transaction = {
                paymentMethodId: req.body.paymentMethodId,
                guestId: req.body.guestId,
                amount: req.body.amount,
                description: req.body.description,
                date: req.body.date
            }

            const createdTransaction = await createTransaction(newTransaction);

            log(
                LogEventTypes.TRANSACTION_CREATE,
                req.userId,
                "Created a new transaction for guest: " + req.body.guestId + " with amount: " + req.body.amount,
            )

            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: strings.api.success,
                data: createdTransaction
            })
        } catch (e) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: strings.api.serverError,
                data: e
            })
        }
    })

    /**
     * Update transaction
     */
    router.patch('/:transactionId', authentication, authorization('transactions.write'), async (req: any, res) => {
        try {
            const schema = Joi.object({
                paymentMethodId: Joi.number().required(),
                guestId: Joi.number().required(),
                amount: Joi.number().required(),
                description: Joi.string().required(),
                date: Joi.date().required()
            })

            const {error} = schema.validate(req.body);

            if (error) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: strings.api.invalidTransaction,
                    data: error
                })
            }

            const transactionId = req.params.transactionId;

            if (isNaN(transactionId)) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: strings.api.invalidTransactionId,
                    data: null
                })
            }

            // check if the guest exists
            const exists = checkGuestExistsById(req.body.guestId);

            if (!exists) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.NOT_FOUND,
                    message: strings.api.guestIdNotFound(req.body.guestId),
                    data: null
                })
            }

            // check if the payment method exists and belongs to the guest
            const paymentMethods = await getPaymentMethodsByGuestId(req.body.guestId);

            if (!paymentMethods.some(paymentMethod => paymentMethod.paymentMethodId === req.body.paymentMethodId)) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.NOT_FOUND,
                    message: strings.api.paymentMethodIdNotFound(req.body.paymentMethodId),
                    data: null
                })
            }

            const updatedTransaction: Transaction = {
                transactionId: transactionId,
                paymentMethodId: req.body.paymentMethodId,
                guestId: req.body.guestId,
                amount: req.body.amount,
                description: req.body.description,
                date: req.body.date
            }

            const updated = await updateTransaction(updatedTransaction);

            log(
                LogEventTypes.TRANSACTION_UPDATE,
                req.userId,
                "Updated transaction with id: " + transactionId + " for guest: " + req.body.guestId + " with amount: " + req.body.amount,
            )

            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: strings.api.success,
                data: updated
            })
        } catch (e) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: strings.api.serverError,
                data: e
            })
        }
    })

    /**
     * Delete transaction
     */
    router.delete('/:transactionId', authentication, authorization('transactions.write'), async (req: any, res) => {
        try {
            const transactionId = req.params.transactionId;

            if (isNaN(transactionId)) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: strings.api.invalidTransactionId,
                    data: null
                })
            }

            const exists = checkTransactionExistsById(transactionId);

            if (!exists) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.NOT_FOUND,
                    message: strings.api.transactionIdNotFound(transactionId),
                    data: null
                })
            }

            await deleteTransaction(transactionId);

            log(
                LogEventTypes.TRANSACTION_DELETE,
                req.userId,
                "Deleted transaction with id: " + transactionId,
            )

            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: strings.api.success,
                data: null
            })
        } catch (e) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: strings.api.serverError,
                data: e
            })
        }
    })

    return {
        router
    }
}