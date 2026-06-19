import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const roleContext = `
Struktur Sales Community:
1. Supervisor Sales Community: arah, target, keputusan, coaching, marketplace Malaysia, dan eskalasi lintas fungsi.
2. Key Account Leader: strategi, coaching, segmentasi, recovery plan, program, NPD, dan performa Seller Community. Sales Relation melapor ke posisi ini.
3. Sales Relation / Account Executive: komunikasi seller, follow-up PO dan sell-out, laporan seller, program, NPD, dan seller issue.
4. Sales Acquisition Malaysia: lead generation, prospecting, qualification, meeting, proposal, onboarding, dan first PO.
5. Sales Delivery & Operations: validasi PO, stok, shortage, produksi, fulfillment, delivery, outstanding, dan koordinasi forwarder atau ekspedisi Malaysia termasuk quotation, pickup, dokumen shipment, tracking, customs, ETA, dan biaya logistik.
6. Sales Admin & Data Support: Odoo, master data, dashboard, laporan, dokumentasi, reminder, dan evidence.
`;

type Analysis = {
  pic: string;
  support: string[];
  reason: string;
  steps: string[];
  evidence: string[];
  ai_help: string[];
  escalation: string[];
  confidence: string;
  source?: string;
};

function fallbackAnalysis(question: string): Analysis {
  const q = question.toLowerCase();
  const malaysiaLogistics = ['forwarder','ekspedisi','shipment','shipping','customs','bea cukai','trucking','container','kontainer','pickup','stuffing','eta','delivery malaysia','pengiriman malaysia','freight','thc'].some(k => q.includes(k));
  const sellerStrategy = ['strategi seller','seller merah','seller turun','recovery seller','segmentasi seller','coaching sales relation','retention','account plan'].some(k => q.includes(k));
  const sellerExecution = ['laporan seller','follow up seller','follow-up seller','po seller','sell out','sell-out','program seller','loyalty','npd seller'].some(k => q.includes(k));
  const acquisition = ['lead malaysia','prospek malaysia','calon reseller','reseller baru','first po','proposal malaysia','onboarding malaysia'].some(k => q.includes(k));
  const admin = ['odoo','dashboard','master data','dokumen','evidence','arsip','input data','rekap data'].some(k => q.includes(k));

  if (malaysiaLogistics) return {
    pic: 'Sales Delivery & Operations',
    support: ['Sales Admin & Data Support','Supervisor Sales Community','SCM / Warehouse / Forwarder'],
    reason: 'Topik berkaitan langsung dengan koordinasi ekspedisi dan pengiriman Malaysia, sehingga ownership operasional berada pada Sales Delivery & Operations.',
    steps: ['Validasi detail PO, volume, berat, tujuan, dan target ETA','Minta atau konfirmasi quotation forwarder','Koordinasikan pickup, stuffing, trucking, dan jadwal keberangkatan','Pastikan invoice, packing list, COO, PEB, dan dokumen customs tersedia','Pantau milestone shipment dan ETA','Update tracker serta eskalasi perubahan biaya atau keterlambatan'],
    evidence: ['Quotation forwarder','Shipment plan','Checklist dokumen','Tracking update','Bukti koordinasi','POD atau delivery confirmation'],
    ai_help: ['Membuat checklist shipment','Membandingkan quotation','Menyusun pesan koordinasi','Merangkum risiko dan timeline'],
    escalation: ['Biaya melebihi approval','Jadwal bergeser signifikan','Dokumen customs bermasalah','Risiko demurrage, detention, atau gagal clearance'],
    confidence: 'Tinggi',
    source: 'fallback'
  };

  if (sellerStrategy) return {
    pic: 'Key Account Leader',
    support: ['Sales Relation / Account Executive','Supervisor Sales Community','Sales Admin & Data Support'],
    reason: 'Masalah memerlukan strategi account, coaching, segmentasi, atau recovery plan seller.',
    steps: ['Validasi data performa seller','Identifikasi akar masalah','Tentukan status growth, maintenance, atau recovery','Susun account plan','Brief Sales Relation','Monitor progress mingguan'],
    evidence: ['Seller health review','Account plan','Coaching note','Recovery tracker'],
    ai_help: ['Menganalisis pola penurunan','Menyusun recovery plan','Membuat coaching agenda'],
    escalation: ['Butuh dukungan lintas divisi','Butuh budget atau perubahan kebijakan','Seller strategis berisiko keluar'],
    confidence: 'Tinggi',
    source: 'fallback'
  };

  if (sellerExecution) return {
    pic: 'Sales Relation / Account Executive',
    support: ['Key Account Leader','Sales Admin & Data Support'],
    reason: 'Topik terkait komunikasi, follow-up, laporan, PO, program, atau aktivitas seller existing.',
    steps: ['Periksa histori dan data seller','Hubungi seller','Validasi kondisi aktual','Tetapkan next action dan deadline','Update tracker','Eskalasi bila tidak ada respons atau ada risiko besar'],
    evidence: ['Follow-up log','Bukti komunikasi','Seller report','Action tracker'],
    ai_help: ['Menyusun pesan follow-up','Merangkum histori seller','Membuat action plan'],
    escalation: ['Seller tidak merespons sesuai SLA','Gap PO material','Butuh keputusan program atau kebijakan'],
    confidence: 'Tinggi',
    source: 'fallback'
  };

  if (acquisition) return {
    pic: 'Sales Acquisition Malaysia',
    support: ['Supervisor Sales Community','Sales Admin & Data Support','Sales Delivery & Operations'],
    reason: 'Topik berkaitan dengan prospek, qualification, onboarding, proposal, atau first PO reseller Malaysia.',
    steps: ['Qualification prospek','Discovery kebutuhan','Susun proposal','Follow-up objection','Konfirmasi onboarding','Kawal first PO'],
    evidence: ['Lead record','Qualification note','Proposal','Pipeline update','First PO'],
    ai_help: ['Menyusun outreach','Menyiapkan proposal outline','Merangkum objection'],
    escalation: ['Term komersial di luar standar','Permintaan eksklusivitas','Risiko kredit atau legal'],
    confidence: 'Tinggi',
    source: 'fallback'
  };

  if (admin) return {
    pic: 'Sales Admin & Data Support',
    support: ['Pemilik proses terkait','Supervisor Sales Community'],
    reason: 'Topik berfokus pada input data, dashboard, dokumentasi, Odoo, atau evidence.',
    steps: ['Validasi sumber data','Periksa kelengkapan','Input atau update sistem','Lakukan cross-check','Simpan evidence','Laporkan mismatch'],
    evidence: ['Updated record','Checklist validasi','Dokumen sumber','Correction log'],
    ai_help: ['Membuat checklist','Mendeteksi data tidak lengkap','Menyusun reminder'],
    escalation: ['Data sumber tidak tersedia','Mismatch berdampak finansial','Butuh koreksi lintas divisi'],
    confidence: 'Sedang',
    source: 'fallback'
  };

  return {
    pic: 'Supervisor Sales Community',
    support: ['Key Account Leader','Sales Relation / Account Executive','Sales Delivery & Operations','Sales Admin & Data Support'],
    reason: 'Pertanyaan belum cukup spesifik untuk menentukan satu fungsi operasional dengan keyakinan tinggi, sehingga perlu triage oleh Supervisor.',
    steps: ['Definisikan masalah dan dampak','Tentukan channel atau proses terkait','Tetapkan PIC operasional','Buat deadline dan evidence','Monitor sampai selesai'],
    evidence: ['Problem statement','PIC dan deadline','Action tracker','Bukti penyelesaian'],
    ai_help: ['Memecah masalah','Menyusun RACI','Membuat action plan'],
    escalation: ['Dampak revenue tinggi','Risiko pelanggan atau seller strategis','Butuh keputusan lintas fungsi'],
    confidence: 'Sedang',
    source: 'fallback'
  };
}

