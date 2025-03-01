const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db');
const routes = require('./routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 3000;

// Verifico la conexión antes de levantar el servidor
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        process.exit(1);
    } else {
        console.log('Conexión exitosa a PostgreSQL:', res.rows[0].now);
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    }
});

