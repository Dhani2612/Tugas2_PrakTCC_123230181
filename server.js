const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'notes_db'
});

// Create
app.post('/notes', (req, res) => {
    const { judul, isi } = req.body;
    db.query('INSERT INTO notes (judul, isi) VALUES (?, ?)', [judul, isi], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ id: result.insertId, judul, isi });
    });
});

// Read
app.get('/notes', (req, res) => {
    db.query('SELECT * FROM notes ORDER BY tanggal_dibuat DESC', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Update
app.put('/notes/:id', (req, res) => {
    const { judul, isi } = req.body;
    db.query('UPDATE notes SET judul = ?, isi = ? WHERE id = ?', [judul, isi, req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Updated successfully" });
    });
});

// Delete
app.delete('/notes/:id', (req, res) => {
    db.query('DELETE FROM notes WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Deleted successfully" });
    });
});

// Cek koneksi ke MySQL saat start
db.connect((err) => {
    if (err) {
        console.error('Gagal koneksi ke database:', err.message);
        return;
    }
    console.log('Terhubung ke database MySQL!');

    // Server baru jalan kalau DB sudah connect
    app.listen(3000, () => {
        console.log('Server running on http://localhost:3000');
    });
});