import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const roleContext = `
Struktur Sales Community:
1. Supervisor Sales Community: arah, target, keputusan, coaching, marketplace Malaysia, dan eskalasi lintas fungsi.
2. Sales Relation / Account Executive: komunikasi seller, PO/sell-out follow-up, laporan seller, program, NPD, dan seller issue.
3. Sales Acquisition Malaysia: lead generation, prospecting, qualification, meeting, proposal, onboarding, dan first PO.
4. Sales Delivery & Operations: validasi PO, stok, shortage, alokasi, produksi, fulfillment, delivery, dan outstanding.
5. Sales Admin & Data Support: Odoo, master data, dashboard, laporan, dokumentasi, reminder, dan evidence.
`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const question = String(body?.question || '').trim();
    if (!question) return NextResponse.json({ error: 'Pertanyaan wajib diisi.' }, { status: 400 });
    if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: 'OPENAI_API_KEY belum dikonfigurasi.' }, { status: 503 });

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      instructions: `Anda adalah AI Task & Responsibility Analyzer untuk tim Sales Community. Gunakan konteks peran berikut:\n${roleContext}\nTentukan satu PIC utama. Berikan hasil dalam JSON valid dengan field: pic, support, reason, steps, evidence, ai_help, escalation, confidence. Semua array berisi string. Gunakan Bahasa Indonesia dan jangan mengarang posisi di luar konteks kecuali sebagai pihak support lintas divisi.`,
      input: question,
      text: {
        format: {
          type: 'json_schema',
          name: 'responsibility_analysis',
          strict: true,
          schema: {
            type: 'object',
            additionalProperties: false,
            required: ['pic','support','reason','steps','evidence','ai_help','escalation','confidence'],
            properties: {
              pic: { type: 'string' },
              support: { type: 'array', items: { type: 'string' } },
              reason: { type: 'string' },
              steps: { type: 'array', items: { type: 'string' } },
              evidence: { type: 'array', items: { type: 'string' } },
              ai_help: { type: 'array', items: { type: 'string' } },
              escalation: { type: 'array', items: { type: 'string' } },
              confidence: { type: 'string' }
            }
          }
        }
      }
    });

    return NextResponse.json(JSON.parse(response.output_text));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Analisis gagal diproses.' }, { status: 500 });
  }
}
