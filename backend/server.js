const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

// CORS — izinkan semua origin (akan di-restrict setelah frontend deploy)
app.use(cors());
app.use(express.json());

// Koneksi ke MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST || '34.172.113.167',
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'mypassword',
    database: process.env.DB_NAME || 'notes_123230181'
});

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ status: 'OK', message: 'Notes API Backend is running' });
});

// Create
app.post('/notes', (req, res) => {
    const { judul, isi } = req.body;
    db.query('INSERT INTO notes (judul, isi) VALUES (?, ?)', [judul, isi], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: result.insertId, judul, isi });
    });
});

// Read
app.get('/notes', (req, res) => {
    db.query('SELECT * FROM notes ORDER BY tanggal_dibuat DESC', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Update
app.put('/notes/:id', (req, res) => {
    const { judul, isi } = req.body;
    db.query('UPDATE notes SET judul = ?, isi = ? WHERE id = ?', [judul, isi, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Updated successfully" });
    });
});

// Delete
app.delete('/notes/:id', (req, res) => {
    db.query('DELETE FROM notes WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Deleted successfully" });
    });
});

// Cek koneksi ke MySQL saat start
db.connect((err) => {
    if (err) {
        console.error('Gagal koneksi ke database:', err.message);
        // Tetap jalankan server meski DB gagal (untuk health check)
    } else {
        console.log('Terhubung ke database MySQL!');
    }

    app.listen(PORT, () => {
        console.log(`Backend server running on port ${PORT}`);
    });
});
