const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mahasiswa',
    password: 'An290530', // pw postgresql
    port: 5432,
});



app.use(express.json());


app.get('/biodata', async (req, res) => {
    try {

        const result = await pool.query("SELECT * FROM biodata");


        res.status(200).json({
            message: "Berhasil mengambil data biodata",
            data: result.rows
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Terjadi kesalahan pada server atau database" });
    }
});


app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});