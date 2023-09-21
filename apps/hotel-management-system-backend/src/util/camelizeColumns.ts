import pgPromise from "pg-promise";

export const camelizeColumns = (data) => {
    const template = data[0];
    for (let prop in template) {
        const camel = pgPromise.utils.camelize(prop);
        if (!(camel in template)) {
            for (let i = 0; i < data.length; i++) {
                let d = data[i];
                d[camel] = d[prop];
                delete d[prop];
            }
        }
    }
}