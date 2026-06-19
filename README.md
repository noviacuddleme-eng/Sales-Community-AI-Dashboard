# Sales Community AI Dashboard

Dashboard bersama untuk tim Sales Community dengan hierarchy interaktif dan AI Task & Responsibility Analyzer.

## Fitur

- Hierarchy posisi yang dapat diklik
- Detail jobdesk, KPI, target bulanan, prioritas mingguan, dan daily task
- AI analyzer untuk menentukan PIC, support, alasan ownership, langkah kerja, evidence, dan escalation threshold
- OpenAI API dipanggil dari server agar API key tidak tampil di browser
- Tampilan responsif untuk desktop dan mobile

## Menjalankan secara lokal

1. Instal Node.js 18 atau lebih baru.
2. Jalankan `npm install`.
3. Salin `.env.example` menjadi `.env.local`.
4. Isi `OPENAI_API_KEY` pada `.env.local`.
5. Jalankan `npm run dev`.
6. Buka `http://localhost:3000`.

## Deploy ke Vercel

1. Import repository ini ke Vercel.
2. Tambahkan Environment Variable `OPENAI_API_KEY`.
3. Opsional: tambahkan `OPENAI_MODEL`.
4. Jalankan deployment.

Jangan pernah memasukkan API key ke source code, file HTML, atau commit GitHub.
