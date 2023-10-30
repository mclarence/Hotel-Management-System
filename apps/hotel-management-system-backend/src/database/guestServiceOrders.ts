import pgPromise, {IDatabase} from "pg-promise";
import {GuestServiceOrder} from "../../../../libs/models/src/lib/guestServiceOrder";
import queries from "./sql/queries";
import QueryResultError = pgPromise.errors.QueryResultError;

export interface IGuestServiceOrderDAO {
    getGuestServiceOrders(): Promise<GuestServiceOrder[]>;

    getGuestServiceOrderById(id: number): Promise<GuestServiceOrder>;

    addGuestServiceOrder(guestService: GuestServiceOrder): Promise<GuestServiceOrder>;

    updateGuestServiceOrder(guestService: GuestServiceOrder): Promise<GuestServiceOrder>;

    deleteGuestServiceOrder(guestServiceId: number): Promise<void>;

    checkGuestServiceOrderExistsById(id: number): Promise<boolean>;
}

export const makeGuestServiceOrderDAO = (db: IDatabase<any, any>): IGuestServiceOrderDAO => {
    const getGuestServiceOrders = async (): Promise<GuestServiceOrder[]> => {
        return await db.any(queries.guestServiceOrder.getGuestServices)
    }

    const getGuestServiceOrderById = async (id: number): Promise<GuestServiceOrder | null> => {
        try {
            return await db.one(queries.guestServiceOrder.getGuestServiceById, [id])
        } catch (e) {
            if (e instanceof QueryResultError && e.code === pgPromise.errors.queryResultErrorCode.noData) {
                return null
            } else {
                throw e
            }
        }
    }

    const addGuestServiceOrder = async (guestServiceOrder: GuestServiceOrder): Promise<GuestServiceOrder> => {
        return await db.one(queries.guestServiceOrder.addGuestService, [
            guestServiceOrder.reservationId,
            guestServiceOrder.serviceId,
            guestServiceOrder.orderTime,
            guestServiceOrder.orderStatus,
            guestServiceOrder.orderPrice,
            guestServiceOrder.description,
            guestServiceOrder.orderQuantity
        ])
    }

    const updateGuestServiceOrder = async (guestServiceOrder: GuestServiceOrder): Promise<GuestServiceOrder> => {
        return await db.one(queries.guestServiceOrder.updateGuestService, [
            guestServiceOrder.reservationId,
            guestServiceOrder.serviceId,
            guestServiceOrder.orderTime,
            guestServiceOrder.orderStatus,
            guestServiceOrder.orderPrice,
            guestServiceOrder.description,
            guestServiceOrder.orderQuantity,
            guestServiceOrder.orderId
        ])
    }

    const deleteGuestServiceOrder = async (guestServiceId: number): Promise<void> => {
        return await db.none(queries.guestServiceOrder.deleteGuestService, [guestServiceId])
    }

    const checkGuestServiceOrderExistsById = async (id: number): Promise<boolean> => {
        const guestService: any = await db.one(queries.guestServiceOrder.checkGuestServiceExistsById, [id]);
        return guestService.exists;
    }

    return {
        getGuestServiceOrders,
        getGuestServiceOrderById,
        addGuestServiceOrder,
        updateGuestServiceOrder,
        deleteGuestServiceOrder,
        checkGuestServiceOrderExistsById
    }
}