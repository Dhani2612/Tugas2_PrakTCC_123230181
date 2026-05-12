// ===== GANTI URL INI SETELAH BACKEND DIDEPLOY KE CLOUD RUN =====
const API_URL = 'https://notes-backend-720084965883.us-central1.run.app';
// ================================================================

const notesList = document.getElementById('notesList');

// Fungsi ambil data dari Backend
async function fetchNotes() {
    try {
        const res = await fetch(`${API_URL}/notes`);
        const data = await res.json();
        notesList.innerHTML = data.map(n => `
            <div class="note-item">
                <h3>${n.judul}</h3>
                <p>${n.isi}</p>
                <small>${new Date(n.tanggal_dibuat).toLocaleString('id-ID')}</small>
                <div style="display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: auto;">
                    <button style="background-color: #f59e0b; color: white; border: none; border-radius: 6px; padding: 0.5rem 1rem; cursor: pointer; transition: 0.2s;" onmouseover="this.style.backgroundColor='#d97706'" onmouseout="this.style.backgroundColor='#f59e0b'" onclick="editNote(${n.id}, \`${n.judul.replace(/`/g, '\\`')}\`, \`${n.isi.replace(/`/g, '\\`')}\`)">Edit</button>
                    <button style="background-color: #fee2e2; color: #ef4444; border: none; border-radius: 6px; padding: 0.5rem 1rem; cursor: pointer; transition: 0.2s;" onmouseover="this.style.backgroundColor='#ef4444'; this.style.color='white';" onmouseout="this.style.backgroundColor='#fee2e2'; this.style.color='#ef4444';" onclick="deleteNote(${n.id})">Hapus</button>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error("Gagal mengambil catatan:", err);
    }
}

// Fungsi tambah catatan baru
async function addNote() {
    const judul = document.getElementById('judul').value;
    const isi = document.getElementById('isi').value;

    if (!judul || !isi) {
        alert('Judul dan isi catatan harus diisi!');
        return;
    }

    try {
        await fetch(`${API_URL}/notes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ judul, isi })
        });
        document.getElementById('judul').value = '';
        document.getElementById('isi').value = '';
        fetchNotes();
    } catch (err) {
        console.error("Gagal menyimpan catatan:", err);
    }
}

// Fungsi edit catatan (menampilkan form edit)
function editNote(id, judul, isi) {
    document.getElementById('editId').value = id;
    document.getElementById('editJudul').value = judul;
    document.getElementById('editIsi').value = isi;
    document.getElementById('editArea').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Fungsi update catatan
async function updateNote() {
    const id = document.getElementById('editId').value;
    const judul = document.getElementById('editJudul').value;
    const isi = document.getElementById('editIsi').value;

    try {
        await fetch(`${API_URL}/notes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ judul, isi })
        });
        hideEdit();
        fetchNotes();
    } catch (err) {
        console.error("Gagal mengupdate catatan:", err);
    }
}

// Fungsi sembunyikan form edit
function hideEdit() {
    document.getElementById('editArea').style.display = 'none';
}

// Fungsi hapus catatan
async function deleteNote(id) {
    if (confirm('Yakin ingin menghapus catatan ini?')) {
        try {
            await fetch(`${API_URL}/notes/${id}`, { method: 'DELETE' });
            fetchNotes();
        } catch (err) {
            console.error("Gagal menghapus catatan:", err);
        }
    }
}

// Panggil saat halaman dibuka
fetchNotes();
