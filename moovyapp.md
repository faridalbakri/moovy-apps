# MoovyApp

MoovyApp adalah aplikasi web untuk memfavoritkan film yang datanya diambil dari API **TMDB (The Movie Database)**.  
User dapat login, melihat list film berdasarkan kategori, lalu menambahkan film ke daftar **Favorite** miliknya.

---

## 1. Tujuan Project

- Membangun aplikasi **fullstack** (frontend + backend + database).
- Mengimplementasikan:
  - Autentikasi user (login & register).
  - Integrasi API eksternal (TMDB).
  - Fitur CRUD sederhana untuk **favorite movie**.
- Menjadi proyek portofolio dan pemenuhan tugas besar pemrograman fullstack.

---

## 2. Fitur Utama

### 2.1. Autentikasi User
- Register user baru.
- Login user dengan email & password.
- Password disimpan dalam bentuk **hash** (tidak plain text).
- Menyimpan session / token (JWT) di frontend untuk akses halaman yang butuh login.

### 2.2. Halaman Login & Register
- Form **Register**:
  - Nama
  - Email
  - Password
- Form **Login**:
  - Email
  - Password
- Validasi sederhana (required, format email, min length password).

### 2.3. Halaman Home
- Memiliki **Navbar** dengan menu:
  - `Home`
  - `Movies`
  - `Profile`
- Terdapat **Hero Section** berisi:
  - Nama aplikasi (MoovyApp).
  - Deskripsi singkat.
  - Tombol CTA (misal: "Explore Movies").
- Menampilkan **Favorite Movies** milik user yang sedang login:
  - Grid card movie.
  - Setiap card berisi poster, judul, rating, dan tombol:
    - `Remove from Favorite` (atau icon hati yang sudah aktif).

### 2.4. Halaman Movies
- Menampilkan list film berdasarkan kategori dari TMDB, contoh:
  - Popular
  - Top Rated
  - Upcoming
  - Now Playing
- Navigasi kategori bisa dalam bentuk:
  - Tab, dropdown, atau tombol filter.
- Setiap card movie menampilkan:
  - Poster
  - Judul
  - Rating
  - Tombol `Add to Favorite` (jika belum difavoritkan).

### 2.5. Halaman Profile
- Menampilkan informasi user:
  - Nama
  - Email
- Statistik sederhana (opsional):
  - Jumlah film di Favorite
- Tombol `Logout`.

---

## 3. Stack Teknologi

### 3.1. Frontend

- **React** (Vite)
- **React Router** → routing halaman (Home, Movies, Profile, Login, Register).
- **Tailwind CSS** → utility-first styling.
- **Flowbite React** → komponen UI:
  - Navbar
  - Card
  - Button
  - Modal (kalau diperlukan)
- **Zustand** → state management untuk:
  - Menyimpan state autentikasi (user, token).
  - Menyimpan state sederhana lain (mis: kategori movie yang aktif).
- **Axios / fetch API** → komunikasi dengan backend.

### 3.2. Backend

- **Node.js + Express**
- **Sequelize** sebagai ORM:
  - Menghubungkan Node.js dengan database MySQL.
  - Mengelola model `User` dan `FavoriteMovie`.
  - Mendukung migrasi database melalui `sequelize-cli`.
- **mysql2** → driver untuk koneksi MySQL.
- **JWT (jsonwebtoken)** → autentikasi berbasis token.
- **bcryptjs** → hashing password.
- **dotenv** → menyimpan konfigurasi sensitif:
  - `TMDB_API_KEY`
  - `JWT_SECRET`
  - Konfigurasi database (username, password, host, database).

### 3.3. Database

- **MySQL**

Tabel utama (konseptual, diimplementasikan lewat Sequelize model + migration):

#### Tabel `Users`

| Kolom      | Tipe         | Keterangan                       |
|-----------|--------------|----------------------------------|
| id        | INT, PK, AI  | Primary key                      |
| name      | VARCHAR(100) | Nama user                        |
| email     | VARCHAR(100) | Email unik                       |
| password  | VARCHAR(255) | Password yang sudah di-hash      |
| createdAt | TIMESTAMP    | Waktu dibuat                     |
| updatedAt | TIMESTAMP    | Waktu diupdate                   |

