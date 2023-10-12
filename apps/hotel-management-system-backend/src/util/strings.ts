const strings = {
    // API Response Messages
    api: {
        generic: {
            success: "Success",
            error: "An unknown error has occurred, please try again later.",
            queryNotProvided: "Query not provided",
            invalidQuery: "Invalid query",
            invalidRequestBody: "Invalid request body",
        },
        notes: {
            invalidNoteId: (noteId: number) => `Invalid note id: ${noteId}`,
            noteNotFound: (noteId: number) => `Note with id ${noteId} not found`,
        },
        guest: {
            invalidGuestId: (guestId: number) => `Invalid guest id: ${guestId}`,
            guestNotFound: (guestId: number) => `Guest with id ${guestId} not found`,
            cannotDeleteGuestAsTheyHaveReservations: `Cannot delete guest as they have reservations`,
        },
        paymentMethods: {
            paymentMethodNotFound: (paymentMethodId: number) => `Payment method with id ${paymentMethodId} not found`,
            invalidPaymentMethodId: (paymentMethodId: number) => `Invalid payment method id: ${paymentMethodId}`,
            invalidCardCVV: `Invalid card CVV`,
        },
        reservations: {
            invalidReservationId: (reservationId: number) => `Invalid reservation id: ${reservationId}`,
            reservationNotFound: (reservationId: number) => `Reservation with id ${reservationId} not found`,
            roomUnavailableForDates: (roomId: number) => `Room with id ${roomId} is unavailable for the specified dates.`,
        },
        room: {
            invalidRoomId: (roomId: number) => `Invalid room id: ${roomId}`,
            roomNotFound: (roomId: number) => `Room with id ${roomId} not found`,
            roomCodeConflict: (roomCode: string) => `Room with code ${roomCode} already exists`,
        },
        tickets: {
            invalidTicketId: (ticketId: number | string) => `Invalid ticket id: ${ticketId}`,
            ticketNotFound: (ticketId: number) => `Ticket with id ${ticketId} not found`,
        },
        users: {
            invalidUserId: (userId: number | string) => `Invalid user id: ${userId}`,
            userNotFound: (userId: number) => `User with id ${userId} not found`,
            usernameNotFound: (username: string) => `User with username ${username} not found`,
            usernameConflict: (username: string) => `User with username ${username} already exists`,
            cannotDeleteSelf: `Cannot delete self`,
            invalidPassword: `Invalid password`,
            loginSuccess: `Login success`,
            invalidToken: `Invalid token`,
            logoutSuccess: `Logout success`,
            unauthenticated: `Unauthenticated`,
            unauthorized: `Unauthorized`,
        },
        roles: {
            invalidRoleId: (roleId: number | string) => `Invalid role id: ${roleId}`,
            roleNotFound: (roleId: number) => `Role with id ${roleId} not found`,
            cannotDeleteRoleAsOtherUsersHaveIt: `Cannot delete role as other users have it`,
            roleAlreadyExists: (roleName: string) => `Role with name ${roleName} already exists`,
        },
        transactions: {
            invalidTransactionId: (transactionId: number | string) => `Invalid transaction id: ${transactionId}`,
            transactionNotFound: (transactionId: number) => `Transaction with id ${transactionId} not found`,
        },
    }
}

export default strings;