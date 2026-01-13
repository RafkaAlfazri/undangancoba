// admin.js - JavaScript khusus untuk halaman admin

// Inisialisasi halaman admin
document.addEventListener('DOMContentLoaded', function() {
    // Load data tamu
    loadGuestData();
    
    // Setup event listeners
    setupEventListeners();
    
    // Update statistik
    updateStatistics();
});

// Load data tamu
function loadGuestData() {
    const guestHistory = JSON.parse(localStorage.getItem('guestHistory')) || [];
    const rsvpHistory = JSON.parse(localStorage.getItem('rsvpHistory')) || [];
    const openHistory = JSON.parse(localStorage.getItem('openHistory')) || [];
    
    updateGuestTable(guestHistory, rsvpHistory, openHistory);
}

// Setup event listeners
function setupEventListeners() {
    // Tambah tamu
    const addGuestBtn = document.getElementById('adminAddGuest');
    if (addGuestBtn) {
        addGuestBtn.addEventListener('click', addNewGuest);
    }
    
    // Export data
    const exportBtn = document.getElementById('exportGuests');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportGuestData);
    }
    
    // Hapus semua data
    const clearBtn = document.getElementById('clearAllGuests');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearAllGuests);
    }
    
    // Quick actions
    document.addEventListener('click', function(e) {
        // Kirim WhatsApp
        if (e.target.closest('.whatsapp-btn')) {
            const row = e.target.closest('tr');
            const name = row.querySelector('td:nth-child(2) strong').textContent;
            const link = row.querySelector('td:nth-child(4) small').textContent;
            sendWhatsAppMessage(name, link);
        }
        
        // Salin link
        if (e.target.closest('.copy-link-btn')) {
            const row = e.target.closest('tr');
            const link = row.querySelector('td:nth-child(4) small').textContent;
            copyToClipboard(link);
        }
        
        // Hapus tamu
        if (e.target.closest('.delete-guest-btn')) {
            const row = e.target.closest('tr');
            const guestId = row.dataset.guestId;
            deleteGuest(guestId);
        }
    });
}

