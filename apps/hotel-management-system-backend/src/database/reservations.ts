import { Reservation } from '@hotel-management-system/models'
import { IDatabase } from 'pg-promise';
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
}

export const makeReservationDAO = (db: IDatabase<any,any>): IReservationDAO => {
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

    const getReservationById = async (reservationId: number): Promise<Reservation | null> => {
        try {
            const reservation = await db.oneOrNone(queries.reservations.getReservationById, [reservationId]);
            return reservation;
        } catch (err) {
            if (err instanceof QueryResultError && err.code === queryResultErrorCode.noData) {
                return null;
            } else {
                throw err;
            }
        }
    }

    const checkReservationExistsById = async (reservationId: number): Promise<boolean> => {
        try {
            const exists = await db.one(queries.reservations.checkReservationExistsById, [reservationId]);
            return exists.exists;
        } catch (err) {
            throw err;
        }
    }

    const createReservation = async (reservation: Reservation): Promise<Reservation> => {
        try {
            const newReservation = await db.one(queries.reservations.addReservation, [reservation.roomId, reservation.guestId, reservation.startDate, reservation.endDate, reservation.reservationStatus]);
            return newReservation;
        } catch (err) {
            throw err;
        }
    }

    const updateReservation = async (reservation: Reservation): Promise<Reservation> => {
        try {
            const updatedReservation = await db.one(queries.reservations.updateReservation, [reservation.roomId, reservation.guestId, reservation.startDate, reservation.endDate, reservation.reservationId]);
            return updatedReservation;
        } catch (err) {
            throw err;
        }
    }

    const deleteReservation = async (reservationId: number): Promise<void> => {
        try {
            await db.none(queries.reservations.deleteReservation, [reservationId]);
        } catch (err) {
            throw err;
        }
    }

    return {
        getReservations,
        getReservationById,
        createReservation,
        deleteReservation,
        updateReservation,
        checkReservationExistsById
    }
}

