# Galeri Walimah (versi Netlify)

- `/`         halaman tetamu (kod QR menuju ke sini)
- `/gallery`  skrin untuk projektor
- `/gallery?key=KUNCI_ANDA`  skrin dengan butang Padam

Edit nama pengantin di `public/config.js`.

## Deploy

Jangan guna drag-and-drop: ia tidak memasang pakej untuk Functions.

### Cara A: melalui GitHub (disyorkan)
1. Letak folder ini dalam repositori GitHub.
2. Netlify > Add new site > Import an existing project > pilih repositori. Biarkan tetapan lalai (netlify.toml sudah betul).
3. Site configuration > Environment variables > tambah `ADMIN_KEY` (kata laluan anda untuk padam gambar).
4. Deploys > Trigger deploy supaya kunci mula digunakan.

### Cara B: melalui CLI
```
npm install -g netlify-cli
netlify login
npm install
netlify init            # pilih "Create & configure a new project" atau sambung ke tapak sedia ada
netlify env:set ADMIN_KEY kunci-rahsia-anda
netlify deploy --prod
```

Selepas siap, buka `https://NAMA-TAPAK.netlify.app/` di telefon (mesti HTTPS, dan Netlify sudah beri), kemudian buat kod QR daripada URL itu.

Tanpa `ADMIN_KEY`, fungsi padam ditolak sepenuhnya.
