import {IDatabase} from "pg-promise";
import {CalendarNotes} from "@hotel-management-system/models";
import queries from "./sql/queries";

export interface INotesDAO {
    getNoteByDate: (date: Date) => Promise<CalendarNotes[]>
    addNoteToDate: (noteObj: CalendarNotes) => Promise<CalendarNotes>
    deleteNote: (noteId: number) => Promise<void>,
    checkNoteExistsById: (noteId: number) => Promise<boolean>
    updateNote: (noteObj: CalendarNotes) => Promise<CalendarNotes>
}

/**
 * Notes DAO
 * @param db - database object
 */
export const makeNotesDAO = (db: IDatabase<any, any>): INotesDAO => {

    /**
     * Get note by date
     * @param day - date
     * @returns - note object
     */
    const getNoteByDate = async (day: Date): Promise<CalendarNotes[]> => {
        const isoDate = day.toISOString();
        return await db.manyOrNone(queries.notes.getNoteById, [isoDate]);
    }

    /**
     * Add note to date
     * @param noteObj - note object
     * @returns - note object
     */
    const addNoteToDate = async (noteObj: CalendarNotes): Promise<CalendarNotes> => {
        return await db.one(queries.notes.addNote, [noteObj.date, noteObj.note]);
    }

    /**
     * Delete note
     * @param noteId - note id
     * @returns - void
     */
    const deleteNote = async (noteId: number): Promise<void> => {
        await db.none(queries.notes.deleteNote, [noteId]);
    }

    /**
     * Check if note exists by id
     * @param noteId - note id
     * @returns - boolean
     */
    const checkNoteExistsById = async (noteId: number): Promise<boolean> => {
        const note = await db.one(queries.notes.checkNoteExistsById, [noteId]);
        return note.exists;
    }

    /**
     * Update note
     * @param noteObj
     * @returns - note object
     */
    const updateNote = async (noteObj: CalendarNotes): Promise<CalendarNotes> => {
        return await db.one(queries.notes.updateNote, [noteObj.note, noteObj.noteId]);
    }

    return {
        getNoteByDate,
        addNoteToDate,
        deleteNote,
        checkNoteExistsById,
        updateNote,
    }


}