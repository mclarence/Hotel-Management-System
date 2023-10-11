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

export const makeNotesDAO = (db: IDatabase<any, any>): INotesDAO => {
    const getNoteByDate = async (day: Date): Promise<CalendarNotes[]> => {
        const isoDate = day.toISOString();
        return await db.manyOrNone(queries.notes.getNoteById, [isoDate]);
    }

    const addNoteToDate = async (noteObj: CalendarNotes): Promise<CalendarNotes> => {
        return await db.one(queries.notes.addNote, [noteObj.date, noteObj.note]);
    }

    const deleteNote = async (noteId: number): Promise<void> => {
        await db.none(queries.notes.deleteNote, [noteId]);
    }

    const checkNoteExistsById = async (noteId: number): Promise<boolean> => {
        const note = await db.one(queries.notes.checkNoteExistsById, [noteId]);
        return note.exists;
    }

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