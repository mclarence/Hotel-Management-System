import {
    Guest
} from "@hotel-management-system/models"
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
}

const makeGuestDAO = (db: IDatabase<any, any>): IGuestDAO => {
    const getGuests = async (): Promise<Guest[]> => {
        try {
            const guests: Guest[] = await db.any(queries.guests.getGuests);
            return guests;
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
        try {
            const newGuest: Guest = await db.one(queries.guests.addGuest, [
                guest.firstName,
                guest.lastName,
                guest.emailAddress,
                guest.phoneNumber,
                guest.address
            ]);
            return newGuest;
        } catch (err) {
            throw err;
        }
    }

    const updateGuest = async (guest: Guest): Promise<Guest> => {
        try {
            const updatedGuest: Guest = await db.one(queries.guests.updateGuest, [
                guest.firstName,
                guest.lastName,
                guest.emailAddress,
                guest.phoneNumber,
                guest.address,
                guest.guestId
            ]);
            return updatedGuest;
        } catch (err) {
            throw err;
        }
    }

    const deleteGuest = async (guestId: number): Promise<void> => {
        try {
            const deletedGuest: Guest = await db.none(queries.guests.deleteGuest, [
                guestId
            ]);
        } catch (err) {
            throw err;
        }
    }

    const checkGuestExistsById = async (id: number): Promise<boolean> => {
        try {
            const exists: boolean = await db.one(queries.guests.checkGuestExistsById, [
                id
            ]);
            return exists;
        } catch (err) {
            if (
                err instanceof QueryResultError &&
                err.code === queryResultErrorCode.noData
            ) {
                return false;
            } else {
                throw err;
            }
        }
    }

    const getGuestById = async (id: number): Promise<Guest> => {
        try {
            const guest: Guest = await db.one(queries.guests.getGuestById, [
                id
            ]);
            return guest;
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

    return {
        getGuests,
        addGuest,
        updateGuest,
        deleteGuest,
        checkGuestExistsById,
        getGuestById
    }
}

export default makeGuestDAO;