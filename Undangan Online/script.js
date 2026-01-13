// script.js - JavaScript utama untuk semua halaman

// ===== FUNGSI UMUM =====

// Ambil parameter dari URL
function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Format tanggal Indonesia
function formatIndonesianDate(date) {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${dayName}, ${day} ${month} ${year}`;
}

// Tampilkan notifikasi
function showNotification(message, type = 'success') {
    // Hapus notifikasi sebelumnya
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Buat elemen notifikasi
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Tambahkan style notifikasi
    const notificationStyle = document.createElement('style');
    notificationStyle.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#d4edda' : '#f8d7da'};
            color: ${type === 'success' ? '#155724' : '#721c24'};
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            z-index: 10000;
            animation: slideIn 0.3s ease;
            border: 1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'};
            max-width: 400px;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    
    document.head.appendChild(notificationStyle);
    document.body.appendChild(notification);
    
    // Hilangkan setelah 3 detik
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Salin teks ke clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Teks berhasil disalin!', 'success');
    }).catch(err => {
        console.error('Gagal menyalin: ', err);
        showNotification('Gagal menyalin teks', 'error');
    });
}

// ===== INISIALISASI HALAMAN =====

document.addEventListener('DOMContentLoaded', function() {
    // ===== LOGIKA UNTUK INDEX.HTML =====
    if (document.getElementById('guestForm')) {
        initializeIndexPage();
    }
    
    // ===== LOGIKA UNTUK UNDANGAN.HTML =====
    if (document.getElementById('displayGuestName')) {
        initializeUndanganPage();
    }
    
    // ===== LOGIKA UNTUK SURAT AR-RUM.HTML =====
    if (document.getElementById('verseDisplay')) {
        initializeArRumPage();
    }
    
    // ===== LOGIKA UNTUK ADMIN.HTML =====
    if (document.getElementById('adminAddGuest')) {
        initializeAdminPage();
    }
    
    // ===== MUSIK BACKGROUND =====
    initializeBackgroundMusic();
});

// ===== FUNGSI UNTUK INDEX.HTML =====

function initializeIndexPage() {
    // Ambil nama dari URL jika ada
    const namaFromURL = getURLParameter('nama');
    if (namaFromURL && document.getElementById('guestName')) {
        const namaDecoded = decodeURIComponent(namaFromURL);
        document.getElementById('guestName').value = namaDecoded;
        updatePreview();
    }
    
    // Update preview saat input berubah
    const guestNameInput = document.getElementById('guestName');
    if (guestNameInput) {
        guestNameInput.addEventListener('input', updatePreview);
    }
    
    // Handle form submission
    const guestForm = document.getElementById('guestForm');
    if (guestForm) {
        guestForm.addEventListener('submit', function(e) {
            e.preventDefault();
            generateInvitationLink();
        });
    }
    
    // Tombol copy link
    const copyLinkBtn = document.getElementById('copyLinkBtn');
    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', function() {
            const linkInput = document.getElementById('generatedLink');
            if (linkInput && linkInput.value) {
                copyToClipboard(linkInput.value);
            }
        });
    }
    
    // Tombol WhatsApp
    const whatsappBtn = document.getElementById('whatsappBtn');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function() {
            const linkInput = document.getElementById('generatedLink');
            if (linkInput && linkInput.value) {
                const message = `Assalamu'alaikum,\n\nSaya mengundang Anda untuk menghadiri pernikahan saya.\n\nSilakan buka link undangan berikut:\n${linkInput.value}\n\nTerima kasih.`;
                const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
            }
        });
    }
    
    // Tombol buat link baru
    const newLinkBtn = document.getElementById('newLinkBtn');
    if (newLinkBtn) {
        newLinkBtn.addEventListener('click', function() {
            document.getElementById('linkResult').style.display = 'none';
            document.getElementById('guestForm').reset();
            updatePreview();
        });
    }
    
    // Musik toggle untuk index.html
    const homeMusicToggle = document.getElementById('homeMusicToggle');
    if (homeMusicToggle) {
        const homeMusic = document.getElementById('homeMusic');
        const musicStatus = document.getElementById('musicStatus');
        
        // Cek preferensi dari localStorage
        const musicPref = localStorage.getItem('musicPref') || 'off';
        
        if (musicPref === 'on') {
            homeMusic.volume = 0.2;
            homeMusic.play().catch(e => console.log("Autoplay diblokir browser"));
            musicStatus.textContent = 'Musik: ON';
        } else {
            musicStatus.textContent = 'Musik: OFF';
        }
        
        homeMusicToggle.addEventListener('click', function() {
            if (homeMusic.paused) {
                homeMusic.volume = 0.2;
                homeMusic.play();
                musicStatus.textContent = 'Musik: ON';
                localStorage.setItem('musicPref', 'on');
            } else {
                homeMusic.pause();
                musicStatus.textContent = 'Musik: OFF';
                localStorage.setItem('musicPref', 'off');
            }
        });
    }
}

