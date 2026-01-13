// generator.js - Generator nama contoh untuk tamu undangan

// Data nama untuk generator
const nameGenerator = {
    // Gelar depan
    titles: [
        "Bapak", "Ibu", "Saudara", "Saudari", 
        "Pak", "Bu", "Mas", "Mbak", 
        "Om", "Tante", "Kakak", "Adik"
    ],
    
    // Nama depan
    firstNames: [
        "Ahmad", "Siti", "Budi", "Dewi", "Joko", "Ani", 
        "Rudi", "Maya", "Hendra", "Rina", "Eko", "Sari", 
        "Agus", "Lina", "Wawan", "Dini", "Imam", "Nina", 
        "Fajar", "Rini", "Irfan", "Diana", "Hadi", "Mila", 
        "Rizky", "Nurul", "Arief", "Wulan", "Dodi", "Intan", 
        "Rama", "Fitri", "Ali", "Rahma", "Dedi", "Siska", 
        "Yudi", "Mira", "Feri", "Rani", "Adi", "Susi"
    ],
    
    // Nama belakang
    lastNames: [
        "Santoso", "Wijaya", "Susanto", "Pratiwi", "Kurniawan", 
        "Hidayat", "Setiawan", "Wulandari", "Prabowo", "Sari", 
        "Gunawan", "Lestari", "Saputra", "Anggraini", "Nugroho", 
        "Purnama", "Yulianto", "Kusuma", "Putra", "Wati", 
        "Ramadhan", "Suryani", "Maulana", "Hartati", "Siregar", 
        "Halim", "Utami", "Firmansyah", "Dewantara", "Handayani"
    ],
    
    // Kelompok
    groups: ["keluarga", "teman", "rekan", "lainnya"],
    
    // Generate nama acak lengkap
    generateRandomName: function() {
        const title = this.titles[Math.floor(Math.random() * this.titles.length)];
        const firstName = this.firstNames[Math.floor(Math.random() * this.firstNames.length)];
        const lastName = this.lastNames[Math.floor(Math.random() * this.lastNames.length)];
        
        // 70% pakai nama belakang, 30% tidak
        const useLastName = Math.random() < 0.7;
        
        return useLastName 
            ? `${title} ${firstName} ${lastName}`
            : `${title} ${firstName}`;
    },
    
    // Generate kelompok acak
    generateRandomGroup: function() {
        return this.groups[Math.floor(Math.random() * this.groups.length)];
    },
    
    // Generate beberapa contoh nama
    generateSampleNames: function(count = 3) {
        const names = [];
        for (let i = 0; i < count; i++) {
            names.push(this.generateRandomName());
        }
        return names.join(', ');
    },
    
    // Generate data tamu lengkap
    generateGuestData: function() {
        return {
            name: this.generateRandomName(),
            group: this.generateRandomGroup()
        };
    }
};

// Inisialisasi generator
document.addEventListener('DOMContentLoaded', function() {
    // Update contoh nama saat halaman dimuat
    updateNameSamples();
    
    // Event listener untuk tombol generate
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
        generateBtn.addEventListener('click', generateGuestName);
    }
    
    // Event listener untuk refresh contoh nama
    const refreshNamesBtn = document.getElementById('refreshNames');
    if (refreshNamesBtn) {
        refreshNamesBtn.addEventListener('click', updateNameSamples);
    }
});

// Update contoh nama di halaman
function updateNameSamples() {
    const nameSamplesElement = document.getElementById('nameSamples');
    if (nameSamplesElement) {
        nameSamplesElement.textContent = nameGenerator.generateSampleNames(3);
    }
}

// Generate nama tamu dan isi form
function generateGuestName() {
    const guestNameInput = document.getElementById('guestName');
    const guestGroupSelect = document.getElementById('guestGroup');
    
    if (guestNameInput) {
        const guestData = nameGenerator.generateGuestData();
        guestNameInput.value = guestData.name;
        
        if (guestGroupSelect) {
            // Set group value
            guestGroupSelect.value = guestData.group;
        }
        
        // Update preview
        if (typeof updatePreview === 'function') {
            updatePreview();
        }
        
        // Beri feedback
        showGeneratedFeedback(guestData.name);
    }
}

// Tampilkan feedback setelah generate
function showGeneratedFeedback(name) {
    // Buat elemen feedback sementara
    const feedback = document.createElement('div');
    feedback.className = 'generated-feedback';
    feedback.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: #9d4edd;
            color: white;
            padding: 10px 15px;
            border-radius: 8px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        ">
            <i class="fas fa-magic"></i> Nama berhasil digenerate: <strong>${name}</strong>
        </div>
    `;
    
    // Tambahkan style
    const style = document.createElement('style');
    style.textContent = `
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
    document.body.appendChild(feedback);
    
    // Hapus setelah 2 detik
    setTimeout(() => {
        feedback.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => feedback.remove(), 300);
    }, 2000);
}

// Fungsi untuk showNotification (fallback jika tidak ada di script.js)
if (typeof showNotification === 'undefined') {
    function showNotification(message, type = 'success') {
        console.log(`${type.toUpperCase()}: ${message}`);
    }
}