function parseJson(text: string): Analysis | null {
  try { return JSON.parse(text); } catch {}
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try { return JSON.parse(match[0]); } catch { return null; }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const question = String(body?.question || '').trim();
  if (!question) return NextResponse.json({ error: 'Pertanyaan wajib diisi.' }, { status: 400 });

  const local = fallbackAnalysis(question);
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json(local);

  try {
    const client = new OpenAI({ apiKey });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      instructions: `Anda adalah AI Task & Responsibility Analyzer. Gunakan konteks berikut:\n${roleContext}\nPilih satu PIC utama. Kembalikan HANYA JSON valid tanpa markdown dengan field pic, support, reason, steps, evidence, ai_help, escalation, confidence. Semua field selain pic, reason, confidence adalah array string. Untuk topik forwarder, ekspedisi, shipment, customs, trucking, container, dokumen pengiriman, ETA, atau delivery Malaysia, PIC utama adalah Sales Delivery & Operations.`,
      input: question
    });

    const parsed = parseJson(response.output_text || '');
    if (!parsed) return NextResponse.json(local);
    return NextResponse.json({ ...parsed, source: 'openai' });
  } catch (error: any) {
    console.error('OpenAI analyzer error:', error?.status, error?.code, error?.message);
    return NextResponse.json({ ...local, source: 'fallback', notice: 'AI eksternal belum tersedia; hasil dibuat oleh decision engine internal.' });
  }
}
