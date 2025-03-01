const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'tienda',
    password: process.env.DB_PASSWORD || 'darioclosy',
    port: process.env.DB_PORT || 5432
});

pool.connect()
    .then(() => console.log('Conexión exitosa a PostgreSQL'))
    .catch(err => console.error('Error conectando a PostgreSQL', err));

module.exports = pool;
