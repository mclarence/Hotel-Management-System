import path from "path";

const fs = require('fs');

const queries = {
    tables: {
        createAll: fs.readFileSync(path.join(__dirname, 'database', 'sql', 'sql_files', 'create_tables.sql')).toString(),
    }
}

export default queries;