// Update preview nama di index.html
function updatePreview() {
    const guestNameInput = document.getElementById('guestName');
    const previewNameElement = document.getElementById('previewName');
    
    if (guestNameInput && previewNameElement) {
        const name = guestNameInput.value.trim() || "[Nama Tamu]";
        previewNameElement.textContent = name;
    }
}

// Generate link undangan
function generateInvitationLink() {
    const guestName = document.getElementById('guestName').value.trim();
    const guestGroup = document.getElementById('guestGroup').value;
    
    if (!guestName) {
        showNotification('Mohon masukkan nama tamu terlebih dahulu', 'error');
        return;
    }
    
    // Encode nama untuk URL
    const encodedName = encodeURIComponent(guestName);
    const encodedGroup = encodeURIComponent(guestGroup);
    
    // Buat link undangan
    const baseUrl = window.location.origin + window.location.pathname.replace('index.html', 'undangan.html');
    const invitationLink = `${baseUrl}?nama=${encodedName}&grup=${encodedGroup}`;
    
    // Tampilkan link
    const linkResult = document.getElementById('linkResult');
    const generatedLink = document.getElementById('generatedLink');
    
    if (linkResult && generatedLink) {
        generatedLink.value = invitationLink;
        linkResult.style.display = 'block';
        
        // Scroll ke hasil
        linkResult.scrollIntoView({ behavior: 'smooth' });
        
        // Simpan ke riwayat
        saveToGuestHistory(guestName, guestGroup, invitationLink);
        
        showNotification('Link undangan berhasil dibuat!', 'success');
    }
}

// Simpan ke riwayat tamu
function saveToGuestHistory(name, group, link) {
    const guest = {
        id: Date.now(),
        name: name,
        group: group,
        link: link,
        date: new Date().toISOString()
    };
    
    // Ambil riwayat dari localStorage
    let guestHistory = JSON.parse(localStorage.getItem('guestHistory')) || [];
    
    // Tambahkan tamu baru
    guestHistory.push(guest);
    
    // Simpan kembali ke localStorage (maks 50 tamu)
    if (guestHistory.length > 50) {
        guestHistory = guestHistory.slice(-50);
    }
    
    localStorage.setItem('guestHistory', JSON.stringify(guestHistory));
}

// ===== FUNGSI UNTUK UNDANGAN.HTML =====

function initializeUndanganPage() {
    // Ambil nama dari URL atau localStorage
    const namaFromURL = getURLParameter('nama');
    const grupFromURL = getURLParameter('grup');
    
    let displayName = 'Tamu Undangan';
    
    if (namaFromURL) {
        // Jika ada parameter di URL
        displayName = decodeURIComponent(namaFromURL);
        const grupDecoded = decodeURIComponent(grupFromURL || 'tamu');
        
        // Simpan ke localStorage
        localStorage.setItem('guestName', displayName);
        localStorage.setItem('guestGroup', grupDecoded);
        
        // Catat pembukaan undangan
        recordInvitationOpen(displayName, grupDecoded);
    } else {
        // Fallback ke localStorage
        const savedName = localStorage.getItem('guestName');
        if (savedName) {
            displayName = savedName;
        }
    }
    
    // Update tampilan nama
    const displayGuestNameElement = document.getElementById('displayGuestName');
    if (displayGuestNameElement) {
        displayGuestNameElement.textContent = displayName;
    }
    
    // Hitung mundur
    initializeCountdown();
    
    // Handle RSVP
    const submitRsvpBtn = document.getElementById('submitRsvp');
    if (submitRsvpBtn) {
        submitRsvpBtn.addEventListener('click', submitRSVP);
    }
    
    // Tombol peta
    const mapButtons = document.querySelectorAll('.map-btn');
    mapButtons.forEach(button => {
        button.addEventListener('click', function() {
            const location = this.getAttribute('data-location');
            showMapModal(location);
        });
    });
    
    // Tombol copy bank
    const copyBankButtons = document.querySelectorAll('.copy-bank');
    copyBankButtons.forEach(button => {
        button.addEventListener('click', function() {
            const bankInfo = this.getAttribute('data-bank');
            copyToClipboard(bankInfo);
        });
    });
    
    // Tombol copy alamat
    const copyAddressButtons = document.querySelectorAll('.copy-address');
    copyAddressButtons.forEach(button => {
        button.addEventListener('click', function() {
            const address = this.getAttribute('data-address');
            copyToClipboard(address);
        });
    });
    
    // Tombol QR code
    const qrBtn = document.getElementById('qrBtn');
    if (qrBtn) {
        qrBtn.addEventListener('click', showQRCodeModal);
    }
    
    // Tombol share
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', shareInvitation);
    }
    
    // Social share buttons
    initializeSocialShare();
    
    // Modal handlers
    initializeModals();
}

