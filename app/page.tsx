'use client';

import { useMemo, useState } from 'react';
import { roles } from '../lib/roles';

const details: Record<string, any> = {
  supervisor: {
    purpose: 'Memimpin seluruh Sales Community agar target, prioritas, risiko, dan keputusan lintas fungsi terkendali.',
    jobdesk: ['Menetapkan target dan prioritas divisi','Memimpin WRM dan monthly review','Mengambil keputusan atas gap revenue dan issue lintas fungsi','Coaching seluruh PIC','Mengawal Marketplace Malaysia bersama agency','Menjaga KPI, action tracker, risk register, dan roadmap'],
    kpi: ['Revenue dan PO achievement','Forecast accuracy ≥ 90%','Critical issue closure ≥ 90%','Team KPI completion ≥ 90%'],
    monthly: ['Finalisasi target dan forecast','Review revenue, margin, seller health, pipeline, marketplace, dan outstanding','Tetapkan 3–5 prioritas divisi','Siapkan management report'],
    weekly: ['WRM target vs actual','Review seller plus/minus','Review PO, shortage, outstanding','Review pipeline Malaysia dan marketplace','Tentukan PIC, deadline, dan escalation'],
    daily: ['Review dashboard','Tetapkan 3 prioritas','Selesaikan decision request','Review overdue action','Coaching issue kompleks']
  },
  relation: {
    purpose: 'Menjadi PIC utama Seller Community untuk hubungan, target, action plan, program, dan kesiapan NPD.',
    jobdesk: ['Follow-up seller sesuai segmentasi','Mengawal target PO dan sell-out','Mengumpulkan laporan sell-out, loyalty, dan stok','Mengkomunikasikan program dan NPD','Mengidentifikasi seller berisiko','Mengeskalasi kebutuhan support'],
    kpi: ['PO seller achievement','Reporting compliance ≥ 95%','Seller retention ≥ 95%','NPD readiness seller prioritas 100%'],
    monthly: ['Kawal laporan seller','Review seller health','Susun kebutuhan support','Evaluasi program dan NPD'],
    weekly: ['Seller weekly pulse','Follow-up gap PO','Recovery seller merah','Program dan NPD','Seller issue closure'],
    daily: ['Cek seller prioritas','Follow-up seller','Catat hasil dan next action','Follow-up PO, laporan, program, NPD','Eskalasi issue']
  },
  acquisition: {
    purpose: 'Menghasilkan reseller Malaysia baru melalui prospecting, qualification, onboarding, dan first PO.',
    jobdesk: ['Membangun database prospek','Melakukan outreach dan follow-up','Qualification dan discovery','Menjadwalkan meeting dan proposal','Mengelola objection','Mengawal onboarding dan first PO','Memperbarui pipeline dan lost reason'],
    kpi: ['Lead baru','Qualified lead','Meeting dan proposal','New reseller dan first PO','Pipeline hygiene 100%'],
    monthly: ['Tetapkan target wilayah dan prospek','Review conversion funnel','Bersihkan pipeline','Susun market opportunity'],
    weekly: ['Prospecting','Qualified lead follow-up','Meeting dan proposal','Onboarding','Pipeline hygiene'],
    daily: ['Tambah prospek','Outreach dan follow-up','Qualification','Update stage dan next action','Siapkan meeting atau proposal']
  },
  operations: {
    purpose: 'Memastikan PO dapat dipenuhi melalui validasi, alokasi stok, koordinasi produksi, delivery, dan outstanding control.',
    jobdesk: ['Memvalidasi PO','Mencocokkan PO dengan stok dan WIP','Membuat shortage analysis','Koordinasi Produksi, SCM, dan Warehouse','Menentukan fulfillment dan ETA','Menyusun delivery plan dan outstanding aging'],
    kpi: ['Fulfillment rate ≥ 95%','On-time delivery ≥ 95%','Schedule accuracy ≥ 90%','PO SLA compliance ≥ 95%'],
    monthly: ['Analisis fulfillment dan outstanding','Review demand vs supply','Reconcile order, delivery, dan POD','Usulkan perbaikan cycle time'],
    weekly: ['Shortage analysis','Commitment produksi','Delivery plan','Outstanding control','NPD stock readiness'],
    daily: ['Validasi PO','Cek stok dan WIP','Update shortage dan ETA','Koordinasi issue shipment atau produksi','Update outstanding']
  },
  admin: {
    purpose: 'Menjamin transaksi, data, dashboard, dokumentasi, dan evidence lengkap, akurat, dan tepat waktu.',
    jobdesk: ['Input dan validasi transaksi Odoo','Memperbarui master data','Memvalidasi laporan seller','Memperbarui dashboard dan action tracker','Mengelola dokumen dan evidence','Menyiapkan bahan WRM dan MBR'],
    kpi: ['Data accuracy ≥ 99%','Dashboard timeliness 100%','Document completeness ≥ 98%','Report completeness ≥ 95%'],
    monthly: ['Reconcile data dan dashboard','Audit evidence','Siapkan management report pack','Review data quality issue'],
    weekly: ['Odoo dan transaksi','Dashboard refresh','Seller report validation','Documentation','WRM support'],
    daily: ['Input transaksi Odoo','Update master data dan tracker','Validasi laporan dan dokumen','Kirim reminder administratif','Catat mismatch dan correction']
  }
};

