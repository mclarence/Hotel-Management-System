const strings = {
    // API Response Messages
    api: {
        success: "Success",
        serverError: "The server encountered an internal error. Please try again later.",
        unauthorized: "You are not authorized to perform this action.",
        unauthenticated: "This action requires authentication.",
        missingField: (fieldName: string) => `The request body is missing the required field: ${fieldName}`,
        tokenInvalid: "The provided token is invalid.",
        invalidUserId: "The provided userId is invalid.",
        userIdNotFound: (userId: number) => `User with userId ${userId} not found.`,
        userConflict: (username: string) => `User with username ${username} already exists.`,
        roleIdNotFound: (roleId: number) => `Role with roleId ${roleId} not found.`,
        loggedOut: "You have been logged out.",
        invalidField: (fieldName: string) => `The request body contains an invalid field: ${fieldName}`,
    }
}

export default strings;