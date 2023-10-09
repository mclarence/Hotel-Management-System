import { IDatabase } from "pg-promise";
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
        try {
            const isoDate = day.toISOString();
            const note: CalendarNotes[] = await db.manyOrNone(queries.notes.getNoteById, [isoDate]);
            return note;
        }
        catch (err){
            return null;
        }
    }
    
    const addNoteToDate = async (noteObj: CalendarNotes): Promise<CalendarNotes> => {
        try {
            const note = await db.one(queries.notes.addNote, [noteObj.date, noteObj.note]);
            return note;
        } catch (err) {
            throw err
        }
    }

    const deleteNote = async (noteId: number): Promise<void> => {
        try {
            await db.none(queries.notes.deleteNote, [noteId]);
        } catch (err) {
            throw err
        }
    }

    const checkNoteExistsById = async (noteId: number): Promise<boolean> => {
        try {
            const note = await db.one(queries.notes.checkNoteExistsById, [noteId]);
            return note.exists;
        } catch (err) {
            throw err
        }
    }

    const updateNote = async (noteObj: CalendarNotes): Promise<CalendarNotes> => {
        try {
            const note = await db.one(queries.notes.updateNote, [noteObj.note, noteObj.noteId]);
            return note;
        } catch (err) {
            throw err
        }
    }

    return {
        getNoteByDate,
        addNoteToDate,
        deleteNote,
        checkNoteExistsById,
        updateNote,
    }

   
}