import {Reservation} from '@hotel-management-system/models'
import {IDatabase} from 'pg-promise';
import queries from './sql/queries';
import pgPromise = require('pg-promise');
import QueryResultError = pgPromise.errors.QueryResultError;
import queryResultErrorCode = pgPromise.errors.queryResultErrorCode;


export interface IReservationDAO {
    getReservations(): Promise<Reservation[]>;

    getReservationById(reservationId: number): Promise<Reservation | null>;

    createReservation(reservation: Reservation): Promise<Reservation>;

    checkReservationExistsById(reservationId: number): Promise<boolean>;

    updateReservation(reservation: Reservation): Promise<Reservation>;

    deleteReservation(reservationId: number): Promise<void>;

    getReservationsByGuestId(guestId: number): Promise<Reservation[]>;

    checkIfReservationIsAvailable(roomId: number, startDate: Date, endDate: Date): Promise<boolean>;

    getDb(): IDatabase<any, any>;
}

/**
 * Reservation DAO
 * @param db - database object
 */
export const makeReservationDAO = (db: IDatabase<any, any>): IReservationDAO => {

    /**
     * Get all reservations
     */
    const getReservations = async (): Promise<Reservation[]> => {
        try {
            return await db.any(queries.reservations.getReservations);
        } catch (err) {
            if (err instanceof QueryResultError && err.code === queryResultErrorCode.noData) {
                return [];
            } else {
                throw err;
            }
        }
    }

    /**
     * Get reservation by id
     * @param reservationId
     * @returns reservation, null if no reservation
     */
    const getReservationById = async (reservationId: number): Promise<Reservation | null> => {
        try {
            return await db.oneOrNone(queries.reservations.getReservationById, [reservationId]);
        } catch (err) {
            if (err instanceof QueryResultError && err.code === queryResultErrorCode.noData) {
                return null;
            } else {
                throw err;
            }
        }
    }

    /**
     * Check if reservation exists by id
     * @param reservationId
     * @returns boolean
     */
    const checkReservationExistsById = async (reservationId: number): Promise<boolean> => {
        const exists = await db.one(queries.reservations.checkReservationExistsById, [reservationId]);
        return exists.exists;
    }

    /**
     * Create reservation
     * @param reservation
     * @returns reservation
     */
    const createReservation = async (reservation: Reservation): Promise<Reservation> => {
        return await db.one(queries.reservations.addReservation, [reservation.roomId, reservation.guestId, reservation.startDate, reservation.endDate, reservation.reservationStatus]);
    }

    /**
     * Update reservation
     * @param reservation
     * @returns reservation
     */
    const updateReservation = async (reservation: Reservation): Promise<Reservation> => {
        return await db.one(queries.reservations.updateReservation, [
            reservation.roomId,
            reservation.guestId,
            reservation.startDate,
            reservation.endDate,
            reservation.reservationStatus,
            reservation.checkInDate,
            reservation.checkOutDate,
            reservation.reservationId]);
    }

    /**
     * Delete reservation
     * @param reservationId
     * @returns void
     */
    const deleteReservation = async (reservationId: number): Promise<void> => {
        await db.none(queries.reservations.deleteReservation, [reservationId]);
    }

    /**
     * Get reservations by guest id
     * @param guestId
     * @returns reservations
     */
    const getReservationsByGuestId = async (guestId: number): Promise<Reservation[]> => {
        try {
            return await db.any(queries.reservations.getReservationsByGuestId, [guestId]);
        } catch (err) {
            if (err instanceof QueryResultError && err.code === queryResultErrorCode.noData) {
                return [];
            } else {
                throw err;
            }
        }
    }

    /**
     * Check if reservation is available
     * @param roomId The room id
     * @param startDate The start date
     * @param endDate The end date
     */
    const checkIfReservationIsAvailable = async (roomId: number, startDate: Date, endDate: Date): Promise<boolean> => {
        const exists = await db.one(queries.reservations.checkIfReservationIsAvailable, [roomId, startDate, endDate]);
        return !exists.exists;
    }

    /**
     * Get database
     */
    const getDb = (): IDatabase<any, any> => {
        return db;
    }

    return {
        getReservations,
        getReservationById,
        createReservation,
        deleteReservation,
        updateReservation,
        checkReservationExistsById,
        getReservationsByGuestId,
        checkIfReservationIsAvailable,
        getDb
    }
}