// Update tabel tamu
function updateGuestTable(guests, rsvps, opens) {
    const tableBody = document.getElementById('guestTableBody');
    if (!tableBody) return;
    
    if (guests.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-table">
                    <div style="text-align: center; padding: 40px;">
                        <i class="fas fa-users" style="font-size: 3rem; color: #ddd; margin-bottom: 15px;"></i>
                        <p>Belum ada tamu yang ditambahkan</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    let html = '';
    
    guests.forEach((guest, index) => {
        // Cek RSVP status
        const hasRSVP = rsvps.some(rsvp => rsvp.guestName === guest.name);
        const rsvpStatus = hasRSVP ? 
            '<span class="badge badge-success">Sudah RSVP</span>' : 
            '<span class="badge badge-secondary">Belum RSVP</span>';
        
        // Cek open status
        const wasOpened = opens.some(open => open.name === guest.name);
        const openStatus = wasOpened ? 
            '<i class="fas fa-eye text-success" title="Sudah dibuka"></i>' : 
            '<i class="fas fa-eye-slash text-muted" title="Belum dibuka"></i>';
        
        // Format tanggal
        const date = new Date(guest.date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
        
        html += `
            <tr data-guest-id="${guest.id}">
                <td>${index + 1}</td>
                <td>
                    <strong>${guest.name}</strong><br>
                    <small class="text-muted">${guest.group}</small>
                </td>
                <td>
                    <span class="badge badge-${guest.group === 'keluarga' ? 'primary' : 
                                          guest.group === 'teman' ? 'success' : 
                                          guest.group === 'rekan' ? 'warning' : 'secondary'}">
                        ${guest.group}
                    </span>
                </td>
                <td>
                    <div class="link-cell">
                        <small>${guest.link}</small><br>
                        <button class="btn btn-sm copy-link-btn">
                            <i class="fas fa-copy"></i> Salin Link
                        </button>
                    </div>
                </td>
                <td>
                    ${rsvpStatus}<br>
                    <small>${openStatus}</small>
                </td>
                <td>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-success whatsapp-btn" title="Kirim WhatsApp">
                            <i class="fab fa-whatsapp"></i>
                        </button>
                        <button class="btn btn-sm btn-danger delete-guest-btn" title="Hapus">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
}

// Update statistik
function updateStatistics() {
    const guestHistory = JSON.parse(localStorage.getItem('guestHistory')) || [];
    const rsvpHistory = JSON.parse(localStorage.getItem('rsvpHistory')) || [];
    const openHistory = JSON.parse(localStorage.getItem('openHistory')) || [];
    
    document.getElementById('totalGuests').textContent = guestHistory.length;
    document.getElementById('totalRsvp').textContent = rsvpHistory.length;
    document.getElementById('totalLinks').textContent = guestHistory.length;
    document.getElementById('totalOpened').textContent = openHistory.length;
}

// Tambah tamu baru
function addNewGuest() {
    const nameInput = document.getElementById('adminGuestName');
    const groupInput = document.getElementById('adminGuestGroup');
    const phoneInput = document.getElementById('adminGuestPhone');
    
    const name = nameInput.value.trim();
    const group = groupInput.value;
    const phone = phoneInput.value.trim();
    
    if (!name) {
        alert('Mohon masukkan nama tamu');
        nameInput.focus();
        return;
    }
    
    // Generate link undangan
    const baseUrl = window.location.origin + window.location.pathname.replace('admin.html', 'undangan.html');
    const encodedName = encodeURIComponent(name);
    const encodedGroup = encodeURIComponent(group);
    const invitationLink = `${baseUrl}?nama=${encodedName}&grup=${encodedGroup}`;
    
    // Buat objek tamu
    const guest = {
        id: Date.now(),
        name: name,
        group: group,
        phone: phone,
        link: invitationLink,
        date: new Date().toISOString()
    };
    
    // Simpan ke localStorage
    let guestHistory = JSON.parse(localStorage.getItem('guestHistory')) || [];
    guestHistory.push(guest);
    localStorage.setItem('guestHistory', JSON.stringify(guestHistory));
    
    // Reset form
    nameInput.value = '';
    phoneInput.value = '';
    nameInput.focus();
    
    // Update tampilan
    loadGuestData();
    updateStatistics();
    
    // Tampilkan konfirmasi
    showAdminNotification('Tamu berhasil ditambahkan!', 'success');
    
    // Tawarkan kirim WhatsApp jika ada nomor
    if (phone) {
        setTimeout(() => {
            if (confirm(`Kirim undangan ke ${name} via WhatsApp?`)) {
                sendWhatsAppMessage(name, invitationLink, phone);
            }
        }, 500);
    }
}

// Kirim pesan WhatsApp
function sendWhatsAppMessage(name, link, phone = '') {
    const message = `Assalamu'alaikum ${name},\n\nSaya mengundang Anda untuk menghadiri pernikahan saya.\n\nSilakan buka link undangan berikut:\n${link}\n\nTerima kasih.`;
    
    let whatsappUrl;
    if (phone) {
        // Format nomor untuk WhatsApp (62 untuk Indonesia)
        const formattedPhone = phone.replace(/^0/, '62').replace(/[^0-9]/g, '');
        whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    } else {
        whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    }
    
    window.open(whatsappUrl, '_blank');
}

// Hapus tamu
function deleteGuest(guestId) {
    if (!confirm('Hapus tamu ini dari daftar?')) return;
    
    let guestHistory = JSON.parse(localStorage.getItem('guestHistory')) || [];
    guestHistory = guestHistory.filter(guest => guest.id.toString() !== guestId.toString());
    
    localStorage.setItem('guestHistory', JSON.stringify(guestHistory));
    loadGuestData();
    updateStatistics();
    
    showAdminNotification('Tamu berhasil dihapus', 'success');
}

// Export data ke CSV
function exportGuestData() {
    const guestHistory = JSON.parse(localStorage.getItem('guestHistory')) || [];
    const rsvpHistory = JSON.parse(localStorage.getItem('rsvpHistory')) || [];
    
    if (guestHistory.length === 0) {
        showAdminNotification('Tidak ada data untuk diexport', 'error');
        return;
    }
    
    let csvContent = 'No,Nama Tamu,Grup,No. WhatsApp,Link Undangan,Tanggal Ditambahkan,Status RSVP\n';
    
    guestHistory.forEach((guest, index) => {
        const hasRSVP = rsvpHistory.some(rsvp => rsvp.guestName === guest.name);
        const rsvpStatus = hasRSVP ? 'Sudah RSVP' : 'Belum RSVP';
        const date = new Date(guest.date).toLocaleDateString('id-ID');
        
        csvContent += `${index + 1},"${guest.name}","${guest.group}","${guest.phone || '-'}","${guest.link}","${date}","${rsvpStatus}"\n`;
    });
    
    // Buat blob dan download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.setAttribute('download', `daftar-tamu-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showAdminNotification('Data berhasil diexport!', 'success');
}

// Hapus semua data
function clearAllGuests() {
    if (!confirm('Apakah Anda yakin ingin menghapus SEMUA data tamu? Tindakan ini tidak dapat dibatalkan!')) {
        return;
    }
    
    localStorage.removeItem('guestHistory');
    localStorage.removeItem('rsvpHistory');
    localStorage.removeItem('openHistory');
    
    loadGuestData();
    updateStatistics();
    
    showAdminNotification('Semua data tamu telah dihapus', 'success');
}

// Salin teks ke clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showAdminNotification('Teks berhasil disalin!', 'success');
    }).catch(err => {
        console.error('Gagal menyalin: ', err);
        showAdminNotification('Gagal menyalin teks', 'error');
    });
}

// Tampilkan notifikasi di admin
function showAdminNotification(message, type = 'success') {
    // Hapus notifikasi sebelumnya
    const existingNotification = document.querySelector('.admin-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Buat notifikasi baru
    const notification = document.createElement('div');
    notification.className = `admin-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Tambahkan style
    const style = document.createElement('style');
    style.textContent = `
        .admin-notification {
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
        
        .admin-notification .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    // Hilangkan setelah 3 detik
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Fungsi helper untuk badges
function initializeBadges() {
    const badgeStyle = document.createElement('style');
    badgeStyle.textContent = `
        .badge {
            display: inline-block;
            padding: 4px 8px;
            font-size: 0.75rem;
            font-weight: 600;
            line-height: 1;
            text-align: center;
            white-space: nowrap;
            vertical-align: baseline;
            border-radius: 0.25rem;
        }
        
        .badge-primary {
            background-color: #9d4edd;
            color: white;
        }
        
        .badge-success {
            background-color: #28a745;
            color: white;
        }
        
        .badge-warning {
            background-color: #ffc107;
            color: #212529;
        }
        
        .badge-secondary {
            background-color: #6c757d;
            color: white;
        }
        
        .btn-group {
            display: flex;
            gap: 5px;
        }
        
        .btn {
            padding: 0.375rem 0.75rem;
            font-size: 0.875rem;
            border-radius: 0.25rem;
            border: 1px solid transparent;
            cursor: pointer;
        }
        
        .btn-sm {
            padding: 0.25rem 0.5rem;
            font-size: 0.75rem;
        }
        
        .btn-success {
            background-color: #28a745;
            color: white;
            border-color: #28a745;
        }
        
        .btn-danger {
            background-color: #dc3545;
            color: white;
            border-color: #dc3545;
        }
        
        .btn:hover {
            opacity: 0.9;
        }
        
        .link-cell {
            max-width: 300px;
            word-break: break-all;
        }
        
        .text-muted {
            color: #6c757d !important;
        }
    `;
    
    document.head.appendChild(badgeStyle);
}

// Inisialisasi badges saat halaman dimuat
initializeBadges();