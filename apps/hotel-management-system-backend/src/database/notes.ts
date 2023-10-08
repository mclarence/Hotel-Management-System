import { IDatabase } from "pg-promise";
import {calendarNotes} from "@hotel-management-system/models";
import queries from "./sql/queries";

export interface INotesDAO {
    getNoteByDate: (date: Date) => Promise<calendarNotes | null>
}

export const makeNotesDAO = (db: IDatabase<any, any>): INotesDAO => {
    const getNoteByDate = async (day: Date): Promise<calendarNotes | null> => {
        try {
            const note: calendarNotes = await db.oneOrNone(queries.notes.getNoteById, [day]);
            console.log(day);
            return note;
        }
        catch (err){
            return null;
        }
    }
    
    const addNoteToDate = async (day : Date, note: String): Promise<calendarNotes> => {
        return new Promise<calendarNotes>((resolve, reject) => {
            db.one(`
                INSERT INTO calendar_notes (date, note)
                VALUES ($1, $2)
                RETURNING *
            `, [day, note]).then((day : Date) => {
                resolve(day);
            }).catch((err: any) => {
                reject(err);
            })
        })
    }

    return {
        getNoteByDate
        addNoteToDate
    }

   
}