import {Guest, PaymentMethod} from "@hotel-management-system/models"
import pgPromise, {IDatabase} from "pg-promise";
import queries from "./sql/queries";
import QueryResultError = pgPromise.errors.QueryResultError;
import queryResultErrorCode = pgPromise.errors.queryResultErrorCode;

export interface IGuestDAO {
    getGuests(): Promise<Guest[]>;

    addGuest(guest: Guest): Promise<Guest>;

    updateGuest(guest: Guest): Promise<Guest>;

    deleteGuest(guestId: number): Promise<void>;

    getGuestById(id: number): Promise<Guest>;

    checkGuestExistsById(id: number): Promise<boolean>;

    searchGuests(query: string): Promise<Guest[]>;

    getPaymentMethodsByGuestId(guestId: number): Promise<PaymentMethod[]>;
}

const makeGuestDAO = (db: IDatabase<any, any>): IGuestDAO => {

    const getPaymentMethodsByGuestId = async (guestId: number): Promise<PaymentMethod[]> => {
        return await db.any(queries.paymentMethods.getPaymentMethodsByGuestId, [guestId]);
    }
    const getGuests = async (): Promise<Guest[]> => {
        try {
            return await db.any(queries.guests.getGuests);
        } catch (err) {
            if (
                err instanceof QueryResultError &&
                err.code === queryResultErrorCode.noData
            ) {
                return [];
            } else {
                throw err;
            }
        }
    }

    const addGuest = async (guest: Guest): Promise<Guest> => {
        return await db.one(queries.guests.addGuest, [
            guest.firstName,
            guest.lastName,
            guest.email,
            guest.phoneNumber,
            guest.address
        ]);
    }

    const updateGuest = async (guest: Guest): Promise<Guest> => {
        return await db.one(queries.guests.updateGuest, [
            guest.firstName,
            guest.lastName,
            guest.email,
            guest.phoneNumber,
            guest.address,
            guest.guestId
        ]);
    }

    const deleteGuest = async (guestId: number): Promise<void> => {
        await db.none(queries.guests.deleteGuest, [
            guestId
        ]);
    }

    const checkGuestExistsById = async (id: number): Promise<boolean> => {
        const exists = await db.one(queries.guests.checkGuestExistsById, [
            id
        ]);
        return exists.exists;
    }

    const getGuestById = async (id: number): Promise<Guest> => {
        try {
            return await db.one(queries.guests.getGuestById, [
                id
            ]);
        } catch (err) {
            if (
                err instanceof QueryResultError &&
                err.code === queryResultErrorCode.noData
            ) {
                return null;
            } else {
                throw err;
            }
        }
    }

    const searchGuests = async (query: string): Promise<Guest[]> => {
        try {
            return await db.any(queries.guests.searchGuests, [
                query
            ]);
        } catch (err) {
            if (
                err instanceof QueryResultError &&
                err.code === queryResultErrorCode.noData
            ) {
                return [];
            } else {
                throw err;
            }
        }
    }

    return {
        getGuests,
        addGuest,
        updateGuest,
        deleteGuest,
        checkGuestExistsById,
        getGuestById,
        searchGuests,
        getPaymentMethodsByGuestId
    }
}

export default makeGuestDAO;