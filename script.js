// ====================
// GLOBAL VARIABLES
// ====================
const calendar = document.getElementById("calendar");
const monthYear = document.getElementById("monthYear");
let current = new Date();

// ====================
// FUNGSI HITUNG PASARAN JAWA
// ====================
function getPasaranJawa(date) {
    const pasaran = ["Legi", "Pahing", "Pon", "Wage", "Kliwon"];
    const start = new Date(1900, 0, 1); // 1 Jan 1900 dianggap Legi
    const diffDays = Math.floor((date - start) / (1000 * 60 * 60 * 24));
    const index = diffDays % 5;
    return pasaran[index < 0 ? index + 5 : index];
}

// ====================
// FUNGSI RENDER CALENDAR
// ====================
function renderCalendar(date) {
    calendar.innerHTML = ""; // reset
    const year = date.getFullYear();
    const month = date.getMonth();
    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    monthYear.innerText = `${monthNames[month]} ${year}`;

    // Hari nama di atas kalender
    renderDayNames();

    // Hitung tanggal
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const prevLastDate = new Date(year, month, 0).getDate();

    renderPrevMonthDays(firstDay, prevLastDate, year, month);
    renderCurrentMonthDays(lastDate, year, month);
    renderNextMonthDays(firstDay, lastDate, year, month);
}

// ====================
// FUNGSI RENDER HARI NAMA
// ====================
function renderDayNames() {
    const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    dayNames.forEach(d => {
        const div = document.createElement("div");
        div.classList.add("day-name");
        div.innerText = d;
        calendar.appendChild(div);
    });
}

// ====================
// FUNGSI RENDER TANGGAL BULAN SEBELUMNYA
// ====================
function renderPrevMonthDays(firstDay, prevLastDate, year, month) {
    for (let i = firstDay - 1; i >= 0; i--) {
        const prevDate = prevLastDate - i;
        const prevDateObj = new Date(year, month - 1, prevDate);
        const dayOfWeek = prevDateObj.getDay();

        const div = document.createElement("div");
        div.classList.add("day", "prev-month");
        if (dayOfWeek === 0) div.classList.add("sunday");

        const span = document.createElement("span");
        span.classList.add("date-number");
        span.innerText = prevDate;
        div.appendChild(span);

        calendar.appendChild(div);
    }
}

// ====================
// FUNGSI RENDER TANGGAL BULAN INI
// ====================
function renderCurrentMonthDays(lastDate, year, month) {
    for (let day = 1; day <= lastDate; day++) {
        const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const div = document.createElement("div");
        div.classList.add("day");
        div.style.position = "relative";

        // Angka tanggal
        const span = document.createElement("span");
        span.classList.add("date-number");
        span.innerText = day;
        div.appendChild(span);

        // Checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = localStorage.getItem(dateKey) === "true";
        checkbox.title = checkbox.checked ? "Sudah dicentang ✅" : "Belum dicentang";
        checkbox.addEventListener("change", () => {
            localStorage.setItem(dateKey, checkbox.checked);
            checkbox.title = checkbox.checked ? "Sudah dicentang ✅" : "Belum dicentang";
        });
        div.appendChild(checkbox);

        // Nama pasaran Jawa
        const pasaranSpan = document.createElement("div");
        pasaranSpan.classList.add("pasaran");
        pasaranSpan.innerText = getPasaranJawa(new Date(year, month, day));
        div.appendChild(pasaranSpan);

        // Indikator catatan
        if (localStorage.getItem(dateKey + "_note")) {
            const indicator = document.createElement("div");
            indicator.classList.add("note-indicator");
            div.appendChild(indicator);
        }

        // Tandai hari ini
        const today = new Date();
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            div.classList.add("today");
        }

        // Tandai Minggu
        const dayOfWeek = new Date(year, month, day).getDay();
        if (dayOfWeek === 0) div.classList.add("sunday");

        // Klik tanggal → notes.html
        div.addEventListener("click", () => {
            localStorage.setItem('selectedDate', dateKey);
            window.location.href = 'notes.html';
        });

        calendar.appendChild(div);
    }
}

// ====================
// FUNGSI RENDER TANGGAL BULAN BERIKUTNYA
// ====================
function renderNextMonthDays(firstDay, lastDate, year, month) {
    const totalBoxes = firstDay + lastDate;
    const nextDays = (7 - (totalBoxes % 7)) % 7;
    for (let i = 1; i <= nextDays; i++) {
        const nextDateObj = new Date(year, month + 1, i);
        const dayOfWeek = nextDateObj.getDay();

        const div = document.createElement("div");
        div.classList.add("day", "next-month");
        if (dayOfWeek === 0) div.classList.add("sunday");

        const span = document.createElement("span");
        span.classList.add("date-number");
        span.innerText = i;
        div.appendChild(span);

        calendar.appendChild(div);
    }
}

// ====================
// NAVIGATION FUNCTION
// ====================
function prevMonth() {
    current.setMonth(current.getMonth() - 1);
    renderCalendar(current);
}
function nextMonth() {
    current.setMonth(current.getMonth() + 1);
    renderCalendar(current);
}
function goToToday() {
    current = new Date();
    renderCalendar(current);
}
function resetMonth() {
    if (confirm("Yakin ingin menghapus semua checklist dan catatan bulan ini?")) {
        const year = current.getFullYear();
        const month = current.getMonth();
        const lastDate = new Date(year, month + 1, 0).getDate();
        for (let day = 1; day <= lastDate; day++) {
            const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            localStorage.removeItem(key);
            localStorage.removeItem(key + "_note");
        }
        renderCalendar(current);
    }
}

// ====================
// ANIMASI PARTICLE (HOME PAGE)
// ====================
function animateParticles() {
    const particles = document.querySelectorAll('.particle');
    particles.forEach((particle) => {
        const randomDelay = Math.random() * 2000;
        const randomDuration = 3000 + Math.random() * 2000;
        setTimeout(() => {
            particle.style.animationDuration = `${randomDuration}ms`;
        }, randomDelay);
    });
}

// ====================
// LOADER & INIT
// ====================
window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    if (loader) {
        loader.style.opacity = "0";
        setTimeout(() => loader.remove(), 300);
    }
    document.body.classList.add("loaded");
});

// Initialize calendar
document.addEventListener("DOMContentLoaded", () => renderCalendar(current));

function initBurgerMenu() {
  const menuToggle = document.querySelector(".menu-toggle");
  const sidebar = document.getElementById("sidebarMenu");
  const overlay = document.getElementById("overlay");
  const closeBtn = sidebar.querySelector(".close-btn");

  // buka menu
  function openMenu() {
    sidebar.classList.add("show");
    overlay.classList.add("show");
  }

  // tutup menu
  function closeMenu() {
    sidebar.classList.remove("show");
    overlay.classList.remove("show");
  }

  // Event listeners
  menuToggle.addEventListener("click", openMenu);
  closeBtn.addEventListener("click", closeMenu);
  overlay.addEventListener("click", closeMenu);
}

// panggil fungsi setelah DOM siap
document.addEventListener("DOMContentLoaded", () => {
  renderCalendar(current); // fungsi lama tetap ada
  initBurgerMenu();        // fungsi baru untuk burger menu
});

