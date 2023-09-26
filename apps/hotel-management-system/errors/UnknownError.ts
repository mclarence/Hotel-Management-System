class UnknownError extends Error {
    private underlyingError: unknown;
    constructor(message: string, underlyingError: any) {
        super(message);
        this.name = "UnknownError";
        this.underlyingError = underlyingError;
    }
}

export default UnknownError;