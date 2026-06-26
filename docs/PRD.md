# Product Requirements Document (PRD)
**Website Himpunan Mahasiswa Teknik Informatika**  
Status: Draft | Versi: 1.0  

---

## 1. Overview

### 1.1 Latar Belakang
Saat ini, pencatatan data anggota dan alumni Himpunan Mahasiswa Teknik Informatika masih tersebar di berbagai dokumen terpisah (Spreadsheet, G-Drive) sehingga menyulitkan pelacakan dan validasi status keanggotaan. Di sisi lain, publikasi kegiatan, artikel teknologi, dan press release organisasi belum memiliki wadah resmi yang profesional dan terindeks oleh mesin pencari (SEO), karena hanya bergantung pada media sosial.

### 1.2 Tujuan Sistem
Membangun portal website resmi himpunan yang berfungsi sebagai:
- **Pusat Data Anggota & Alumni:** Mengelola database mahasiswa, pengurus aktif, demisioner, hingga alumni secara terpusat.
- **Media Publikasi Resmi (Blog):** Menyediakan sistem CMS (Content Management System) untuk publikasi berita, artikel teknologi, tutorial, dan kegiatan himpunan.
- **Digital Branding:** Menjadi etalase digital portofolio organisasi dan wadah pengenalan struktur kepengurusan kepada publik.

### 1.3 Scope

**In Scope:**
- Manajemen profil anggota (aktif, demisioner, alumni).
- Struktur kepengurusan per periode (Divisi, Jabatan).
- Sistem Blog/Artikel (Kategori, Tag, Author, Draft/Publish).
- Halaman Public-facing (Landing Page, Daftar Pengurus, Direktori Alumni, Halaman Blog).
- Dashboard pengguna untuk anggota memperbarui profil, link portofolio, dan foto.

**Out of Scope:**
- Sistem e-Voting/Pemilu Raya (Pemira).
- Sistem Keuangan/Kas detail.
- Integrasi otomatis dengan sistem akademik kampus (SIAKAD).

### 1.4 Asumsi & Constraints
- Autentikasi anggota menggunakan NIM sebagai username.
- Pendaftaran akun tidak terbuka untuk umum; akun dibuatkan/di-import oleh admin secara kolektif saat ada angkatan baru.
- Fitur Blog bebas diakses publik tanpa perlu login.
- Hak akses pengelolaan blog dan pengelolaan anggota dipisah berdasarkan divisi.

---

## 2. Stakeholders & Roles

| Role | Representasi Nyata | Fokus Akses |
|---|---|---|
| `super-admin` | Ketua Himpunan / BPI | Full access, melihat statistik keseluruhan, manajemen role. |
| `admin-psdm` | Divisi PSDM/Kesekretariatan | Kelola data anggota, verifikasi alumni, kelola periode kepengurusan. |
| `admin-kominfo` | Divisi Kominfo/Media | Kelola konten blog, kategori, dan pengaturan tampilan halaman depan. |
| `member` | Anggota / Alumni | Update data diri, riwayat organisasi, tautan portofolio. |
| `guest` | Publik | Hanya bisa membaca (read-only) artikel dan halaman publik. |

---

## 3. Feature List per Role

### 3.1 Super Admin (Ketua Himpunan)
| Kode | Fitur | Deskripsi |
|---|---|---|
| SA-01 | Dashboard Eksekutif | Menampilkan statistik jumlah anggota aktif vs alumni, metrik pembaca blog, dan demografi angkatan. |
| SA-02 | Role & Access Management | Menetapkan anggota mana yang menjadi `admin-psdm` atau `admin-kominfo` pada periode berjalan. |
| SA-03 | Master Periode Kepengurusan | CRUD periode tahunan. Toggle periode mana yang sedang aktif. |

### 3.2 Admin PSDM (Manajemen Data Anggota)
| Kode | Fitur | Deskripsi |
|---|---|---|
| PM-01 | CRUD Data Anggota | Tambah, edit, hapus data dasar anggota (NIM, Nama, Angkatan, Status). |
| PM-02 | Import Anggota Massal | Import data mahasiswa baru via Excel/CSV untuk digenerate akunnya. |
| PM-03 | Manajemen Kepengurusan | Memasukkan anggota ke dalam struktur divisi dan jabatan sesuai periode aktif. |
| PM-04 | Validasi Alumni | Mengubah status anggota menjadi "Alumni" saat mereka lulus. |

