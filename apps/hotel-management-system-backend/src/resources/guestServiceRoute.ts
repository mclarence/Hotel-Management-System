import express from "express";
import {IGuestServiceDAO} from "../database/guestService"; // Import the guest service DAO
import {IAuthenticationMiddleware} from "../middleware/authentication";
import {IAuthorizationMiddleware} from "../middleware/authorization";
import sendResponse from "../util/sendResponse";
import {StatusCodes} from "http-status-codes";
import Joi from "joi";
import strings from "../util/strings";
import {IEventLogger} from "../util/logEvent";
import {LogEventTypes} from "../../../../libs/models/src/lib/enums/LogEventTypes";
import {GuestService} from "@hotel-management-system/models";

export interface IGuestServiceRoute {
    router: express.Router;
}

export const makeGuestServicesRoute = (
    guestServiceDAO: IGuestServiceDAO,
    log: IEventLogger,
    authentication: IAuthenticationMiddleware,
    authorization: IAuthorizationMiddleware
) => {
    const {
        getGuestServices,
        getGuestServiceById,
        addGuestService,
        updateGuestService,
        deleteGuestService,
        checkGuestServiceExistsById,
        searchGuestServices,
    } = guestServiceDAO;

    const router = express.Router();

    router.get("/", authentication, authorization("guestServices.read"), async (req, res, next) => {
        try {
            const guestServices = await getGuestServices();
            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: strings.api.generic.success,
                data: guestServices,
            });
        } catch (e) {
            next(e);
        }
    });

    // Function to search guest services by service description
    router.get("/search", authentication, authorization('guestServices.read'), async (req, res, next) => {
        try {
            const query = req.query.q;

            if (query === undefined || query === null || query === "") {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: strings.api.generic.queryNotProvided,
                    data: null
                });
            }

            const services = await searchGuestServices(query.toString());

            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: strings.api.generic.success,
                data: services
            });
        } catch (e) {
            next(e);
        }
    });


    router.get("/:serviceId", authentication, authorization("guestServices.read"), async (req, res, next) => {
        try {
            const serviceId = parseInt(req.params.serviceId);

            if (isNaN(serviceId)) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: strings.api.guestService.invalidServiceId(serviceId),
                    data: null,
                });
            }

            const guestService = await getGuestServiceById(serviceId);

            if (!guestService) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.NOT_FOUND,
                    message: strings.api.guestService.serviceNotFound(serviceId),
                    data: null,
                });
            }

            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: strings.api.generic.success,
                data: guestService,
            });
        } catch (e) {
            next(e);
        }
    });

    router.post("/add", authentication, authorization("guestServices.create"), async (req, res, next) => {
        try {
            const schema = Joi.object({
                serviceDescription: Joi.string().required(),
                servicePrice: Joi.number().required().min(0),
                serviceQuantity: Joi.number().required().min(-1),
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

            const newGuestService: GuestService = {
                serviceDescription: req.body.serviceDescription,
                servicePrice: req.body.servicePrice,
                serviceQuantity: req.body.serviceQuantity,
            };

            const guestService = await addGuestService(newGuestService);

            log(
                LogEventTypes.GUEST_SERVICE_ADD,
                req.userId,
                "Added a new guest service with id: " + guestService.serviceId,
            );

            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.CREATED,
                message: strings.api.generic.success,
                data: guestService,
            });
        } catch (e) {
            next(e);
        }
    });

    router.patch("/:serviceId", authentication, authorization("guestServices.update"), async (req, res, next) => {
        try {
            const serviceId = parseInt(req.params.serviceId);

            if (isNaN(serviceId)) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: strings.api.guestService.invalidServiceId(serviceId),
                    data: null,
                });
            }

            const exists = await checkGuestServiceExistsById(serviceId);

            if (!exists) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.NOT_FOUND,
                    message: strings.api.guestService.serviceNotFound(serviceId),
                    data: null,
                });
            }

            const schema = Joi.object({
                serviceDescription: Joi.string().required(),
                servicePrice: Joi.number().required().min(0),
                serviceQuantity: Joi.number().required().min(-1),
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

            const updatedGuestService = {
                serviceId: serviceId,
                serviceDescription: req.body.serviceDescription,
                servicePrice: req.body.servicePrice,
                serviceQuantity: req.body.serviceQuantity,
            };

            const guestService = await updateGuestService(updatedGuestService);

            log(
                LogEventTypes.GUEST_SERVICE_UPDATE,
                req.userId,
                "Updated guest service with id: " + serviceId,
            );

            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: strings.api.generic.success,
                data: guestService,
            });
        } catch (e) {
            next(e);
        }
    });

    router.delete("/:serviceId", authentication, authorization("guestServices.delete"), async (req, res, next) => {
        try {
            const serviceId = parseInt(req.params.serviceId);

            if (isNaN(serviceId)) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: strings.api.guestService.invalidServiceId(serviceId),
                    data: null,
                });
            }

            const exists = await checkGuestServiceExistsById(serviceId);

            if (!exists) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.NOT_FOUND,
                    message: strings.api.guestService.serviceNotFound(serviceId),
                    data: null,
                });
            }

            await deleteGuestService(serviceId);

            log(
                LogEventTypes.GUEST_SERVICE_DELETE,
                req.userId,
                "Deleted guest service with id: " + serviceId,
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

export default makeGuestServicesRoute;
