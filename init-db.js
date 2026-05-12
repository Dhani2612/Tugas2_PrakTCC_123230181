const mysql = require('mysql2');

// Konfigurasi koneksi ke MySQL yang disediakan
const connection = mysql.createConnection({
  host: '34.172.113.167',
  user: 'admin',
  password: 'mypassword'
});

connection.connect((err) => {
  if (err) {
    console.error('Koneksi ke MySQL gagal:', err.message);
    process.exit(1);
  }
  console.log('Terhubung ke MySQL!');

  // Buat database notes_123230181
  connection.query('CREATE DATABASE IF NOT EXISTS notes_123230181', (err) => {
    if (err) throw err;
    console.log('Database notes_123230181 siap.');

    connection.query('USE notes_123230181', (err) => {
      if (err) throw err;

      const createTableSql = `
        CREATE TABLE IF NOT EXISTS notes (
          id INT AUTO_INCREMENT PRIMARY KEY,
          judul VARCHAR(255) NOT NULL,
          isi TEXT,
          tanggal_dibuat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      connection.query(createTableSql, (err) => {
        if (err) throw err;
        console.log('Tabel notes siap.');
        connection.end();
      });
    });
  });
});
