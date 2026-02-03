# 🗑️ Cara Clear Storage untuk Reset Data

## Metode 1: Via Browser DevTools (Paling Mudah)

1. Buka `http://localhost:3000` di browser
2. Tekan **F12** untuk membuka Developer Tools
3. Pergi ke tab **Application** (Chrome) atau **Storage** (Firefox)
4. Di sidebar kiri, cari **Local Storage** → `http://localhost:3000`
5. Klik kanan → **Clear** atau klik item `fire-planner-storage` → Delete
6. **Refresh halaman** (F5 atau Ctrl+R)

## Metode 2: Via Console (Paling Cepat)

1. Buka `http://localhost:3000`
2. Tekan **F12** → Tab **Console**
3. Ketik dan jalankan:
   ```javascript
   localStorage.clear()
   sessionStorage.clear()
   location.reload()
   ```

## Metode 3: Via Browser Settings

**Chrome:**
- Klik ikon 🔒 di address bar
- Pilih **Site Settings**
- Scroll ke bawah → **Clear data**

**Firefox:**
- Klik ikon 🔒 di address bar
- **Clear Cookies and Site Data**

---

## ⚡ Setelah Clear Storage:

1. Login ulang ke aplikasi
2. Pergi ke `/planner`
3. Isi form dengan data baru (umur 65, dll)
4. Klik "Jalankan Simulasi"
5. Cek hasilnya di `/results`

Data seharusnya sudah dinamis sekarang! 🎉
