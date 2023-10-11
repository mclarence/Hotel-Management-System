import {Express} from "express";
import startServer from "../startServer";
import {serverConfig} from "./serverConfig";
import {CalendarNotes} from "@hotel-management-system/models";
import {faker} from "@faker-js/faker";
import request from "supertest";
import dayjs from "dayjs";
import {addNoteToCalendar, login, makeNewCalendarNote} from "./common";

let app: Express;

// start the server before all tests
beforeAll(async () => {
    return await startServer(serverConfig).then(
        (server) => {
            app = server.app;
        }
    )
})



describe("calendar management", () => {
    it("should add a note to the calendar", async () => {
        const token = await login(app);
        const newNote = makeNewCalendarNote(dayjs.utc().toDate())

        const note = await addNoteToCalendar(app, token, newNote)

        expect(dayjs.utc(note.date).toDate()).toEqual(newNote.date)
        expect(note.note).toEqual(newNote.note)
    })

    it("should get a note from the calendar", async () => {
        const token = await login(app);
        const newNote = makeNewCalendarNote(dayjs.utc().startOf("day").toDate())

        const note = await addNoteToCalendar(app, token, newNote)

        const response = await request(app)
            .get(`/api/calendar/${dayjs.utc(newNote.date).format("YYYY-MM-DD")}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)

        // find the note in the response
        const foundNote = response.body.data.find((n: CalendarNotes) => {
            return n.noteId === note.noteId && n.date === note.date
        })

        expect(foundNote).toBeDefined()
    })
})