export default function Home() {
  const [selected, setSelected] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const role = useMemo(() => roles.find(r => r.id === selected), [selected]);

  async function analyze() {
    if (!question.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await fetch('/api/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analisis gagal');
      setResult(data);
    } catch (e:any) { setError(e.message); }
    finally { setLoading(false); }
  }

  return <main>
    <section className="hero">
      <div className="shell">
        <span className="eyebrow">Shared Team Dashboard</span>
        <h1>Sales Community AI Dashboard</h1>
        <p>Satu pusat kerja untuk hierarchy, ownership, jobdesk, KPI, target bulanan, prioritas mingguan, daily task, dan analisis tanggung jawab berbasis AI.</p>
        <div className="badges"><span>5 peran internal</span><span>Hierarchy interaktif</span><span>AI Analyzer</span><span>Bahasa Indonesia</span></div>
      </div>
    </section>

    <nav><div className="shell navlinks"><a href="#hierarchy">Hierarchy</a><a href="#analyzer">AI Analyzer</a><a href="#cadence">Cadence</a></div></nav>

    <section id="hierarchy" className="section shell">
      <h2>Hierarchy Interaktif</h2>
      <p className="lead">Klik setiap posisi untuk membuka jobdesk, KPI, target bulanan, prioritas mingguan, dan daily task.</p>
      <div className="org">
        <button className="node top" style={{background: roles[0].color}} onClick={()=>setSelected('supervisor')}><b>{roles[0].title}</b><small>{roles[0].short}</small></button>
        <div className="line" />
        <div className="row">{roles.slice(1).map(r=><button key={r.id} className="node" style={{background:r.color}} onClick={()=>setSelected(r.id)}><b>{r.title}</b><small>{r.short}</small></button>)}</div>
      </div>
    </section>

    <section id="analyzer" className="section alt">
      <div className="shell">
        <h2>AI Task & Responsibility Analyzer</h2>
        <p className="lead">Ketik pertanyaan bebas. AI akan menentukan PIC utama, support, alasan ownership, langkah kerja, evidence, dan escalation threshold.</p>
        <div className="card inputCard">
          <textarea value={question} onChange={e=>setQuestion(e.target.value)} placeholder="Contoh: Seller belum mengirim laporan dan PO bulan ini turun. Siapa yang bertanggung jawab dan apa langkahnya?" />
          <button className="primary" onClick={analyze} disabled={loading}>{loading ? 'Menganalisis...' : 'Analisis Tanggung Jawab'}</button>
          {error && <p className="error">{error}</p>}
        </div>
        {result && <div className="resultGrid">
          <article className="card"><span className="mini">PIC Utama</span><h3>{result.pic}</h3><p>{result.reason}</p><p className="confidence">Confidence: {result.confidence}</p></article>
          <article className="card"><span className="mini">Support</span><ul>{result.support.map((x:string)=><li key={x}>{x}</li>)}</ul></article>
          <article className="card"><h3>Langkah Kerja</h3><ol>{result.steps.map((x:string)=><li key={x}>{x}</li>)}</ol></article>
          <article className="card"><h3>Evidence</h3><ul>{result.evidence.map((x:string)=><li key={x}>{x}</li>)}</ul></article>
          <article className="card"><h3>Bagaimana AI Membantu</h3><ul>{result.ai_help.map((x:string)=><li key={x}>{x}</li>)}</ul></article>
          <article className="card"><h3>Escalation Threshold</h3><ul>{result.escalation.map((x:string)=><li key={x}>{x}</li>)}</ul></article>
        </div>}
      </div>
    </section>

    <section id="cadence" className="section shell">
      <h2>Team Cadence</h2>
      <div className="resultGrid"><article className="card"><span className="mini">Daily</span><h3>Daily Control</h3><p>Prioritas hari ini, blocker, seller risk, critical PO, pipeline, dan marketplace alert.</p></article><article className="card"><span className="mini">Weekly</span><h3>WRM & Operations Review</h3><p>Target vs actual, seller, PO, shortage, delivery, pipeline Malaysia, marketplace, dan action tracker.</p></article><article className="card"><span className="mini">Monthly</span><h3>Monthly Business Review</h3><p>Revenue, margin, seller health, fulfillment, conversion acquisition, marketplace P&L, dan KPI individu.</p></article></div>
    </section>

    {role && <div className="modal" onClick={e=>{if(e.currentTarget===e.target)setSelected(null)}}><div className="panel"><header style={{background:`linear-gradient(135deg,${role.color},#10213d)`}}><button onClick={()=>setSelected(null)}>×</button><h2>{role.title}</h2><p>{role.short}</p></header><div className="panelBody"><div className="detailGrid"><article className="box full"><h3>Job Purpose</h3><p>{details[role.id].purpose}</p></article><article className="box"><h3>Detail Jobdesk</h3><ul>{details[role.id].jobdesk.map((x:string)=><li key={x}>{x}</li>)}</ul></article><article className="box"><h3>KPI</h3><ul>{details[role.id].kpi.map((x:string)=><li key={x}>{x}</li>)}</ul></article><article className="box"><h3>Target Bulanan</h3><ul>{details[role.id].monthly.map((x:string)=><li key={x}>{x}</li>)}</ul></article><article className="box"><h3>Prioritas Mingguan</h3><ul>{details[role.id].weekly.map((x:string)=><li key={x}>{x}</li>)}</ul></article><article className="box full"><h3>Daily Task</h3><ul>{details[role.id].daily.map((x:string)=><li key={x}>{x}</li>)}</ul></article></div></div></div></div>}
  </main>;
}