// Catat pembukaan undangan
function recordInvitationOpen(name, group) {
    const record = {
        name: name,
        group: group,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
    };
    
    // Ambil riwayat dari localStorage
    let openHistory = JSON.parse(localStorage.getItem('openHistory')) || [];
    
    // Tambahkan record baru
    openHistory.push(record);
    
    // Simpan kembali ke localStorage (maks 100 record)
    if (openHistory.length > 100) {
        openHistory = openHistory.slice(-100);
    }
    
    localStorage.setItem('openHistory', JSON.stringify(openHistory));
}

// Hitung mundur pernikahan
function initializeCountdown() {
    const weddingDate = new Date('2024-06-15T08:00:00');
    
    function updateCountdown() {
        const now = new Date();
        const timeLeft = weddingDate - now;
        
        if (timeLeft <= 0) {
            // Pernikahan sudah lewat
            document.getElementById('countdown-days').textContent = '00';
            document.getElementById('countdown-hours').textContent = '00';
            document.getElementById('countdown-minutes').textContent = '00';
            document.getElementById('countdown-seconds').textContent = '00';
            return;
        }
        
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        // Update tampilan
        document.getElementById('countdown-days').textContent = days.toString().padStart(2, '0');
        document.getElementById('countdown-hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('countdown-minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('countdown-seconds').textContent = seconds.toString().padStart(2, '0');
    }
    
    // Update setiap detik
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Handle RSVP submission
function submitRSVP() {
    const attendance = document.getElementById('attendance').value;
    const guestCount = document.getElementById('guestCount').value;
    const message = document.getElementById('message').value;
    const guestName = document.getElementById('displayGuestName').textContent;
    
    if (!attendance) {
        showNotification('Mohon pilih konfirmasi kehadiran', 'error');
        return;
    }
    
    // Simpan data RSVP
    const rsvpData = {
        guestName: guestName,
        attendance: attendance,
        guestCount: guestCount,
        message: message,
        timestamp: new Date().toISOString()
    };
    
    // Simpan ke localStorage
    let rsvpHistory = JSON.parse(localStorage.getItem('rsvpHistory')) || [];
    rsvpHistory.push(rsvpData);
    localStorage.setItem('rsvpHistory', JSON.stringify(rsvpHistory));
    
    // Tampilkan pesan sukses
    const rsvpNote = document.getElementById('rsvpNote');
    if (rsvpNote) {
        rsvpNote.textContent = 'Terima kasih! Konfirmasi kehadiran Anda telah berhasil dikirim.';
        rsvpNote.className = 'rsvp-note success';
    }
    
    // Reset form
    document.getElementById('attendance').value = '';
    document.getElementById('guestCount').value = '1';
    document.getElementById('message').value = '';
    
    showNotification('RSVP berhasil dikirim!', 'success');
}

// Tampilkan modal peta
function showMapModal(location) {
    const modal = document.getElementById('mapModal');
    const coordinates = document.getElementById('mapCoordinates');
    
    if (modal && coordinates) {
        coordinates.textContent = `Koordinat: ${location}`;
        modal.style.display = 'block';
    }
}

// Tampilkan modal QR code
function showQRCodeModal() {
    const modal = document.getElementById('qrModal');
    const qrContainer = document.getElementById('qrcode');
    
    if (modal && qrContainer && typeof QRCode !== 'undefined') {
        // Generate QR code untuk URL saat ini
        const currentUrl = window.location.href;
        qrContainer.innerHTML = '';
        
        new QRCode(qrContainer, {
            text: currentUrl,
            width: 200,
            height: 200,
            colorDark: "#5a189a",
            colorLight: "#ffffff"
        });
        
        modal.style.display = 'block';
    }
}

// Share invitation
function shareInvitation() {
    const shareData = {
        title: 'Undangan Pernikahan Sarah & Rizky',
        text: 'Saya mengundang Anda untuk menghadiri pernikahan saya. Silakan buka link berikut:',
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData)
            .then(() => showNotification('Undangan berhasil dibagikan!', 'success'))
            .catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback untuk browser yang tidak support Web Share API
        copyToClipboard(window.location.href);
        showNotification('Link undangan disalin ke clipboard!', 'success');
    }
}

// Inisialisasi tombol share sosial media
function initializeSocialShare() {
    const currentUrl = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('Undangan Pernikahan Sarah & Rizky');
    
    // WhatsApp
    const whatsappButtons = document.querySelectorAll('.whatsapp-share');
    whatsappButtons.forEach(button => {
        button.href = `https://wa.me/?text=${title}%20${currentUrl}`;
    });
    
    // Facebook
    const facebookButtons = document.querySelectorAll('.facebook-share');
    facebookButtons.forEach(button => {
        button.href = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`;
    });
    
    // Twitter
    const twitterButtons = document.querySelectorAll('.twitter-share');
    twitterButtons.forEach(button => {
        button.href = `https://twitter.com/intent/tweet?url=${currentUrl}&text=${title}`;
    });
    
    // Telegram
    const telegramButtons = document.querySelectorAll('.telegram-share');
    telegramButtons.forEach(button => {
        button.href = `https://t.me/share/url?url=${currentUrl}&text=${title}`;
    });
}

// ===== FUNGSI UNTUK SURAT AR-RUM.HTML =====

function initializeArRumPage() {
    // Load ayat-ayat
    loadQuranVerses();
    
    // Handle navigation surah
    const surahButtons = document.querySelectorAll('.surah-btn');
    surahButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            surahButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Load ayat sesuai range
            const verseRange = this.getAttribute('data-verse');
            loadQuranVerses(verseRange);
        });
    });
}

