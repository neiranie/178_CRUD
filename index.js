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

app.post('/biodata', async (req, res) => {
    try {
        const { nim, nama, alamat, jurusan } = req.body;

        if (!nim || !nama) {
            return res.status(400).json({ message: "Field nim dan nama wajib diisi" });
        }

        const result = await pool.query(
            "INSERT INTO biodata (nim, nama, alamat, jurusan) VALUES ($1, $2, $3, $4) RETURNING *",
            [nim, nama, alamat, jurusan]
        );

        res.status(201).json({
            message: "Berhasil menambahkan data biodata",
            data: result.rows[0]
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Terjadi kesalahan pada server atau database" });
    }
});

app.put('/biodata/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nim, nama, alamat, jurusan } = req.body;

        if (!nim || !nama) {
            return res.status(400).json({ message: "Field nim dan nama wajib diisi" });
        }

        const result = await pool.query(
            "UPDATE biodata SET nim = $1, nama = $2, alamat = $3, jurusan = $4 WHERE id = $5 RETURNING *",
            [nim, nama, alamat, jurusan, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Data tidak ditemukan" });
        }

        res.status(200).json({
            message: "Berhasil memperbarui data biodata",
            data: result.rows[0]
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Terjadi kesalahan pada server atau database" });
    }
});

app.delete('/biodata/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("DELETE FROM biodata WHERE id = $1 RETURNING *", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Data tidak ditemukan" });
        }

        res.status(200).json({
            message: "Berhasil menghapus data biodata",
            data: result.rows[0]
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Terjadi kesalahan pada server atau database" });
    }
});