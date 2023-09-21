export const validateRequestBody = (body: any, requiredFields: string[]): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        const missingFields = requiredFields.filter(field => body[field] === undefined);

        if (missingFields.length > 0) {
            reject({
                type: 'missingFields',
                message: `Missing fields: ${missingFields.join(', ')}`,
            });
        } else {
            resolve();
        }
    })
}