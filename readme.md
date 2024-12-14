
# TECH STACK - SIGAP SI POLES (Non Updated)

## ARSITEKTUR SISTEM:

- **Client - Server**

---

### DATABASE & STORAGE:

- **PostgreSQL**: Relational database yang andal, open-source, dan scalable, cocok untuk aplikasi enterprise.  
  **Versi Stabil**: 15.4
- **Cloudinary**: Layanan cloud untuk penyimpanan dan pengelolaan media seperti gambar dan video. Mendukung optimisasi dan CDN.  
  **Versi Stabil**: 1.41.3

---

### THIRD PARTY API:

- **Google Maps API for JavaScript**: API untuk mendapatkan data lokasi seperti nama tempat dari koordinat longitude dan latitude.  
  **Versi Stabil**: Selalu diperbarui dengan versi terbaru melalui Google Cloud Console.
- **Cloudinary**: Penyimpanan dan pengelolaan media di cloud, termasuk gambar dan video.  
  **Versi Stabil**: 1.41.3

---

### SERVER SIDE:

- **NodeJS**: Runtime environment JavaScript untuk menjalankan aplikasi server-side.  
  **Versi Stabil**: 20.11.1
- **ExpressJS**: Framework HTTP untuk Node.js, digunakan untuk membangun API dan server web.  
  **Versi Stabil**: 4.19.2
- **Morgan**: Middleware untuk logging HTTP request di server, membantu memantau aktivitas server.  
  **Versi Stabil**: 1.10.0
- **CORS**: Middleware untuk mengizinkan request lintas domain, terutama berguna dalam aplikasi berbasis web.  
  **Versi Stabil**: 2.8.5
- **JsonWebToken (JWT)**: Digunakan untuk otentikasi dan otorisasi menggunakan token yang aman dan dapat diverifikasi.  
  **Versi Stabil**: 9.0.2
- **NodeCache**: Library untuk caching di memori, digunakan untuk menyimpan data sementara agar server lebih cepat.  
  **Versi Stabil**: 5.1.2
- **Axios**: HTTP client untuk melakukan request API, mendukung promise dan async/await.  
  **Versi Stabil**: 1.7.2
- **Prisma and Prisma Client**: ORM modern yang memudahkan interaksi dengan database, mendukung PostgreSQL, MySQL, dan lainnya.  
  **Versi Stabil**: 5.17.0
- **Bcrypt**: Library untuk hashing password, memberikan keamanan tambahan dengan mengenkripsi password sebelum disimpan.  
  **Versi Stabil**: 5.1.1
- **Cloudinary**: Platform untuk mengelola dan menyimpan file media seperti gambar dan video.  
  **Versi Stabil**: 1.41.3
- **Multer**: Middleware untuk mengelola upload file dalam aplikasi berbasis Express.  
  **Versi Stabil**: 1.4.5-lts.1
- **Multer Storage Cloudinary**: Plugin Multer untuk langsung mengunggah file ke Cloudinary.  
  **Versi Stabil**: 4.0.0

---

### CLIENT SIDE (Mobile - Kotlin):

- **API SDK**: Android SDK untuk pengembangan aplikasi mobile, API level 28 (Android 9).  
  **Versi Stabil**: 28
- **Kotlin**: Bahasa pemrograman modern yang dioptimalkan untuk pengembangan Android.  
  **Versi Stabil**: 1.9.0
- **Retrofit**: Library HTTP client untuk komunikasi REST API, memudahkan parsing JSON dan XML.  
  **Versi Stabil**: 2.9.0
- **Google Play Services Location**: Layanan dari Google untuk mendapatkan lokasi perangkat secara akurat.  
  **Versi Stabil**: 21.0.1
- **MLKit**: Library dari Google untuk mendukung machine learning on-device, termasuk barcode scanning dan text recognition.  
  **Versi Stabil**: 17.0.2
- **SharedPreferences**: API untuk menyimpan data sederhana (key-value) di lokal secara permanen di perangkat Android.
- **Room (SQLite)**: Library ORM untuk pengelolaan database lokal SQLite di Android, mendukung query SQL dan migrasi database.  
  **Versi Stabil**: 2.5.0

---

### CLIENT SIDE (Website):

- **Framework**: NextJS 14 Pages Router  
  **Versi Stabil**: 14
- **React**: Library JavaScript untuk membangun user interface yang interaktif dan modular.  
  **Versi Stabil**: 18.2.0
- **React-DOM**: Komponen untuk menghubungkan React ke DOM di browser.  
  **Versi Stabil**: 18.2.0
- **React-Icons**: Paket ikon siap pakai yang terintegrasi dengan React.  
  **Versi Stabil**: 4.10.1
- **TailwindCSS**: Framework CSS yang utility-first untuk membangun UI yang responsif dan customisable.  
  **Versi Stabil**: 3.3.2
- **TypeScript**: Superset dari JavaScript yang menambahkan tipe statis, membantu mencegah bug selama pengembangan.  
  **Versi Stabil**: 5.3.0