// Load ayat-ayat Al-Quran
function loadQuranVerses(range = '21-25') {
    const verseDisplay = document.getElementById('verseDisplay');
    if (!verseDisplay) return;
    
    // Data ayat (dalam implementasi nyata, ini bisa dari API)
    const verses = {
        '21-25': [
            {
                number: 21,
                arabic: 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ',
                translation: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berfikir.'
            },
            {
                number: 22,
                arabic: 'وَمِنْ آيَاتِهِ خَلْقُ السَّمَاوَاتِ وَالْأَرْضِ وَاخْتِلَافُ أَلْسِنَتِكُمْ وَأَلْوَانِكُمْ ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّلْعَالِمِينَ',
                translation: 'Dan di antara tanda-tanda kekuasaan-Nya ialah menciptakan langit dan bumi dan berlain-lainan bahasamu dan warna kulitmu. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi orang-orang yang mengetahui.'
            },
            {
                number: 23,
                arabic: 'وَمِنْ آيَاتِهِ مَنَامُكُم بِاللَّيْلِ وَالنَّهَارِ وَابْتِغَاؤُكُم مِّن فَضْلِهِ ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَسْمَعُونَ',
                translation: 'Dan di antara tanda-tanda kekuasaan-Nya adalah tidurmu di waktu malam dan siang hari dan usahamu mencari sebagian dari karunia-Nya. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang mendengarkan.'
            }
        ]
    };
    
    // Tampilkan ayat
    let html = '';
    const verseData = verses[range] || verses['21-25'];
    
    verseData.forEach(verse => {
        html += `
            <div class="verse-item">
                <div class="verse-arabic small">
                    ${verse.arabic}
                </div>
                <div class="verse-number small">${verse.number}</div>
                <div class="verse-translation small">
                    "${verse.translation}"
                </div>
            </div>
        `;
    });
    
    verseDisplay.innerHTML = html;
}

