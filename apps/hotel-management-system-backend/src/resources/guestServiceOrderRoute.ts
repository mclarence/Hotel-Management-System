import express from "express";
import {IGuestServiceOrderDAO} from "../database/guestServiceOrders"; // Import the guest service order DAO
import {IAuthenticationMiddleware} from "../middleware/authentication";
import {IAuthorizationMiddleware} from "../middleware/authorization";
import sendResponse from "../util/sendResponse";
import {StatusCodes} from "http-status-codes";
import Joi from "joi";
import strings from "../util/strings";
import {IEventLogger} from "../util/logEvent";
import {LogEventTypes} from "../../../../libs/models/src/lib/enums/LogEventTypes";
import {IGuestServiceDAO} from "../database/guestService";
import {GuestServiceOrder} from "@hotel-management-system/models";
import {IReservationDAO} from "../database/reservations";
import dayjs from "dayjs";

export interface IGuestServiceOrderRoute {
    router: express.Router;
}

const makeGuestServiceOrdersRoute = (
    guestServiceOrderDAO: IGuestServiceOrderDAO,
    reservationsDAO: IReservationDAO,
    guestServiceDAO: IGuestServiceDAO,
    log: IEventLogger,
    authentication: IAuthenticationMiddleware,
    authorization: IAuthorizationMiddleware
): IGuestServiceOrderRoute => {
    const {
        getGuestServiceOrders,
        getGuestServiceOrderById,
        addGuestServiceOrder,
        updateGuestServiceOrder,
        deleteGuestServiceOrder,
        checkGuestServiceOrderExistsById,
    } = guestServiceOrderDAO;

    const router = express.Router();

    router.get("/", authentication, authorization("guestServiceOrders.read"), async (req, res, next) => {
        try {
            const guestServiceOrders = await getGuestServiceOrders();
            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: strings.api.generic.success,
                data: guestServiceOrders,
            });
        } catch (e) {
            next(e);
        }
    });

    router.get("/:orderId", authentication, authorization("guestServiceOrders.read"), async (req, res, next) => {
        try {
            const orderId = parseInt(req.params.orderId);

            if (isNaN(orderId)) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: strings.api.guestServiceOrder.invalidOrderId(orderId),
                    data: null,
                });
            }

            const guestServiceOrder = await getGuestServiceOrderById(orderId);

            if (!guestServiceOrder) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.NOT_FOUND,
                    message: strings.api.guestServiceOrder.orderNotFound(orderId),
                    data: null,
                });
            }

            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: strings.api.generic.success,
                data: guestServiceOrder,
            });
        } catch (e) {
            next(e);
        }
    });

    router.post("/add", authentication, authorization("guestServiceOrders.create"), async (req, res, next) => {
        try {
            const schema = Joi.object({
                reservationId: Joi.number().required(),
                orderTime: Joi.date().required(),
                orderStatus: Joi.string().required(),
                description: Joi.string().optional().allow(null, ""),
                serviceId: Joi.number().required(),
                orderPrice: Joi.number().required(),
                orderQuantity: Joi.number().required()
            });

            const {error} = schema.validate(req.body);

            if (error) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: error.message,
                    data: error.message,
                });
            }

            const reservationId = req.body.reservationId;
            const serviceId = req.body.serviceId;

            // Check if the reservation and service exist
            const reservationExists = await reservationsDAO.checkReservationExistsById(reservationId);
            const service = await guestServiceDAO.getGuestServiceById(serviceId);

            if (service === null) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.NOT_FOUND,
                    message: strings.api.guestService.serviceNotFound(serviceId),
                    data: null,
                });
            }

            if (!reservationExists) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.NOT_FOUND,
                    message: strings.api.guestServiceOrder.reservationOrServiceNotFound,
                    data: null,
                });
            }

            // check the quantity of the service. -1 means unlimited
            if (service.serviceQuantity !== -1) {
                // check if the quantity is enough
                if (service.serviceQuantity < parseInt(req.body.orderQuantity)) {
                    return sendResponse(res, {
                        success: false,
                        statusCode: StatusCodes.NOT_FOUND,
                        message: strings.api.guestServiceOrder.serviceNotEnoughQuantity,
                        data: null,
                    });
                }
            }

            const newGuestServiceOrder: GuestServiceOrder = {
                orderPrice: req.body.orderPrice,
                reservationId: reservationId,
                orderTime: req.body.orderTime,
                orderStatus: req.body.orderStatus,
                description: req.body.description,
                serviceId: serviceId,
                orderQuantity: req.body.orderQuantity
            };

            const guestServiceOrder = await addGuestServiceOrder(newGuestServiceOrder);

            log(
                LogEventTypes.GUEST_SERVICE_ORDER_ADD,
                req.userId,
                "Added a new guest service order with id: " + guestServiceOrder.orderId,
            );

            // decrease the quantity of the service
            if (service.serviceQuantity !== -1) {
                const guestServiceItem = await guestServiceDAO.getGuestServiceById(serviceId);
                guestServiceItem.serviceQuantity -= parseInt(req.body.orderQuantity)
                await guestServiceDAO.updateGuestService(guestServiceItem);
            }

            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.CREATED,
                message: strings.api.generic.success,
                data: guestServiceOrder,
            });
        } catch (e) {
            next(e);
        }
    });

    router.patch("/:orderId", authentication, authorization("guestServiceOrders.update"), async (req, res, next) => {
        try {
            const orderId = parseInt(req.params.orderId);

            if (isNaN(orderId)) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: strings.api.guestServiceOrder.invalidOrderId(orderId),
                    data: null,
                });
            }

            const exists = await checkGuestServiceOrderExistsById(orderId);

            if (!exists) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.NOT_FOUND,
                    message: strings.api.guestServiceOrder.orderNotFound(orderId),
                    data: null,
                });
            }

            const schema = Joi.object({
                reservationId: Joi.number().required(),
                orderTime: Joi.date().required(),
                orderStatus: Joi.string().required(),
                description: Joi.string().optional().allow(null, ""),
                serviceId: Joi.number().required(),
                orderPrice: Joi.number().required(),
                orderQuantity: Joi.number().required()
            });

            const {error} = schema.validate(req.body);

            if (error) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: error.message,
                    data: error.message,
                });
            }

            const updatedGuestServiceOrder = {
                orderId: orderId,
                orderPrice: req.body.orderPrice,
                reservationId: req.body.reservationId,
                orderTime: dayjs.utc(req.body.orderTime).toDate(),
                orderStatus: req.body.orderStatus,
                description: req.body.description,
                serviceId: req.body.serviceId,
                orderQuantity: req.body.orderQuantity
            };

            const guestServiceOrder = await updateGuestServiceOrder(updatedGuestServiceOrder);

            log(
                LogEventTypes.GUEST_SERVICE_ORDER_UPDATE,
                req.userId,
                "Updated guest service order with id: " + orderId,
            );

            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: strings.api.generic.success,
                data: guestServiceOrder,
            });
        } catch (e) {
            next(e);
        }
    });

    router.delete("/:orderId", authentication, authorization("guestServiceOrders.delete"), async (req, res, next) => {
        try {
            const orderId = parseInt(req.params.orderId);

            if (isNaN(orderId)) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: strings.api.guestServiceOrder.invalidOrderId(orderId),
                    data: null,
                });
            }

            const exists = await checkGuestServiceOrderExistsById(orderId);

            if (!exists) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.NOT_FOUND,
                    message: strings.api.guestServiceOrder.orderNotFound(orderId),
                    data: null,
                });
            }

            await deleteGuestServiceOrder(orderId);

            log(
                LogEventTypes.GUEST_SERVICE_ORDER_DELETE,
                req.userId,
                "Deleted guest service order with id: " + orderId,
            );

            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: strings.api.generic.success,
                data: null,
            });
        } catch (e) {
            next(e);
        }
    });

    return {
        router,
    };
};

export default makeGuestServiceOrdersRoute;