- **Axios**: HTTP client untuk melakukan request API, mendukung promise dan async/await. Sama seperti di mobile, digunakan untuk komunikasi dengan backend.  
  **Versi Stabil**: 1.7.2

---

### CLIENT SIDE (Mobile - React Native Expo with TypeScript):

- **React Native Expo**: Framework untuk membangun aplikasi mobile dengan JavaScript dan React melalui Expo, mempermudah akses ke API perangkat seperti kamera, lokasi, dan file system.  
  **Versi Stabil**: 49.0.0
- **Expo Location**: Modul Expo untuk mendapatkan lokasi (longitude dan latitude) pengguna.  
  **Versi Stabil**: 14.0.0
- **Expo ImagePicker**: Modul Expo untuk memilih gambar dari galeri perangkat atau kamera untuk diupload ke API.  
  **Versi Stabil**: 14.0.2
- **Expo FileSystem**: Digunakan untuk mengelola file di perangkat, seperti mengupload gambar ke server.  
  **Versi Stabil**: 15.1.1
- **Expo BarcodeScanner**: Modul untuk scanning barcode menggunakan kamera perangkat.  
  **Versi Stabil**: 12.3.1
- **AsyncStorage**: Penyimpanan data sederhana (key-value), seperti menyimpan token JWT secara lokal di perangkat.  
  **Versi Stabil**: 1.17.11
- **Axios**: HTTP client untuk melakukan request API dan mengelola komunikasi antara client dan server.  
  **Versi Stabil**: 1.7.2
- **TypeScript**: Superset JavaScript dengan dukungan tipe statis untuk mempermudah pengembangan dan deteksi bug.  
  **Versi Stabil**: 5.3.0

---

## API RULES:

### URL API DESIGN:

- **Format URL**: Ditulis dalam format kebab-case.
- **Metode HTTP**: Mendukung GET, POST, PUT, DELETE.
- **Authorization**: Menggunakan **Bearer Token** (JWT) di header request.

#### Contoh:

```
GET /v1/pengiriman-tiang
Headers: Authorization: Bearer <token>
```

---

### API RESPONSE FORMAT:

1. **Response dengan Pagination**:

   ```json
   {
     "status": 200,
     "message": "Data Barang",
     "pagination": {
       "currentPage": 1,
       "currentData": 10,
       "totalPage": 4,
       "totalData": 36
     },
     "data": [...]
   }
   ```

2. **Response dengan Limit**:

   ```json
   {
     "status": 200,
     "message": "Data Barang",
     "limitation": {
       "currentData": 10,
       "totalData": 36
     },
     "data": [...]
   }
   ```

3. **Response Gagal**:

   ```json
   {
     "status": 4xx / 5xx,
     "message": "Kesalahan Deskripsi"
   }
   ```

4. **Response untuk Satu Data (Detail Barang)**:
   - Data dikirimkan sebagai objek, bukan array.
   ```json
   {
     "status": 200,
     "message": "Detail Barang",
     "data": { ... }
   }
   ```



---

## Git Commit

### Format Pesan Commit

Gunakan format berikut untuk pesan commit:

```
<type>: <subject>
```

#### Contoh:

```
feat: tambahkan fitur halaman login
fix: perbaiki bug pada form registrasi
```

### Jenis Commit (Type)

- **feat**: Menambahkan fitur baru
- **fix**: Memperbaiki bug
- **docs**: Perubahan pada dokumentasi
- **style**: Perubahan terkait tampilan atau format kode (tanpa mempengaruhi fungsionalitas)
- **refactor**: Refaktor kode yang tidak mengubah fungsionalitas
- **chore**: Perubahan non-kode (misalnya, pembaruan dependensi atau konfigurasi build)

### Aturan Penulisan Judul (Subject)

- Judul commit harus singkat dan jelas.
- Maksimum 50 karakter.
- Jelaskan apa yang berubah dalam bentuk imperatif (misalnya, "tambah fitur", "perbaiki bug").
- Tidak perlu menambahkan titik di akhir judul.

---

### Contoh Pesan Commit

1. **Menambahkan Fitur**:

   ```
   feat: tambahkan halaman profil pengguna
   ```

2. **Memperbaiki Bug**:

   ```
   fix: perbaiki error validasi form email
   ```

3. **Memperbarui Dokumentasi**:

   ```
   docs: perbarui instruksi instalasi di README
   ```

4. **Refactoring**:
   ```
   refactor: optimalkan fungsi pengambilan data pengguna
   ```

--- 

### Note

- **Jaga agar Commit Kecil dan Fokus**: Setiap commit harus fokus pada satu perubahan atau perbaikan.
- **Periksa Commit Sebelum Push**: Lihat perubahan yang kamu commit dengan `git diff` sebelum melakukan commit untuk memastikan hanya perubahan yang relevan yang termasuk.
- **Gunakan `git status` Secara Teratur**: Pastikan tidak ada file yang tidak sengaja ter-commit.

--- 