### 3.3 Admin Kominfo (Sistem Blog & Publikasi)
| Kode | Fitur | Deskripsi |
|---|---|---|
| BK-01 | CMS Artikel | Rich text editor untuk menulis artikel. Mendukung sisipan gambar dan code block. |
| BK-02 | Manajemen Status Konten | Pengaturan status artikel: Draft, Scheduled, dan Published. |
| BK-03 | Master Kategori & Tag | CRUD kategori dan tagging untuk kemudahan filter SEO. |
| BK-04 | Media Library | Manajemen unggahan gambar (thumbnail artikel dan dokumentasi kegiatan). |

### 3.4 Member (Anggota Aktif & Alumni)
| Kode | Fitur | Deskripsi |
|---|---|---|
| MB-01 | Login Sistem | Masuk menggunakan kredensial (NIM dan password awal yang digenerate sistem). |
| MB-02 | Kelola Profil & Portofolio | Mengubah password, update foto profil, kontak, serta tautan repositori coding dan LinkedIn. |
| MB-03 | Riwayat Organisasi | Melihat track record jabatannya sendiri di himpunan dari periode ke periode. |

### 3.5 Guest (Pengunjung Publik)
| Kode | Fitur | Deskripsi |
|---|---|---|
| PU-01 | Landing Page | Beranda berisi sekilas pandang himpunan, visi-misi, dan highlight artikel terbaru. |
| PU-02 | Halaman Direktori Pengurus | Menampilkan bagan atau daftar pengurus divisi pada periode aktif. |
| PU-03 | Portal Artikel (Blog) | Menampilkan feed artikel dengan fitur pencarian, filter kategori, dan pagination. |

---

## 4. User Flows Utama

### 4.1 Alur Publikasi Artikel Blog
```text
[Admin Kominfo]
1. Login → Masuk Dashboard Kominfo
2. Menu "Tulis Artikel Baru"
3. Input Judul, isi konten (menggunakan rich text/markdown editor)
4. Pilih Kategori & masukkan Tags
5. Upload Thumbnail/Cover Image
6. Pilih aksi (Simpan Draft / Publish)
7. Jika Published → Artikel terindeks di halaman Blog publik.
```

### 4.2 Alur Pembaruan Data Kepengurusan Baru
```text
[Admin PSDM]
1. Awal tahun ajaran, masuk ke "Master Periode"
2. Buat periode baru dan set sebagai "Aktif"
3. Masuk ke "Struktur Kepengurusan"
4. Pilih Divisi, ketik NIM/Nama anggota → assign ke Jabatan
5. Simpan. Data otomatis termutakhirkan di halaman "Direktori Pengurus" publik.
```

---

## 5. Business Rules

| Kode | Aturan |
|---|---|
| BR-01 | Username (NIM) bersifat unik, tidak boleh ada duplikasi di database. |
| BR-02 | Anggota memiliki lifecycle status: Aktif -> Demisioner -> Alumni. |
| BR-03 | Hanya super-admin dan admin-kominfo yang bisa menghapus/mengubah artikel published. |
| BR-04 | Halaman struktur kepengurusan di sisi publik hanya menampilkan data dari periode yang di-set "Aktif". |
| BR-05 | Jika seorang member di-set sebagai author, profilnya akan tertaut di artikel tersebut. |

---

## 6. Non-Functional Requirements

| Kategori | Requirement |
|---|---|
| **UI/UX Aesthetics** | Antarmuka berdesain modern, minimalis, dan profesional. Menggunakan komponen UI siap pakai. |
| **SEO & Meta Tags** | Fitur Blog wajib menghasilkan Dynamic Open Graph dan Meta Tags yang benar. |
| **Storage & Image Optimization** | Gambar thumbnail dan foto profil dikompresi otomatis sebelum disimpan ke storage. |
| **Keamanan** | Form login diproteksi dari Brute Force, dan input artikel diproteksi dari XSS. |
| **Performa** | Halaman publik wajib memuat dengan cepat (load time < 2 detik). |

---

## 7. Open Issues

| ID | Isu | Status |
|---|---|---|
| OI-01 | Apakah perlu fitur "Komentar" di artikel blog? | Open |
| OI-02 | Mekanisme hosting gambar dalam jangka panjang (lokal vs object storage)? | Open |
| OI-03 | Apakah tautan portofolio anggota memiliki halaman profil publik khusus? | Open |
