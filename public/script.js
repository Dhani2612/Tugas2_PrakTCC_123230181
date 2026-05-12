const noteForm = document.getElementById('noteForm');
const notesList = document.getElementById('notesList');
const submitBtn = document.querySelector('#noteForm button');
let currentEditId = null;

const API_URL = 'http://localhost:3000';

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

// Fungsi edit catatan (menyiapkan form)
function editNote(id, judul, isi) {
    document.getElementById('judul').value = judul;
    document.getElementById('isi').value = isi;
    currentEditId = id;
    submitBtn.textContent = "Update Catatan";
    submitBtn.style.backgroundColor = "#f59e0b"; // Ubah warna jadi peringatan
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll ke form
}

// Fungsi simpan atau update catatan
noteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const judul = document.getElementById('judul').value;
    const isi = document.getElementById('isi').value;

    try {
        if (currentEditId) {
            // Update (PUT)
            await fetch(`${API_URL}/notes/${currentEditId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ judul, isi })
            });
            currentEditId = null;
            submitBtn.textContent = "Simpan Catatan";
            submitBtn.style.backgroundColor = ""; // Kembalikan ke warna asli
        } else {
            // Create (POST)
            await fetch(`${API_URL}/notes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ judul, isi })
            });
        }
        noteForm.reset();
        fetchNotes();
    } catch (err) {
        console.error("Gagal menyimpan catatan:", err);
    }
});

// Fungsi hapus
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

fetchNotes(); // Panggil saat halaman dibuka