// ===== FUNGSI UNTUK ADMIN.HTML =====

function initializeAdminPage() {
    // Load data tamu
    loadGuestData();
    
    // Handle tambah tamu
    const addGuestBtn = document.getElementById('adminAddGuest');
    if (addGuestBtn) {
        addGuestBtn.addEventListener('click', addNewGuest);
    }
    
    // Handle export data
    const exportBtn = document.getElementById('exportGuests');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportGuestData);
    }
    
    // Handle clear all
    const clearBtn = document.getElementById('clearAllGuests');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearAllGuests);
    }
}

// Load data tamu untuk admin
function loadGuestData() {
    // Ambil data dari localStorage
    const guestHistory = JSON.parse(localStorage.getItem('guestHistory')) || [];
    const rsvpHistory = JSON.parse(localStorage.getItem('rsvpHistory')) || [];
    const openHistory = JSON.parse(localStorage.getItem('openHistory')) || [];
    
    // Update statistik
    document.getElementById('totalGuests').textContent = guestHistory.length;
    document.getElementById('totalLinks').textContent = guestHistory.length;
    document.getElementById('totalRsvp').textContent = rsvpHistory.length;
    document.getElementById('totalOpened').textContent = openHistory.length;
    
    // Update tabel
    updateGuestTable(guestHistory, rsvpHistory, openHistory);
}

