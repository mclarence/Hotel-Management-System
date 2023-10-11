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

/**
 * Guest DAO
 * @param db - database object
 */
const makeGuestDAO = (db: IDatabase<any, any>): IGuestDAO => {

    /**
     * Get payment methods by guest id
     * @param guestId - guest id
     * @returns - array of payment methods
     */
    const getPaymentMethodsByGuestId = async (guestId: number): Promise<PaymentMethod[]> => {
        return await db.any(queries.paymentMethods.getPaymentMethodsByGuestId, [guestId]);
    }

    /**
     * Get all guests
     * @returns - array of guests, empty array if no guests
     * @throws - error
     */
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

    /**
     * Add guest
     * @param guest
     * @returns - guest object
     */
    const addGuest = async (guest: Guest): Promise<Guest> => {
        return await db.one(queries.guests.addGuest, [
            guest.firstName,
            guest.lastName,
            guest.email,
            guest.phoneNumber,
            guest.address
        ]);
    }

    /**
     * Update guest
     * @param guest
     * @returns - guest object
     */
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

    /**
     * Delete guest
     * @param guestId
     * @returns - void
     */
    const deleteGuest = async (guestId: number): Promise<void> => {
        await db.none(queries.guests.deleteGuest, [
            guestId
        ]);
    }

    /**
     * Check if guest exists by id
     * @param id
     * @returns - boolean
     */
    const checkGuestExistsById = async (id: number): Promise<boolean> => {
        const exists = await db.one(queries.guests.checkGuestExistsById, [
            id
        ]);
        return exists.exists;
    }

    /**
     * Get guest by id
     * @param id
     * @returns - guest object
     */
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

    /**
     * Search guests
     * @param query
     * @returns - array of guests
     */
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