#### Tabel `FavoriteMovies`

| Kolom        | Tipe         | Keterangan                                             |
|-------------|--------------|--------------------------------------------------------|
| id          | INT, PK, AI  | Primary key                                            |
| userId      | INT, FK      | Relasi ke `Users.id`                                   |
| movieId     | INT          | ID film dari TMDB                                      |
| title       | VARCHAR(255) | Judul film (disimpan untuk kemudahan)                  |
| posterPath  | VARCHAR(255) | Path poster dari TMDB                                  |
| voteAverage | FLOAT        | Rating film (opsional, bisa diambil dari TMDB)         |
| createdAt   | TIMESTAMP    | Waktu user menambahkan ke favorite                     |
| updatedAt   | TIMESTAMP    | Waktu update                                           |

Relasi:

- `Users (1)` — `FavoriteMovies (*)`

> Di Sequelize, relasi ini diatur dengan `User.hasMany(FavoriteMovie)` dan `FavoriteMovie.belongsTo(User)`.

---

## 4. Arsitektur Aplikasi

Secara sederhana:

- **Frontend (React + Zustand + Flowbite)**:
  - Menampilkan UI (login, home, movies, profile).
  - Mengirim request ke backend (auth, favorite).
  - Mengelola state user & token menggunakan Zustand.
- **Backend (Express + Sequelize)**:
  - Mengelola autentikasi (register, login).
  - Mengelola CRUD `FavoriteMovies`.
  - Menjadi perantara (proxy) untuk request ke **TMDB API**.
- **TMDB API**:
  - Menyediakan data film (popular, top rated, dll).
- **MySQL**:
  - Menyimpan data user dan favorit.

Flow contoh:

1. User login → frontend kirim ke backend `/api/auth/login`.
2. Backend verifikasi, kirim balik **JWT token**.
3. Frontend simpan token di **Zustand store** (dan optional localStorage).
4. Saat user buka halaman `Movies`, frontend memanggil backend:
   - `/api/movies/popular` → backend panggil TMDB, lalu return ke frontend.
5. Saat user klik `Add to Favorite`, frontend kirim:
   - `POST /api/favorites` dengan `movieId` dan token (di header Authorization).
6. Backend menyimpan ke tabel `FavoriteMovies` berdasarkan user yang login.

---

## 5. Rancangan Endpoint API (Draft)

Base URL backend (contoh): `http://localhost:5000/api`

### 5.1. Auth

- **POST** `/auth/register`  
  Body:
  - `name`
  - `email`
  - `password`  
  Proses:
  - Cek email unik.
  - Hash password dengan `bcryptjs`.
  - Simpan ke tabel `Users`.

- **POST** `/auth/login`  
  Body:
  - `email`
  - `password`  
  Proses:
  - Cari user berdasarkan email.
  - Cek kecocokan password dengan `bcryptjs.compare`.
  - Jika valid, generate `JWT` dengan payload minimal `{ id, email }`.  
  Response:
  - `accessToken` (JWT)
  - data user (id, name, email)

- **GET** `/auth/me`  
  Header: `Authorization: Bearer <token>`  
  Proses:
  - Verifikasi JWT.
  - Ambil data user berdasarkan `id` di token.

---

### 5.2. Movies (TMDB Proxy)

- **GET** `/movies/popular`
- **GET** `/movies/top-rated`
- **GET** `/movies/upcoming`
- **GET** `/movies/now-playing`

Backend akan meneruskan request ke TMDB menggunakan `TMDB_API_KEY` yang disimpan di `.env`, kemudian hanya mengirim data yang diperlukan ke frontend (misal: id, title, poster_path, vote_average).

---

### 5.3. Favorite Movies

Semua endpoint ini **butuh Auth (JWT)**.

- **GET** `/favorites`
  - Mengambil semua favorite milik user yang sedang login dari tabel `FavoriteMovies`.

- **POST** `/favorites`
  Body:
  - `movieId`
  - `title`
  - `posterPath`
  - `voteAverage` (opsional)  
  Proses:
  - Menggunakan `userId` dari token.
  - Simpan ke `FavoriteMovies`.

- **DELETE** `/favorites/:id`
  - Menghapus satu favorite berdasarkan `id` di tabel `FavoriteMovies`.
  - Backend memastikan bahwa favorite tersebut milik user yang sedang login.

