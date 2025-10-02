// ==========================
// Fungsi kembali ke kalender
// ==========================
function goBack() {
    window.location.href = "index.html";
}

// ==========================
// Fungsi pasaran Jawa
// ==========================
function getPasaranJawa(date) {
    const pasaran = ["Legi", "Pahing", "Pon", "Wage", "Kliwon"];
    const start = new Date(1900, 0, 1);
    const diffDays = Math.floor((date - start) / (1000 * 60 * 60 * 24));
    const index = diffDays % 5;
    return pasaran[index < 0 ? index + 5 : index];
}

// ==========================
// Fungsi render semua catatan
// ==========================
function renderNotes() {
    const noteListContainer = document.getElementById("noteList");
    noteListContainer.innerHTML = ""; // reset

    const notes = [];

    // Ambil semua note dari localStorage
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.endsWith("_note")) {
            const dateKey = key.replace("_note", "");
            const text = localStorage.getItem(key);
            notes.push({ date: dateKey, text });
        }
    }

    // Urutkan berdasarkan tanggal
    notes.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Tampilkan
    if (notes.length === 0) {
        noteListContainer.innerHTML = "<p>Tidak ada catatan.</p>";
    } else {
        notes.forEach(n => {
            const div = document.createElement("div");
            div.classList.add("note-item");

            // Tanggal
            const dateDiv = document.createElement("div");
            dateDiv.classList.add("note-date");
            dateDiv.innerText = n.date;

            // Pasaran Jawa
            const pasaranDiv = document.createElement("div");
            pasaranDiv.classList.add("note-pasaran");
            const [year, month, day] = n.date.split("-");
            pasaranDiv.innerText = getPasaranJawa(new Date(year, month - 1, day));

            // Isi catatan
            const textDiv = document.createElement("div");
            textDiv.classList.add("note-text");
            textDiv.innerText = n.text;

            // Tombol hapus per catatan
            const deleteBtn = document.createElement("button");
            deleteBtn.classList.add("delete-btn");
            deleteBtn.innerText = "Hapus";
            deleteBtn.addEventListener("click", () => {
                if (confirm("Yakin ingin menghapus catatan ini?")) {
                    localStorage.removeItem(n.date + "_note");
                    div.remove();
                }
            });

            // Susun di div utama
            div.appendChild(dateDiv);
            div.appendChild(pasaranDiv);
            div.appendChild(textDiv);
            div.appendChild(deleteBtn);

            noteListContainer.appendChild(div);
        });
    }
}

// ==========================
// Fungsi tambah catatan baru
// ==========================
function setupAddNote() {
    const addNoteBtn = document.getElementById("addNoteBtn");
    addNoteBtn.addEventListener("click", () => {
        const dateInput = document.getElementById("noteDate").value;
        const contentInput = document.getElementById("noteContent").value.trim();

        if (!dateInput) {
            alert("Silakan pilih tanggal!");
            return;
        }
        if (!contentInput) {
            alert("Catatan tidak boleh kosong!");
            return;
        }

        // Simpan ke localStorage
        localStorage.setItem(dateInput + "_note", contentInput);

        // Reset input
        document.getElementById("noteDate").value = "";
        document.getElementById("noteContent").value = "";

        // Refresh daftar catatan
        renderNotes();
    });
}

// ==========================
// Inisialisasi halaman notes
// ==========================
document.addEventListener("DOMContentLoaded", () => {
    renderNotes();   // tampilkan catatan yang ada
    setupAddNote();  // setup tombol tambah catatan
});
