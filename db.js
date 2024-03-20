const Pool = require('pg').Pool;

// const pool = new Pool({
//     user: 'postgres',
//     password:'admin',
//     host: 'localhost',
//     port:  5432,  // Default value is 5432
//     database: 'perntodo'
//     });

//     module.exports = pool;


const pool = new Pool({
    user: 'postgres',
    password:'poly123',
    host: 'localhost',
    port:  5432,  // Default value is 5432
    database: 'iplmsuser'
    });

    module.exports = pool;