---

## 6. Alur Penggunaan (User Flow)

1. User membuka MoovyApp.
2. Jika belum punya akun:
   - Buka halaman **Register** → submit → redirect ke login.
3. User login:
   - Jika sukses → token disimpan ke Zustand (dan optional localStorage) → redirect ke **Home**.
4. Di halaman **Home**:
   - User melihat hero section & list **favorite movies** miliknya dari `/favorites`.
5. User menuju halaman **Movies**:
   - Pilih kategori (popular/top rated/upcoming/now playing).
   - Klik `Add to Favorite` pada film yang diinginkan (mengirim ke `/favorites`).
6. Di halaman **Home** atau **Profile**:
   - User bisa melihat total favorite dan menghapus jika mau.
7. User klik `Logout`:
   - State di Zustand di-reset.
   - Token di localStorage (kalau dipakai) dihapus.
   - User dikembalikan ke halaman login.

---

## 7. Rencana Pengembangan (Roadmap)

### Tahap 1 – Setup & Dasar
- Setup repo frontend:
  - Vite + React + TypeScript (opsional) + Tailwind + Flowbite React.
  - Setup Zustand store untuk auth.
- Setup repo backend:
  - Express + Sequelize + MySQL.
  - Konfigurasi `config/config.json` (Sequelize) dan `.env` (JWT, TMDB API key).

### Tahap 2 – Backend
- Inisialisasi Sequelize dengan `sequelize-cli init`.
- Buat model & migration:
  - `User`
  - `FavoriteMovie`
- Jalankan migrasi dengan `sequelize-cli db:migrate`.
- Implementasi endpoint:
  - `/auth/register`
  - `/auth/login`
  - `/auth/me`
- Implementasi endpoint:
  - `/favorites` (GET, POST, DELETE)
- Implementasi endpoint TMDB proxy:
  - `/movies/popular`, `/movies/top-rated`, dll.
- Uji semua endpoint menggunakan **Apidog**:
  - Membuat collection endpoint.
  - Menyimpan contoh request/response.
  - Menulis deskripsi singkat tiap endpoint.

### Tahap 3 – Frontend
- Halaman `Login` & `Register` + integrasi ke endpoint backend.
- Setup `useAuthStore` (Zustand) untuk menyimpan:
  - `user`
  - `token`
  - `isAuthenticated`
  - aksi seperti `login`, `logout`, `setUser`.
- Halaman `Home`:
  - Hero section.
  - List favorite dari `/favorites`.
- Halaman `Movies`:
  - List film by kategori dari endpoint backend `/movies/...`.
  - Tombol `Add to Favorite`.
- Halaman `Profile`:
  - Info user (dari `/auth/me`).
  - Statistik favorite (opsional).

### Tahap 4 – Penyempurnaan
- Proteksi route dengan state di Zustand:
  - Redirect ke login jika belum authenticated.
- Loading state, error handling, dan notifikasi (toast/alert).
- Responsive design (mobile-first).
- Penulisan dokumentasi akhir & screenshot fitur.

---

## 8. Tools Pendukung

- **VS Code** → editor utama pengembangan.
- **Node.js & npm** → untuk menjalankan frontend & backend.
- **MySQL / phpMyAdmin / MySQL Workbench** → untuk mengelola database.
- **Sequelize CLI** → untuk membuat migration, model, dan menjalankan migrasi.
- **Apidog** → untuk:
  - Menguji endpoint backend (auth, movies, favorites).
  - Mendokumentasikan API (deskripsi, parameter, response).
- **Git & GitHub** → version control dan hosting source code.

---

## 9. Catatan Tambahan

- Kunci API TMDB **tidak boleh** ditaruh di frontend secara langsung.  
  Disarankan:
  - Panggil TMDB dari **backend**, lalu kirim hasilnya ke frontend.
- Untuk tugas besar, bisa ditambahkan fitur tambahan seperti:
  - Pencarian film (`/search`).
  - Filter berdasarkan genre.
  - Pagination atau infinite scroll.
- Dokumentasi ini masih dapat disesuaikan dengan:
  - Format laporan tugas besar.
  - Kebutuhan dosen (mis. penambahan diagram UML, ERD, dan lain-lain).