// Update tabel tamu
function updateGuestTable(guests, rsvps, opens) {
    const tableBody = document.getElementById('guestTableBody');
    if (!tableBody) return;
    
    if (guests.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-table">Belum ada tamu yang ditambahkan</td>
            </tr>
        `;
        return;
    }
    
    let html = '';
    
    guests.forEach((guest, index) => {
        // Cek apakah tamu sudah RSVP
        const hasRSVP = rsvps.some(rsvp => rsvp.guestName === guest.name);
        const rsvpStatus = hasRSVP ? '<span class="rsvp-badge">✓ Sudah</span>' : '<span class="rsvp-badge pending">Belum</span>';
        
        // Cek apakah undangan sudah dibuka
        const wasOpened = opens.some(open => open.name === guest.name);
        const openStatus = wasOpened ? '<i class="fas fa-eye text-success"></i>' : '<i class="fas fa-eye-slash text-muted"></i>';
        
        html += `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${guest.name}</strong><br><small>${guest.group}</small></td>
                <td>${guest.group}</td>
                <td>
                    <div style="max-width: 200px; overflow: hidden; text-overflow: ellipsis;">
                        <small>${guest.link}</small>
                    </div>
                    <button class="btn small-btn" onclick="copyToClipboard('${guest.link}')">
                        <i class="fas fa-copy"></i> Salin
                    </button>
                </td>
                <td>${rsvpStatus}</td>
                <td>
                    <button class="btn small-btn" onclick="sendWhatsApp('${guest.name}', '${guest.link}')">
                        <i class="fab fa-whatsapp"></i> WhatsApp
                    </button>
                    <button class="btn small-btn" onclick="deleteGuest(${guest.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
}

// Tambah tamu baru
function addNewGuest() {
    const name = document.getElementById('adminGuestName').value.trim();
    const group = document.getElementById('adminGuestGroup').value;
    const phone = document.getElementById('adminGuestPhone').value.trim();
    
    if (!name) {
        showNotification('Mohon masukkan nama tamu', 'error');
        return;
    }
    
    // Generate link
    const encodedName = encodeURIComponent(name);
    const encodedGroup = encodeURIComponent(group);
    const baseUrl = window.location.origin + window.location.pathname.replace('admin.html', 'undangan.html');
    const invitationLink = `${baseUrl}?nama=${encodedName}&grup=${encodedGroup}`;
    
    // Simpan ke guest history
    const guest = {
        id: Date.now(),
        name: name,
        group: group,
        phone: phone,
        link: invitationLink,
        date: new Date().toISOString()
    };
    
    let guestHistory = JSON.parse(localStorage.getItem('guestHistory')) || [];
    guestHistory.push(guest);
    localStorage.setItem('guestHistory', JSON.stringify(guestHistory));
    
    // Reset form
    document.getElementById('adminGuestName').value = '';
    document.getElementById('adminGuestPhone').value = '';
    
    // Reload data
    loadGuestData();
    
    showNotification('Tamu berhasil ditambahkan!', 'success');
    
    // Jika ada nomor WhatsApp, tawarkan untuk kirim langsung
    if (phone) {
        setTimeout(() => {
            if (confirm(`Kirim undangan ke ${name} via WhatsApp?`)) {
                sendWhatsApp(name, invitationLink, phone);
            }
        }, 500);
    }
}

// Kirim via WhatsApp
function sendWhatsApp(name, link, phone = '') {
    const message = `Assalamu'alaikum ${name},\n\nSaya mengundang Anda untuk menghadiri pernikahan saya.\n\nSilakan buka link undangan berikut:\n${link}\n\nTerima kasih.`;
    
    let whatsappUrl;
    if (phone) {
        whatsappUrl = `https://wa.me/${phone.replace(/^0/, '62')}?text=${encodeURIComponent(message)}`;
    } else {
        whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    }
    
    window.open(whatsappUrl, '_blank');
}

// Hapus tamu
function deleteGuest(id) {
    if (confirm('Hapus tamu ini dari daftar?')) {
        let guestHistory = JSON.parse(localStorage.getItem('guestHistory')) || [];
        guestHistory = guestHistory.filter(guest => guest.id !== id);
        localStorage.setItem('guestHistory', JSON.stringify(guestHistory));
        loadGuestData();
        showNotification('Tamu berhasil dihapus', 'success');
    }
}

// Export data tamu
function exportGuestData() {
    const guestHistory = JSON.parse(localStorage.getItem('guestHistory')) || [];
    const rsvpHistory = JSON.parse(localStorage.getItem('rsvpHistory')) || [];
    
    if (guestHistory.length === 0) {
        showNotification('Tidak ada data untuk diexport', 'error');
        return;
    }
    
    let csvContent = 'Nama,Grup,Link,RSVP Status,Tanggal Ditambahkan\n';
    
    guestHistory.forEach(guest => {
        const hasRSVP = rsvpHistory.some(rsvp => rsvp.guestName === guest.name);
        const rsvpStatus = hasRSVP ? 'Sudah RSVP' : 'Belum RSVP';
        const date = new Date(guest.date).toLocaleDateString('id-ID');
        
        csvContent += `"${guest.name}","${guest.group}","${guest.link}","${rsvpStatus}","${date}"\n`;
    });
    
    // Buat file dan download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'daftar-tamu-undangan.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Data berhasil diexport!', 'success');
}

// Hapus semua data tamu
function clearAllGuests() {
    if (confirm('Apakah Anda yakin ingin menghapus semua data tamu? Tindakan ini tidak dapat dibatalkan.')) {
        localStorage.removeItem('guestHistory');
        localStorage.removeItem('rsvpHistory');
        localStorage.removeItem('openHistory');
        loadGuestData();
        showNotification('Semua data tamu telah dihapus', 'success');
    }
}

// ===== MUSIK BACKGROUND =====

function initializeBackgroundMusic() {
    const musicToggle = document.getElementById('musicToggle');
    const weddingMusic = document.getElementById('weddingMusic');
    const musicText = document.getElementById('musicText');
    
    if (musicToggle && weddingMusic && musicText) {
        // Cek preferensi dari localStorage
        const musicPref = localStorage.getItem('musicPref') || 'on';
        
        if (musicPref === 'on') {
            weddingMusic.volume = 0.3;
            weddingMusic.play().catch(e => console.log("Autoplay diblokir browser:", e));
            musicText.textContent = 'Musik: ON';
        } else {
            musicText.textContent = 'Musik: OFF';
        }
        
        musicToggle.addEventListener('click', function() {
            if (weddingMusic.paused) {
                weddingMusic.volume = 0.3;
                weddingMusic.play();
                musicText.textContent = 'Musik: ON';
                localStorage.setItem('musicPref', 'on');
            } else {
                weddingMusic.pause();
                musicText.textContent = 'Musik: OFF';
                localStorage.setItem('musicPref', 'off');
            }
        });
    }
}

// ===== MODAL HANDLERS =====

function initializeModals() {
    // Close modal ketika klik X
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Close modal ketika klik di luar
    window.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Close modal dengan ESC key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                modal.style.display = 'none';
            });
        }
    });
}