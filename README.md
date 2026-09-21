# Snap Booth

Website photobooth (React + Vite): kamera live, filter yang bisa diatur bebas, efek halus wajah, 13 bingkai (dipilih setelah foto diambil), timer 3/5/10 detik, dan beberapa jenis cetak (single, strip 3, strip 4, grid 2x2). Sudah dioptimalkan untuk HP.

Repo: https://github.com/Isafird/photobooth

## Jalankan di lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:5173/photobooth/` (perhatikan ada `/photobooth/` di akhir, karena `base` di `vite.config.js` sudah diset ke nama repo ini), izinkan akses kamera saat diminta browser.

## Upload ke GitHub & deploy ke GitHub Pages

Repo GitHub-nya sudah ada di https://github.com/Isafird/photobooth — tinggal push project ini ke sana.

### 1. Push project ke GitHub

Dari folder project ini:

```bash
git init
git add .
git commit -m "Initial commit: Snap Booth"
git branch -M main
git remote add origin https://github.com/Isafird/photobooth.git
git push -u origin main
```

Kalau repo di GitHub sudah punya isi (misalnya README default), tarik dulu sebelum push:

```bash
git pull origin main --allow-unrelated-histories
# selesaikan konflik kalau ada, lalu:
git push -u origin main
```

### 2. Aktifkan GitHub Pages lewat GitHub Actions

1. Buka repo di GitHub → **Settings → Pages**.
2. Di bagian **Source**, pilih **GitHub Actions**.
3. Selesai — workflow di `.github/workflows/deploy.yml` (sudah ada di project ini) otomatis jalan setiap kamu push ke branch `main`: build project lalu deploy ke Pages.
4. Tunggu 1-2 menit, cek tab **Actions** di repo untuk lihat progress build.
5. Situs akan muncul di:

   **https://isafird.github.io/photobooth/**

### Update situs setelah ada perubahan

Setiap kali ubah kode, tinggal:

```bash
git add .
git commit -m "update"
git push
```

GitHub Actions otomatis build & deploy ulang.

## Catatan

- Situs ini butuh HTTPS untuk akses kamera — GitHub Pages sudah otomatis HTTPS, jadi aman.
- Semua proses foto (ambil, filter, bingkai, unduh) berjalan di browser pengguna; tidak ada data yang dikirim ke server mana pun.
- Sudah dioptimalkan untuk layar HP: kamera potret, tombol ganti kamera depan/belakang, tombol jepret sticky, dan aman dari notch/status bar (safe-area).
