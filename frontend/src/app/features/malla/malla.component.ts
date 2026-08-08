import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

export interface AsignaturaMalla {
  codigo: string;
  nombre: string;
  creditos: number;
  semestre: number;
  componente: string;
  ciclo: 'Ciclo Fundamentación' | 'Ciclo Profesional' | 'Ciclo Profundización';
  tipologia: 'Teórica' | 'Teórica Práctica' | 'Práctica';
  areaSigla: 'CBI' | 'FE' | 'CB' | 'FC' | 'Nv';
  areaNombre: string;
}

export interface CategoriaExplorador {
  id: 'componentes' | 'ciclos' | 'tipologias' | 'areas';
  titulo: string;
  subtitulo: string;
  descripcion: string;
  conteo: number;
}

@Component({
  selector: 'app-malla',
  standalone: true,
  imports: [RouterLink, NavbarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

    :host {
      display: block;
      width: 100%;
      min-height: 100vh;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: #f8fafc;
      color: #0f172a;
      overflow-x: hidden;
    }

    /* ===== HERO ===== */
    .page-hero {
      position: relative;
      min-height: 50vh;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 9rem 4rem 5rem;
      background: #0f172a;
      overflow: hidden;
    }

    .hero-bg-image {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.85;
    }

    .hero-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, rgba(15, 23, 42, 0.82) 0%, rgba(15, 23, 42, 0.45) 55%, rgba(15, 23, 42, 0.15) 100%);
    }

    .page-hero-container {
      position: relative;
      z-index: 10;
      max-width: 760px;
      margin: 0;
      text-align: left;
    }

    .page-hero h1 {
      font-size: 3.4rem;
      font-weight: 900;
      color: #ffffff;
      letter-spacing: -0.035em;
      line-height: 1.1;
      margin-bottom: 1rem;
      text-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
    }

    .page-hero h1 span { color: #4ade80; }

    .page-hero p {
      font-size: 1.15rem;
      color: #f1f5f9;
      line-height: 1.6;
      font-weight: 500;
      text-shadow: 0 2px 12px rgba(0, 0, 0, 0.7);
    }

    /* ===== STATS RIBBON ===== */
    .stats-ribbon {
      position: relative;
      z-index: 20;
      margin-top: -2.75rem;
      padding: 0 2rem;
    }

    .stats-container {
      max-width: 1140px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.15rem;
    }

    .stat-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.7);
      border-radius: 18px;
      padding: 1.35rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.02);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 14px 40px rgba(0, 0, 0, 0.12);
    }

    .stat-icon {
      width: 50px;
      height: 50px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-icon svg { width: 24px; height: 24px; }

    .stat-icon-subjects { background: linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%); color: #2563eb; }
    .stat-icon-credits { background: linear-gradient(135deg, #dcfce7 0%, #f0fdf4 100%); color: #15803d; }
    .stat-icon-semesters { background: linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%); color: #d97706; }
    .stat-icon-areas { background: linear-gradient(135deg, #f3e8ff 0%, #faf5ff 100%); color: #7c3aed; }

    .stat-value { font-size: 1.8rem; font-weight: 900; color: #0f172a; line-height: 1; letter-spacing: -0.03em; }
    .stat-label { font-size: 0.78rem; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.04em; margin-top: 0.15rem; }

    /* ===== VIEW MODE TABS ===== */
    .view-tabs-wrapper {
      max-width: 1140px;
      margin: 2.5rem auto 0;
      padding: 0 2rem;
      display: flex;
      justify-content: center;
    }

    .view-tabs {
      display: inline-flex;
      background: #ffffff;
      border: 1.5px solid #e2e8f0;
      border-radius: 14px;
      padding: 4px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
    }

    .view-tab {
      display: flex;
      align-items: center;
      gap: 0.55rem;
      padding: 0.7rem 1.65rem;
      border-radius: 11px;
      font-size: 0.88rem;
      font-weight: 700;
      border: none;
      background: transparent;
      color: #64748b;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .view-tab svg { width: 18px; height: 18px; }
    .view-tab:hover:not(.active) { color: #0f172a; background: #f8fafc; }

    .view-tab.active {
      background: linear-gradient(135deg, #15803d 0%, #166534 100%);
      color: #ffffff;
      box-shadow: 0 4px 14px rgba(21, 128, 61, 0.3);
    }

    /* ===== PAGE CONTENT ===== */
    .page-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2.5rem 2rem 5rem;
    }

    /* ===== SEMESTER TIMELINE ===== */
    .semester-timeline {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 3rem;
      padding: 0 1rem;
    }

    .timeline-node {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 2.5px solid #cbd5e1;
      background: #ffffff;
      color: #475569;
      font-size: 0.92rem;
      font-weight: 800;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      z-index: 2;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      flex-shrink: 0;
    }

    .timeline-connector {
      width: 32px;
      height: 2.5px;
      background: #e2e8f0;
      flex-shrink: 0;
      z-index: 1;
    }

    .timeline-node:hover:not(.active) {
      border-color: #15803d;
      color: #15803d;
      transform: scale(1.1);
    }

    .timeline-node.active {
      background: linear-gradient(135deg, #15803d 0%, #166534 100%);
      border-color: #15803d;
      color: #ffffff;
      box-shadow: 0 0 0 4px rgba(21, 128, 61, 0.15), 0 4px 14px rgba(21, 128, 61, 0.3);
      transform: scale(1.12);
    }

    .timeline-all-btn {
      margin-left: 1.25rem;
      padding: 0.55rem 1.3rem;
      border-radius: 11px;
      border: 2px solid #cbd5e1;
      background: #ffffff;
      color: #475569;
      font-size: 0.8rem;
      font-weight: 800;
      cursor: pointer;
      transition: all 0.25s ease;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .timeline-all-btn:hover:not(.active) {
      border-color: #15803d;
      color: #15803d;
    }

    .timeline-all-btn.active {
      background: linear-gradient(135deg, #15803d 0%, #166534 100%);
      border-color: #15803d;
      color: #ffffff;
      box-shadow: 0 4px 14px rgba(21, 128, 61, 0.3);
    }

    /* ===== SEMESTER SECTION ===== */
    .semester-section {
      margin-bottom: 3.25rem;
      animation: fadeInUp 0.4s ease both;
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .semester-header {
      display: flex;
      align-items: center;
      gap: 1.15rem;
      margin-bottom: 1.5rem;
      padding-bottom: 1.15rem;
      border-bottom: 2px solid #f1f5f9;
    }

    .semester-number {
      width: 54px;
      height: 54px;
      border-radius: 16px;
      background: linear-gradient(135deg, #15803d 0%, #166534 100%);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.45rem;
      font-weight: 900;
      flex-shrink: 0;
      box-shadow: 0 4px 16px rgba(21, 128, 61, 0.25);
    }

    .semester-title-group { flex: 1; }
    .semester-title { font-size: 1.3rem; font-weight: 900; color: #0f172a; margin: 0 0 0.15rem; }
    .semester-meta { font-size: 0.86rem; font-weight: 600; color: #64748b; }

    .cycle-badge {
      padding: 0.4rem 1rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      flex-shrink: 0;
    }

    .cycle-fund { background: #dbeafe; color: #1e40af; }
    .cycle-prof { background: #dcfce7; color: #166534; }
    .cycle-depth { background: #f3e8ff; color: #6b21a8; }

    /* ===== SUBJECT CARDS ===== */
    .subjects-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.15rem;
    }

    .subject-card {
      background: #ffffff;
      border: 1px solid #e8ecf1;
      border-left: 4px solid #e2e8f0;
      border-radius: 14px;
      padding: 1.25rem 1.35rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .subject-card::before {
      content: '';
      position: absolute;
      inset: 0;
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
    }

    .subject-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.07);
    }

    .subject-card:hover::before { opacity: 1; }

    .subject-card[data-area="CBI"] { border-left-color: #e11d48; }
    .subject-card[data-area="CBI"]::before { background: linear-gradient(135deg, rgba(225, 29, 72, 0.03) 0%, transparent 60%); }
    .subject-card[data-area="FE"] { border-left-color: #2563eb; }
    .subject-card[data-area="FE"]::before { background: linear-gradient(135deg, rgba(37, 99, 235, 0.03) 0%, transparent 60%); }
    .subject-card[data-area="CB"] { border-left-color: #059669; }
    .subject-card[data-area="CB"]::before { background: linear-gradient(135deg, rgba(5, 150, 105, 0.03) 0%, transparent 60%); }
    .subject-card[data-area="FC"] { border-left-color: #d97706; }
    .subject-card[data-area="FC"]::before { background: linear-gradient(135deg, rgba(217, 119, 6, 0.03) 0%, transparent 60%); }
    .subject-card[data-area="Nv"] { border-left-color: #7c3aed; }
    .subject-card[data-area="Nv"]::before { background: linear-gradient(135deg, rgba(124, 58, 237, 0.03) 0%, transparent 60%); }

    .subject-card-header { display: flex; align-items: center; justify-content: space-between; }

    .subject-code {
      font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
      font-size: 0.76rem;
      font-weight: 700;
      color: #475569;
      background: #f1f5f9;
      padding: 0.18rem 0.55rem;
      border-radius: 5px;
      letter-spacing: 0.02em;
    }

    .subject-credits {
      font-size: 0.73rem;
      font-weight: 800;
      padding: 0.18rem 0.6rem;
      border-radius: 8px;
      border: 1.5px solid;
    }

    .subject-credits[data-area="CBI"] { color: #e11d48; background: #fff1f2; border-color: #fecdd3; }
    .subject-credits[data-area="FE"] { color: #2563eb; background: #eff6ff; border-color: #bfdbfe; }
    .subject-credits[data-area="CB"] { color: #059669; background: #ecfdf5; border-color: #a7f3d0; }
    .subject-credits[data-area="FC"] { color: #d97706; background: #fffbeb; border-color: #fde68a; }
    .subject-credits[data-area="Nv"] { color: #7c3aed; background: #faf5ff; border-color: #ddd6fe; }

    .subject-name {
      font-size: 0.98rem;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.3;
      margin: 0;
    }

    .subject-tags { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: auto; }

    .area-chip {
      font-size: 0.68rem;
      font-weight: 700;
      padding: 0.15rem 0.5rem;
      border-radius: 5px;
    }

    .area-chip[data-area="CBI"] { background: #fff1f2; color: #be123c; }
    .area-chip[data-area="FE"] { background: #eff6ff; color: #1d4ed8; }
    .area-chip[data-area="CB"] { background: #ecfdf5; color: #047857; }
    .area-chip[data-area="FC"] { background: #fffbeb; color: #b45309; }
    .area-chip[data-area="Nv"] { background: #faf5ff; color: #6d28d9; }

    .tipo-chip {
      font-size: 0.68rem;
      font-weight: 700;
      padding: 0.15rem 0.5rem;
      border-radius: 5px;
      background: #f1f5f9;
      color: #475569;
    }

    /* ===== CATEGORY CARDS ===== */
    .categories-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.15rem;
      margin-bottom: 2.5rem;
    }

    .category-card {
      background: #ffffff;
      border: 1.5px solid #e2e8f0;
      border-radius: 18px;
      padding: 1.65rem;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }

    .category-card:hover {
      border-color: #bbf7d0;
      transform: translateY(-4px);
      box-shadow: 0 12px 30px rgba(21, 128, 61, 0.08);
    }

    .category-card.active {
      background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
      border-color: #15803d;
      box-shadow: 0 8px 28px rgba(21, 128, 61, 0.12);
    }

    .cat-icon {
      width: 50px;
      height: 50px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .cat-icon svg { width: 24px; height: 24px; }

    .cat-icon-componentes { background: linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%); color: #2563eb; }
    .cat-icon-ciclos { background: linear-gradient(135deg, #dcfce7 0%, #f0fdf4 100%); color: #15803d; }
    .cat-icon-tipologias { background: linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%); color: #d97706; }
    .cat-icon-areas { background: linear-gradient(135deg, #f3e8ff 0%, #faf5ff 100%); color: #7c3aed; }

    .category-card h4 { font-size: 1.05rem; font-weight: 800; color: #0f172a; margin: 0; }
    .category-card p { font-size: 0.82rem; color: #64748b; line-height: 1.5; margin: 0; }

    .category-badge {
      font-size: 0.73rem;
      font-weight: 800;
      color: #15803d;
      background: #dcfce7;
      padding: 0.22rem 0.7rem;
      border-radius: 20px;
      align-self: flex-start;
    }

    /* ===== EXPLORER SECTION ===== */
    .explorer-section {
      background: #ffffff;
      border: 1.5px solid #e2e8f0;
      border-radius: 22px;
      padding: 2.25rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
    }

    .explorer-header { margin-bottom: 1.75rem; }
    .explorer-header h3 { font-size: 1.45rem; font-weight: 900; color: #0f172a; margin: 0 0 0.3rem; }
    .explorer-header p { font-size: 0.92rem; color: #475569; margin: 0; line-height: 1.6; }

    .sub-pills { display: flex; flex-wrap: wrap; gap: 0.55rem; margin-bottom: 1.75rem; }

    .sub-pill {
      padding: 0.5rem 1.1rem;
      border-radius: 10px;
      font-size: 0.84rem;
      font-weight: 700;
      background: #f8fafc;
      color: #475569;
      border: 1.5px solid #e2e8f0;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .sub-pill:hover:not(.active) { background: #f0fdf4; color: #15803d; border-color: #bbf7d0; }

    .sub-pill.active {
      background: linear-gradient(135deg, #15803d 0%, #166534 100%);
      color: #ffffff;
      border-color: #15803d;
      box-shadow: 0 4px 14px rgba(21, 128, 61, 0.3);
    }

    .sub-info-card {
      background: linear-gradient(135deg, #f8fafc 0%, #f0fdf4 100%);
      border-left: 4px solid #15803d;
      border-radius: 12px;
      padding: 1.15rem 1.4rem;
      margin-bottom: 1.75rem;
    }

    .sub-info-card h4 { font-size: 1.05rem; font-weight: 800; color: #0f172a; margin: 0 0 0.25rem; }
    .sub-info-card p { font-size: 0.9rem; color: #334155; line-height: 1.6; margin: 0; }

    .filtered-count { font-size: 1.02rem; font-weight: 800; color: #0f172a; margin: 0 0 1.15rem; }

    /* ===== MODAL ===== */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 200;
      background: rgba(15, 23, 42, 0.5);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .subject-modal {
      background: #ffffff;
      border-radius: 22px;
      max-width: 580px;
      width: 100%;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.22);
      position: relative;
      overflow: hidden;
      animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px) scale(0.97); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .modal-banner {
      padding: 1.85rem 2rem;
      position: relative;
      color: #ffffff;
    }

    .modal-banner[data-area="CBI"] { background: linear-gradient(135deg, #e11d48 0%, #9f1239 100%); }
    .modal-banner[data-area="FE"] { background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); }
    .modal-banner[data-area="CB"] { background: linear-gradient(135deg, #059669 0%, #047857 100%); }
    .modal-banner[data-area="FC"] { background: linear-gradient(135deg, #d97706 0%, #b45309 100%); }
    .modal-banner[data-area="Nv"] { background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); }

    .btn-close-modal {
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      color: #ffffff;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background 0.2s ease;
      font-size: 0.95rem;
    }

    .btn-close-modal:hover { background: rgba(255, 255, 255, 0.35); }

    .modal-banner-code {
      font-family: 'SF Mono', 'Consolas', monospace;
      font-size: 0.8rem;
      font-weight: 700;
      background: rgba(255, 255, 255, 0.2);
      padding: 0.18rem 0.55rem;
      border-radius: 5px;
      display: inline-block;
      margin-bottom: 0.45rem;
    }

    .modal-banner h3 { font-size: 1.4rem; font-weight: 900; margin: 0 0 0.2rem; }
    .modal-banner-meta { font-size: 0.86rem; color: rgba(255, 255, 255, 0.85); margin: 0; }

    .modal-body {
      padding: 1.6rem 2rem 2rem;
      display: flex;
      flex-direction: column;
      gap: 0.9rem;
    }

    .modal-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.9rem;
    }

    .modal-meta-item {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 0.9rem 1.1rem;
    }

    .modal-meta-label {
      display: block;
      font-size: 0.7rem;
      font-weight: 800;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 0.3rem;
    }

    .modal-meta-value { display: block; font-size: 0.9rem; font-weight: 700; color: #0f172a; }

    /* ===== FOOTER ===== */
    .landing-footer { background: linear-gradient(135deg, #15803d 0%, #14532d 100%); color: #ffffff; padding: 4.5rem 2rem 2.5rem; border-top: 1px solid #166534; }
    .footer-container { max-width: 1240px; margin: 0 auto; display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 3.5rem; margin-bottom: 3.5rem; }
    .footer-brand h4 { color: #ffffff; font-size: 1.3rem; font-weight: 900; margin-bottom: 0.85rem; }
    .footer-brand p { color: rgba(255, 255, 255, 0.85); font-size: 0.9rem; line-height: 1.65; max-width: 350px; }
    .footer-col h5 { color: #ffffff; font-size: 0.9rem; font-weight: 800; margin-bottom: 1.25rem; text-transform: uppercase; letter-spacing: 0.06em; }
    .footer-links { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.75rem; }
    .footer-links a { color: rgba(255, 255, 255, 0.8); font-size: 0.9rem; text-decoration: none; }
    .footer-links a:hover { color: #ffffff; text-decoration: underline; }
    .footer-bottom { max-width: 1240px; margin: 0 auto; padding-top: 2rem; border-top: 1px solid rgba(255, 255, 255, 0.15); display: flex; align-items: center; justify-content: space-between; font-size: 0.85rem; color: rgba(255, 255, 255, 0.75); }

    /* ===== RESPONSIVE ===== */
    @media (max-width: 1024px) {
      .stats-container { grid-template-columns: repeat(2, 1fr); }
      .categories-grid { grid-template-columns: repeat(2, 1fr); }
      .subjects-grid { grid-template-columns: repeat(2, 1fr); }
      .footer-container { grid-template-columns: 1fr 1fr; }
    }

    @media (max-width: 768px) {
      .semester-timeline { flex-wrap: wrap; gap: 0.5rem; }
      .timeline-connector { display: none; }
      .timeline-node { width: 40px; height: 40px; font-size: 0.85rem; }
    }

    @media (max-width: 640px) {
      .page-hero { padding: 8rem 1.5rem 4rem; }
      .page-hero h1 { font-size: 2.2rem; }
      .stats-ribbon { margin-top: -2rem; padding: 0 1rem; }
      .stats-container { grid-template-columns: 1fr 1fr; gap: 0.75rem; }
      .stat-card { padding: 1rem; }
      .stat-value { font-size: 1.4rem; }
      .view-tabs-wrapper { padding: 0 1rem; }
      .view-tabs { width: 100%; }
      .view-tab { flex: 1; justify-content: center; padding: 0.65rem 0.75rem; font-size: 0.82rem; }
      .page-content { padding: 1.5rem 1rem 4rem; }
      .categories-grid { grid-template-columns: 1fr; }
      .subjects-grid { grid-template-columns: 1fr; }
      .modal-grid { grid-template-columns: 1fr; }
      .footer-container { grid-template-columns: 1fr; }
      .footer-bottom { flex-direction: column; gap: 0.5rem; text-align: center; }
    }
  `],
  template: `
    <app-navbar></app-navbar>

    <!-- HERO -->
    <section class="page-hero">
      <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1600&q=80" alt="Malla Curricular Plan de Estudios 2026-2033" class="hero-bg-image" />
      <div class="hero-overlay"></div>
      <div class="page-hero-container">
        <h1>Malla Curricular <span>Plan de Estudios 2026–2033</span></h1>
        <p>
          Explora la distribución de asignaturas del programa por semestres académicos o indaga la estructura a través de sus componentes, ciclos, tipologías y áreas de formación.
        </p>
      </div>
    </section>

    <!-- STATS RIBBON -->
    <section class="stats-ribbon">
      <div class="stats-container">
        <div class="stat-card">
          <div class="stat-icon stat-icon-subjects">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
          </div>
          <div>
            <div class="stat-value">63</div>
            <div class="stat-label">Asignaturas</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon stat-icon-credits">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="8" r="7"/>
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
            </svg>
          </div>
          <div>
            <div class="stat-value">144</div>
            <div class="stat-label">Créditos Académicos</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon stat-icon-semesters">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div>
            <div class="stat-value">9</div>
            <div class="stat-label">Semestres</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon stat-icon-areas">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </div>
          <div>
            <div class="stat-value">5</div>
            <div class="stat-label">Áreas de Formación</div>
          </div>
        </div>
      </div>
    </section>

    <!-- VIEW MODE TABS -->
    <div class="view-tabs-wrapper">
      <div class="view-tabs">
        <button
          class="view-tab"
          [class.active]="modoVista() === 'semestres'"
          (click)="cambiarModoVista('semestres')"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          Vista por Semestres
        </button>

        <button
          class="view-tab"
          [class.active]="modoVista() === 'categorias'"
          (click)="cambiarModoVista('categorias')"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 2 7 12 12 22 7 12 2"/>
            <polyline points="2 17 12 22 22 17"/>
            <polyline points="2 12 12 17 22 12"/>
          </svg>
          Explorador por Categorías
        </button>
      </div>
    </div>

    <!-- PAGE CONTENT -->
    <main class="page-content">

      <!-- MODO SEMESTRES -->
      @if (modoVista() === 'semestres') {
        <div class="semester-timeline">
          @for (semNum of [1,2,3,4,5,6,7,8,9]; track semNum) {
            <button
              class="timeline-node"
              [class.active]="semestreFiltro() === semNum"
              (click)="seleccionarSemestreFiltro(semNum)"
            >
              {{ semNum }}
            </button>
            @if (semNum < 9) {
              <div class="timeline-connector"></div>
            }
          }
          <button
            class="timeline-all-btn"
            [class.active]="semestreFiltro() === 0"
            (click)="seleccionarSemestreFiltro(0)"
          >
            Ver Todos
          </button>
        </div>

        @for (group of semestresAgrupados(); track group.numero) {
          <section class="semester-section">
            <div class="semester-header">
              <div class="semester-number">{{ group.numero }}</div>
              <div class="semester-title-group">
                <h3 class="semester-title">Semestre {{ group.numero }}</h3>
                <span class="semester-meta">{{ group.materias.length }} asignaturas · {{ group.totalCreditos }} créditos</span>
              </div>
              <span
                class="cycle-badge"
                [class.cycle-fund]="group.numero <= 3"
                [class.cycle-prof]="group.numero >= 4 && group.numero <= 6"
                [class.cycle-depth]="group.numero >= 7"
              >
                {{ group.numero <= 3 ? 'Fundamentación' : (group.numero <= 6 ? 'Profesional' : 'Profundización') }}
              </span>
            </div>

            <div class="subjects-grid">
              @for (asig of group.materias; track asig.codigo + asig.nombre) {
                <div
                  class="subject-card"
                  [attr.data-area]="asig.areaSigla"
                  (click)="abrirModalAsignatura(asig)"
                >
                  <div class="subject-card-header">
                    <span class="subject-code">{{ asig.codigo }}</span>
                    <span class="subject-credits" [attr.data-area]="asig.areaSigla">{{ asig.creditos }} Crd</span>
                  </div>
                  <h5 class="subject-name">{{ asig.nombre }}</h5>
                  <div class="subject-tags">
                    <span class="area-chip" [attr.data-area]="asig.areaSigla">{{ asig.areaSigla }}</span>
                    <span class="tipo-chip">{{ asig.tipologia }}</span>
                  </div>
                </div>
              }
            </div>
          </section>
        }
      }

      <!-- MODO CATEGORIAS -->
      @if (modoVista() === 'categorias') {
        <div class="categories-grid">
          @for (cat of categorias; track cat.id) {
            <div
              class="category-card"
              [class.active]="categoriaSeleccionada() === cat.id"
              (click)="seleccionarCategoria(cat.id)"
            >
              <div class="cat-icon" [class]="'cat-icon-' + cat.id">
                @if (cat.id === 'componentes') {
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                }
                @if (cat.id === 'ciclos') {
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                }
                @if (cat.id === 'tipologias') {
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>
                }
                @if (cat.id === 'areas') {
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                }
              </div>
              <div>
                <h4>{{ cat.titulo }}</h4>
                <p>{{ cat.subtitulo }}</p>
              </div>
              <span class="category-badge">{{ cat.conteo }} elementos</span>
            </div>
          }
        </div>

        <section class="explorer-section">
          <div class="explorer-header">
            <h3>{{ categoriaActualObj().titulo }}</h3>
            <p>{{ categoriaActualObj().descripcion }}</p>
          </div>

          <div class="sub-pills">
            @for (elem of subelementosActuales(); track elem.nombre) {
              <button
                class="sub-pill"
                [class.active]="subelementoSeleccionado() === elem.nombre"
                (click)="seleccionarSubelemento(elem.nombre)"
              >
                {{ elem.nombre }}
              </button>
            }
          </div>

          @if (subelementoInfo(); as info) {
            <div class="sub-info-card">
              <h4>{{ info.nombre }}</h4>
              <p>{{ info.descripcion }}</p>
            </div>
          }

          <h4 class="filtered-count">Asignaturas Asociadas ({{ asignaturasFiltradasCategorias().length }})</h4>

          <div class="subjects-grid">
            @for (asig of asignaturasFiltradasCategorias(); track asig.codigo + asig.nombre) {
              <div
                class="subject-card"
                [attr.data-area]="asig.areaSigla"
                (click)="abrirModalAsignatura(asig)"
              >
                <div class="subject-card-header">
                  <span class="subject-code">{{ asig.codigo }}</span>
                  <span class="subject-credits" [attr.data-area]="asig.areaSigla">{{ asig.creditos }} Crd</span>
                </div>
                <h5 class="subject-name">{{ asig.nombre }}</h5>
                <div class="subject-tags">
                  <span class="area-chip" [attr.data-area]="asig.areaSigla">{{ asig.areaSigla }}</span>
                  <span class="tipo-chip">{{ asig.tipologia }}</span>
                  <span class="tipo-chip">Sem {{ asig.semestre }}</span>
                </div>
              </div>
            }
          </div>
        </section>
      }
    </main>

    <!-- MODAL ASIGNATURA -->
    @if (asignaturaModal(); as asig) {
      <div class="modal-backdrop" (click)="cerrarModalAsignatura()">
        <div class="subject-modal" (click)="$event.stopPropagation()">
          <div class="modal-banner" [attr.data-area]="asig.areaSigla">
            <button class="btn-close-modal" (click)="cerrarModalAsignatura()">✕</button>
            <span class="modal-banner-code">{{ asig.codigo }}</span>
            <h3>{{ asig.nombre }}</h3>
            <p class="modal-banner-meta">
              {{ asig.creditos }} Créditos Académicos — Semestre {{ asig.semestre }}
            </p>
          </div>

          <div class="modal-body">
            <div class="modal-grid">
              <div class="modal-meta-item">
                <span class="modal-meta-label">Componente</span>
                <span class="modal-meta-value">{{ asig.componente }}</span>
              </div>
              <div class="modal-meta-item">
                <span class="modal-meta-label">Ciclo</span>
                <span class="modal-meta-value">{{ asig.ciclo }}</span>
              </div>
              <div class="modal-meta-item">
                <span class="modal-meta-label">Tipología</span>
                <span class="modal-meta-value">{{ asig.tipologia }}</span>
              </div>
              <div class="modal-meta-item">
                <span class="modal-meta-label">Área de Formación</span>
                <span class="modal-meta-value">{{ asig.areaSigla }} — {{ asig.areaNombre }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- FOOTER INSTITUCIONAL -->
    <footer class="landing-footer">
      <div class="footer-container">
        <div class="footer-brand">
          <h4>Universidad del Pacífico</h4>
          <p>
            Programa de Ingeniería de Sistemas — PISUNPA.<br>
            Buenaventura, Valle del Cauca, Colombia.
          </p>
        </div>

        <div class="footer-col">
          <h5>Navegación</h5>
          <ul class="footer-links">
            <li><a routerLink="/landing">Inicio</a></li>
            <li><a routerLink="/programa">El Programa</a></li>
            <li><a routerLink="/malla">Malla Curricular</a></li>
            <li><a routerLink="/docentes">Docentes</a></li>
            <li><a routerLink="/investigacion">Investigación</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h5>Acceso</h5>
          <ul class="footer-links">
            <li><a routerLink="/login">Iniciar Sesión</a></li>
            <li><a routerLink="/registro">Registrarse</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h5>Contacto</h5>
          <ul class="footer-links">
            <li><a href="https://www.unipacifico.edu.co/" target="_blank" rel="noopener">Portal Web UNPA</a></li>
            <li><a href="https://www.unipacifico.edu.co/p/9/comunicaciones/ingenieria-de-sistemas" target="_blank" rel="noopener">Ingeniería de Sistemas</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <span>© 2026 Universidad del Pacífico — Programa de Ingeniería de Sistemas. Todos los derechos reservados.</span>
        <span>PISUNPA — Buenaventura</span>
      </div>
    </footer>
  `
})
export class MallaComponent {
  modoVista = signal<'semestres' | 'categorias'>('semestres');
  semestreFiltro = signal<number>(0); // 0 = Ver todos los 9 semestres

  categoriaSeleccionada = signal<'componentes' | 'ciclos' | 'tipologias' | 'areas'>('componentes');
  subelementoSeleccionado = signal<string>('Desarrollo de Software');
  asignaturaModal = signal<AsignaturaMalla | null>(null);

  readonly categorias: CategoriaExplorador[] = [
    {
      id: 'componentes',
      titulo: 'Componentes de Formación',
      subtitulo: 'Ámbitos de conocimiento y competencias disciplinares',
      descripcion: 'Los componentes de formación agrupan las asignaturas de acuerdo con el ámbito de conocimientos y competencias que contribuyen a desarrollar durante la formación del Ingeniero de Sistemas.',
      conteo: 11
    },
    {
      id: 'ciclos',
      titulo: 'Ciclos de Formación',
      subtitulo: 'Etapas de progresión académica en el pensum',
      descripcion: 'Los ciclos representan las etapas de evolución en el desarrollo de competencias desde la fundamentación científica hasta la profundización profesional.',
      conteo: 3
    },
    {
      id: 'tipologias',
      titulo: 'Tipología de Asignaturas',
      subtitulo: 'Enfoque metodológico de la actividad académica',
      descripcion: 'La tipología de las asignaturas identifica el enfoque predominante de las actividades académicas y la forma en que se desarrollan los procesos de enseñanza y aprendizaje.',
      conteo: 3
    },
    {
      id: 'areas',
      titulo: 'Áreas de Formación',
      subtitulo: 'Clasificación por campo académico (CBI, FE, CB, FC, Nv)',
      descripcion: 'Las áreas de formación permiten identificar el campo académico al que pertenece cada asignatura dentro del plan de estudios.',
      conteo: 5
    }
  ];

  // BASE DE DATOS FIEL DE ASIGNATURAS DEL PLAN DE ESTUDIOS 2026-2033
  readonly asignaturasPlan: AsignaturaMalla[] = [
    // SEMESTRE 1
    { codigo: 'IS0102', nombre: 'Introducción a la Ingeniería de Sistemas', creditos: 2, semestre: 1, componente: 'Fundamentación', ciclo: 'Ciclo Fundamentación', tipologia: 'Teórica', areaSigla: 'FE', areaNombre: 'Formación Específica' },
    { codigo: 'IS0111', nombre: 'Algoritmia', creditos: 4, semestre: 1, componente: 'Ciencias Computacionales', ciclo: 'Ciclo Fundamentación', tipologia: 'Teórica Práctica', areaSigla: 'CBI', areaNombre: 'Ciencias Básicas de Ingeniería' },
    { codigo: '000000', nombre: 'Cátedra Omar Barona', creditos: 1, semestre: 1, componente: 'Unipacífico', ciclo: 'Ciclo Fundamentación', tipologia: 'Teórica', areaSigla: 'FC', areaNombre: 'Formación Complementaria' },
    { codigo: 'IS0112', nombre: 'Lógica Matemática', creditos: 3, semestre: 1, componente: 'Ciencias Básicas', ciclo: 'Ciclo Fundamentación', tipologia: 'Teórica Práctica', areaSigla: 'CBI', areaNombre: 'Ciencias Básicas de Ingeniería' },
    { codigo: '000000', nombre: 'Vida Sana', creditos: 1, semestre: 1, componente: 'Unipacífico', ciclo: 'Ciclo Fundamentación', tipologia: 'Práctica', areaSigla: 'FC', areaNombre: 'Formación Complementaria' },
    { codigo: 'IS0209', nombre: 'Matemáticas', creditos: 3, semestre: 1, componente: 'Ciencias Básicas', ciclo: 'Ciclo Fundamentación', tipologia: 'Teórica', areaSigla: 'CB', areaNombre: 'Ciencias Básicas' },
    { codigo: 'GE0102c', nombre: 'Lectura y Composición I', creditos: 2, semestre: 1, componente: 'Unipacífico', ciclo: 'Ciclo Fundamentación', tipologia: 'Teórica Práctica', areaSigla: 'FC', areaNombre: 'Formación Complementaria' },

    // SEMESTRE 2
    { codigo: 'IS0208', nombre: 'Teoría de Sistemas', creditos: 2, semestre: 2, componente: 'Fundamentación', ciclo: 'Ciclo Fundamentación', tipologia: 'Teórica', areaSigla: 'FE', areaNombre: 'Formación Específica' },
    { codigo: 'IS0207', nombre: 'Programación Orientada a Objetos', creditos: 3, semestre: 2, componente: 'Desarrollo de Software', ciclo: 'Ciclo Fundamentación', tipologia: 'Teórica Práctica', areaSigla: 'CBI', areaNombre: 'Ciencias Básicas de Ingeniería' },
    { codigo: '000000', nombre: 'Informática', creditos: 2, semestre: 2, componente: 'Fundamentación', ciclo: 'Ciclo Fundamentación', tipologia: 'Teórica Práctica', areaSigla: 'FC', areaNombre: 'Formación Complementaria' },
    { codigo: 'IS0201', nombre: 'Fundamentos de Investigación', creditos: 2, semestre: 2, componente: 'Investigación', ciclo: 'Ciclo Fundamentación', tipologia: 'Teórica', areaSigla: 'CBI', areaNombre: 'Ciencias Básicas de Ingeniería' },
    { codigo: 'IS0204', nombre: 'Álgebra Lineal', creditos: 3, semestre: 2, componente: 'Ciencias Básicas', ciclo: 'Ciclo Fundamentación', tipologia: 'Teórica', areaSigla: 'CB', areaNombre: 'Ciencias Básicas' },
    { codigo: 'GE0202C', nombre: 'Lectura y Composición II', creditos: 2, semestre: 2, componente: 'Unipacífico', ciclo: 'Ciclo Fundamentación', tipologia: 'Teórica Práctica', areaSigla: 'FC', areaNombre: 'Formación Complementaria' },
    { codigo: 'GE0103', nombre: 'Inglés I', creditos: 2, semestre: 2, componente: 'Unipacífico', ciclo: 'Ciclo Fundamentación', tipologia: 'Teórica Práctica', areaSigla: 'Nv', areaNombre: 'Nivelación' },

    // SEMESTRE 3
    { codigo: 'IS0312', nombre: 'Análisis de Sistemas', creditos: 2, semestre: 3, componente: 'Desarrollo de Software', ciclo: 'Ciclo Fundamentación', tipologia: 'Teórica Práctica', areaSigla: 'CBI', areaNombre: 'Ciencias Básicas de Ingeniería' },
    { codigo: 'IS0310', nombre: 'Estructura de Datos', creditos: 3, semestre: 3, componente: 'Ciencias Computacionales', ciclo: 'Ciclo Fundamentación', tipologia: 'Teórica Práctica', areaSigla: 'CBI', areaNombre: 'Ciencias Básicas de Ingeniería' },
    { codigo: 'IS0309', nombre: 'Electiva Institucional I', creditos: 2, semestre: 3, componente: 'Electivas', ciclo: 'Ciclo Fundamentación', tipologia: 'Teórica', areaSigla: 'FC', areaNombre: 'Formación Complementaria' },
    { codigo: 'IS0311', nombre: 'Administración de Empresas', creditos: 2, semestre: 3, componente: 'Gestión Organizacional', ciclo: 'Ciclo Fundamentación', tipologia: 'Teórica', areaSigla: 'FC', areaNombre: 'Formación Complementaria' },
    { codigo: 'GE0005', nombre: 'Cálculo Diferencial', creditos: 3, semestre: 3, componente: 'Ciencias Básicas', ciclo: 'Ciclo Fundamentación', tipologia: 'Teórica', areaSigla: 'CB', areaNombre: 'Ciencias Básicas' },
    { codigo: 'IS0203', nombre: 'Física Mecánica', creditos: 2, semestre: 3, componente: 'Ciencias Básicas', ciclo: 'Ciclo Fundamentación', tipologia: 'Teórica Práctica', areaSigla: 'CB', areaNombre: 'Ciencias Básicas' },
    { codigo: 'GE0203C', nombre: 'Inglés II', creditos: 2, semestre: 3, componente: 'Unipacífico', ciclo: 'Ciclo Fundamentación', tipologia: 'Teórica Práctica', areaSigla: 'Nv', areaNombre: 'Nivelación' },

    // SEMESTRE 4
    { codigo: 'IS0411', nombre: 'Diseño de Sistemas', creditos: 2, semestre: 4, componente: 'Desarrollo de Software', ciclo: 'Ciclo Profesional', tipologia: 'Teórica Práctica', areaSigla: 'FE', areaNombre: 'Formación Específica' },
    { codigo: 'IS0410', nombre: 'Bases de Datos', creditos: 3, semestre: 4, componente: 'Administración de Información', ciclo: 'Ciclo Profesional', tipologia: 'Teórica Práctica', areaSigla: 'FE', areaNombre: 'Formación Específica' },
    { codigo: 'IS0302', nombre: 'Contabilidad', creditos: 2, semestre: 4, componente: 'Gestión Organizacional', ciclo: 'Ciclo Profesional', tipologia: 'Teórica', areaSigla: 'FE', areaNombre: 'Formación Específica' },
    { codigo: 'IS0404', nombre: 'Probabilidad y Estadística', creditos: 2, semestre: 4, componente: 'Ciencias Básicas', ciclo: 'Ciclo Profesional', tipologia: 'Teórica', areaSigla: 'CBI', areaNombre: 'Ciencias Básicas de Ingeniería' },
    { codigo: 'IS0412', nombre: 'Mercadeo', creditos: 2, semestre: 4, componente: 'Gestión Organizacional', ciclo: 'Ciclo Profesional', tipologia: 'Teórica', areaSigla: 'FC', areaNombre: 'Formación Complementaria' },
    { codigo: 'GE0008', nombre: 'Cálculo Integral', creditos: 3, semestre: 4, componente: 'Ciencias Básicas', ciclo: 'Ciclo Profesional', tipologia: 'Teórica', areaSigla: 'CB', areaNombre: 'Ciencias Básicas' },
    { codigo: 'IS0304', nombre: 'Física Electromagnetismo', creditos: 2, semestre: 4, componente: 'Ciencias Básicas', ciclo: 'Ciclo Profesional', tipologia: 'Teórica Práctica', areaSigla: 'CBI', areaNombre: 'Ciencias Básicas de Ingeniería' },

    // SEMESTRE 5
    { codigo: 'IS0606', nombre: 'Ingeniería de Software', creditos: 2, semestre: 5, componente: 'Desarrollo de Software', ciclo: 'Ciclo Profesional', tipologia: 'Teórica Práctica', areaSigla: 'FE', areaNombre: 'Formación Específica' },
    { codigo: 'IS0704', nombre: 'Sistemas Operativos', creditos: 3, semestre: 5, componente: 'Ciencias Computacionales', ciclo: 'Ciclo Profesional', tipologia: 'Teórica Práctica', areaSigla: 'FE', areaNombre: 'Formación Específica' },
    { codigo: 'IS0504', nombre: 'Investigación de Operaciones', creditos: 2, semestre: 5, componente: 'Gestión Organizacional', ciclo: 'Ciclo Profesional', tipologia: 'Teórica Práctica', areaSigla: 'FE', areaNombre: 'Formación Específica' },
    { codigo: 'IS0610', nombre: 'Análisis Financiero', creditos: 2, semestre: 5, componente: 'Gestión Organizacional', ciclo: 'Ciclo Profesional', tipologia: 'Teórica', areaSigla: 'FE', areaNombre: 'Formación Específica' },
    { codigo: 'IS0602', nombre: 'Matemáticas Discretas', creditos: 3, semestre: 5, componente: 'Ciencias Básicas', ciclo: 'Ciclo Profesional', tipologia: 'Teórica', areaSigla: 'CB', areaNombre: 'Ciencias Básicas' },
    { codigo: 'IS0403', nombre: 'Electrónica Digital', creditos: 2, semestre: 5, componente: 'Redes y Comunicaciones', ciclo: 'Ciclo Profesional', tipologia: 'Teórica Práctica', areaSigla: 'CBI', areaNombre: 'Ciencias Básicas de Ingeniería' },
    { codigo: 'GE0303C', nombre: 'Inglés III', creditos: 2, semestre: 5, componente: 'Unipacífico', ciclo: 'Ciclo Profesional', tipologia: 'Teórica Práctica', areaSigla: 'Nv', areaNombre: 'Nivelación' },

    // SEMESTRE 6
    { codigo: 'IS0405', nombre: 'Calidad de Software', creditos: 3, semestre: 6, componente: 'Desarrollo de Software', ciclo: 'Ciclo Profesional', tipologia: 'Teórica Práctica', areaSigla: 'FE', areaNombre: 'Formación Específica' },
    { codigo: 'IS0613', nombre: 'Fundamentos de Redes', creditos: 3, semestre: 6, componente: 'Redes y Comunicaciones', ciclo: 'Ciclo Profesional', tipologia: 'Teórica Práctica', areaSigla: 'CBI', areaNombre: 'Ciencias Básicas de Ingeniería' },
    { codigo: 'IS0612', nombre: 'Electiva Institucional II', creditos: 2, semestre: 6, componente: 'Electivas', ciclo: 'Ciclo Profesional', tipologia: 'Teórica', areaSigla: 'FC', areaNombre: 'Formación Complementaria' },
    { codigo: 'IS0701', nombre: 'Formulación de Proyectos', creditos: 2, semestre: 6, componente: 'Gestión Organizacional', ciclo: 'Ciclo Profesional', tipologia: 'Teórica Práctica', areaSigla: 'FE', areaNombre: 'Formación Específica' },
    { codigo: 'IS0610', nombre: 'Análisis Numérico', creditos: 2, semestre: 6, componente: 'Ciencias Básicas', ciclo: 'Ciclo Profesional', tipologia: 'Teórica', areaSigla: 'CBI', areaNombre: 'Ciencias Básicas de Ingeniería' },
    { codigo: 'IS0611', nombre: 'Arquitectura de Hardware', creditos: 2, semestre: 6, componente: 'Redes y Comunicaciones', ciclo: 'Ciclo Profesional', tipologia: 'Teórica Práctica', areaSigla: 'FE', areaNombre: 'Formación Específica' },
    { codigo: 'IS0604', nombre: 'Ingeniería de Procesos', creditos: 2, semestre: 6, componente: 'Gestión Organizacional', ciclo: 'Ciclo Profesional', tipologia: 'Teórica', areaSigla: 'CBI', areaNombre: 'Ciencias Básicas de Ingeniería' },

    // SEMESTRE 7
    { codigo: 'IS0710', nombre: 'Arquitectura de Software', creditos: 2, semestre: 7, componente: 'Desarrollo de Software', ciclo: 'Ciclo Profundización', tipologia: 'Teórica Práctica', areaSigla: 'FE', areaNombre: 'Formación Específica' },
    { codigo: 'IS0605', nombre: 'Redes y Servicios', creditos: 3, semestre: 7, componente: 'Redes y Comunicaciones', ciclo: 'Ciclo Profundización', tipologia: 'Teórica Práctica', areaSigla: 'CB', areaNombre: 'Ciencias Básicas' },
    { codigo: 'IS0711', nombre: 'Electiva Profesional I', creditos: 2, semestre: 7, componente: 'Electivas', ciclo: 'Ciclo Profundización', tipologia: 'Teórica Práctica', areaSigla: 'FE', areaNombre: 'Formación Específica' },
    { codigo: 'IS0801', nombre: 'Gestión de Proyectos', creditos: 2, semestre: 7, componente: 'Gestión Organizacional', ciclo: 'Ciclo Profundización', tipologia: 'Teórica Práctica', areaSigla: 'FE', areaNombre: 'Formación Específica' },
    { codigo: 'IS0802', nombre: 'Simulación Computacional', creditos: 3, semestre: 7, componente: 'Ciencias Computacionales', ciclo: 'Ciclo Profundización', tipologia: 'Teórica Práctica', areaSigla: 'CB', areaNombre: 'Ciencias Básicas' },
    { codigo: 'IS0705', nombre: 'Laboratorio Tecnológico I', creditos: 2, semestre: 7, componente: 'Investigación', ciclo: 'Ciclo Profundización', tipologia: 'Práctica', areaSigla: 'FE', areaNombre: 'Formación Específica' },
    { codigo: 'IS0601', nombre: 'Ingeniería Económica', creditos: 2, semestre: 7, componente: 'Gestión Organizacional', ciclo: 'Ciclo Profundización', tipologia: 'Teórica', areaSigla: 'FC', areaNombre: 'Formación Complementaria' },

    // SEMESTRE 8
    { codigo: 'IS0806', nombre: 'Seminario Actualización Tecnológica I', creditos: 3, semestre: 8, componente: 'Electivas', ciclo: 'Ciclo Profundización', tipologia: 'Teórica Práctica', areaSigla: 'CBI', areaNombre: 'Ciencias Básicas de Ingeniería' },
    { codigo: 'IS0810', nombre: 'Electiva Profesional II', creditos: 2, semestre: 8, componente: 'Electivas', ciclo: 'Ciclo Profundización', tipologia: 'Teórica Práctica', areaSigla: 'FE', areaNombre: 'Formación Específica' },
    { codigo: 'IS0706', nombre: 'Inteligencia Artificial', creditos: 3, semestre: 8, componente: 'Ciencias Computacionales', ciclo: 'Ciclo Profundización', tipologia: 'Teórica Práctica', areaSigla: 'FE', areaNombre: 'Formación Específica' },
    { codigo: 'IS0812', nombre: 'Anteproyecto de Grado', creditos: 2, semestre: 8, componente: 'Investigación', ciclo: 'Ciclo Profundización', tipologia: 'Práctica', areaSigla: 'FE', areaNombre: 'Formación Específica' },
    { codigo: 'IS0801', nombre: 'Gestión de la Calidad', creditos: 2, semestre: 8, componente: 'Gestión Organizacional', ciclo: 'Ciclo Profundización', tipologia: 'Teórica', areaSigla: 'FC', areaNombre: 'Formación Complementaria' },
    { codigo: 'IS0805', nombre: 'Laboratorio Tecnológico II', creditos: 2, semestre: 8, componente: 'Investigación', ciclo: 'Ciclo Profundización', tipologia: 'Práctica', areaSigla: 'FE', areaNombre: 'Formación Específica' },
    { codigo: 'IS0702', nombre: 'Ingeniería Logística', creditos: 2, semestre: 8, componente: 'Logística', ciclo: 'Ciclo Profundización', tipologia: 'Teórica Práctica', areaSigla: 'FC', areaNombre: 'Formación Complementaria' },

    // SEMESTRE 9
    { codigo: 'IS0903', nombre: 'Seminario Actualización Tecnológica II', creditos: 3, semestre: 9, componente: 'Electivas', ciclo: 'Ciclo Profundización', tipologia: 'Teórica Práctica', areaSigla: 'FE', areaNombre: 'Formación Específica' },
    { codigo: 'IS1003', nombre: 'Seguridad Informática', creditos: 2, semestre: 9, componente: 'Redes y Comunicaciones', ciclo: 'Ciclo Profundización', tipologia: 'Teórica Práctica', areaSigla: 'FE', areaNombre: 'Formación Específica' },
    { codigo: 'IS0910', nombre: 'Electiva Profesional III', creditos: 2, semestre: 9, componente: 'Electivas', ciclo: 'Ciclo Profundización', tipologia: 'Teórica Práctica', areaSigla: 'FE', areaNombre: 'Formación Específica' },
    { codigo: 'IS1005', nombre: 'Proyecto de Grado', creditos: 3, semestre: 9, componente: 'Investigación', ciclo: 'Ciclo Profundización', tipologia: 'Práctica', areaSigla: 'FE', areaNombre: 'Formación Específica' },
    { codigo: 'IS09XX', nombre: 'Gestión Tecnológica', creditos: 2, semestre: 9, componente: 'Gestión Organizacional', ciclo: 'Ciclo Profundización', tipologia: 'Teórica', areaSigla: 'FC', areaNombre: 'Formación Complementaria' },
    { codigo: 'IS09N1', nombre: 'Laboratorio Tecnológico III', creditos: 2, semestre: 9, componente: 'Investigación', ciclo: 'Ciclo Profundización', tipologia: 'Práctica', areaSigla: 'FE', areaNombre: 'Formación Específica' },
    { codigo: 'ISO 911', nombre: 'Ética y Legislación', creditos: 2, semestre: 9, componente: 'Unipacífico', ciclo: 'Ciclo Profundización', tipologia: 'Teórica', areaSigla: 'FC', areaNombre: 'Formación Complementaria' }
  ];

  readonly subelementosPorCategoria: Record<string, { nombre: string; descripcion: string }[]> = {
    componentes: [
      { nombre: 'Fundamentación', descripcion: 'Asignaturas de introducción y fundamentos esenciales del ámbito de la ingeniería y los sistemas.' },
      { nombre: 'Unipacífico', descripcion: 'Formación institucional, lectura, competencias comunicativas, inglés e identidad universitaria.' },
      { nombre: 'Ciencias Básicas', descripcion: 'Formación en matemáticas, álgebra, cálculo, física e ingeniería fundamental.' },
      { nombre: 'Investigación', descripcion: 'Metodologías de investigación, laboratorios tecnológicos, anteproyecto y proyecto de grado.' },
      { nombre: 'Administración de Información', descripcion: 'Modelado, almacenamiento, estructuración y gobierno de datos relacionales y no relacionales.' },
      { nombre: 'Redes y Comunicaciones', descripcion: 'Infraestructura física, redes informáticas, arquitectura de hardware y seguridad.' },
      { nombre: 'Ciencias Computacionales', descripcion: 'Algoritmia, estructuras de datos, sistemas operativos e inteligencia artificial.' },
      { nombre: 'Gestión Organizacional', descripcion: 'Administración, finanzas, formulación de proyectos, evaluación e ingeniería de procesos.' },
      { nombre: 'Desarrollo de Software', descripcion: 'Análisis, diseño, arquitectura, calidad y construcción de soluciones de software.' },
      { nombre: 'Logística', descripcion: 'Modelos logísticos, ingeniería de cadena de suministro e impacto regional.' },
      { nombre: 'Electivas', descripcion: 'Asignaturas de electiva profesional e institucional de actualización tecnológica.' }
    ],
    ciclos: [
      { nombre: 'Ciclo de Fundamentación', descripcion: 'Comprende las asignaturas orientadas a desarrollar los conocimientos científicos, matemáticos y tecnológicos que sirven como base para la formación profesional (Semestres 1 a 3).' },
      { nombre: 'Ciclo Profesional', descripcion: 'Desarrollo intensivo de competencias disciplinares específicas en ingeniería de software, bases de datos, redes y gestión (Semestres 4 a 6).' },
      { nombre: 'Ciclo de Profundización', descripcion: 'Especialización avanzada, laboratorios tecnológicos, inteligencia artificial, proyectos de grado y electivas de profundización (Semestres 7 a 9).' }
    ],
    tipologias: [
      { nombre: 'Teórica', descripcion: 'La actividad académica se orienta a la fundamentación conceptual, discusión teórica y análisis de modelos.' },
      { nombre: 'Teórica Práctica', descripcion: 'Combina la fundamentación conceptual con la aplicación en laboratorios, talleres de desarrollo y proyectos prácticos.' },
      { nombre: 'Práctica', descripcion: 'Actividad predominantemente de laboratorio, trabajo de campo, anteproyecto y ejecución del proyecto de grado.' }
    ],
    areas: [
      { nombre: 'CBI — Ciencias Básicas de Ingeniería', descripcion: 'Área orientada a proporcionar los fundamentos científicos y tecnológicos necesarios para comprender y resolver problemas propios de la ingeniería.' },
      { nombre: 'FE — Formación Específica', descripcion: 'Área que desarrolla los conocimientos y competencias propias de la Ingeniería de Sistemas y su ejercicio profesional.' },
      { nombre: 'CB — Ciencias Básicas', descripcion: 'Área de fundamentación en matemáticas, física y cálculo científico.' },
      { nombre: 'FC — Formación Complementaria', descripcion: 'Área socio-humanística, ética, socio-empresarial y gestión de calidad.' },
      { nombre: 'Nv — Nivelación', descripcion: 'Asignaturas de nivelación y suficiencia en idioma extranjero.' }
    ]
  };

  cambiarModoVista(modo: 'semestres' | 'categorias'): void {
    this.modoVista.set(modo);
  }

  seleccionarSemestreFiltro(sem: number): void {
    this.semestreFiltro.set(sem);
  }

  semestresAgrupados = computed(() => {
    const semSelected = this.semestreFiltro();
    const semestresValidos = semSelected === 0 ? [1, 2, 3, 4, 5, 6, 7, 8, 9] : [semSelected];

    return semestresValidos.map(semNum => {
      const materias = this.asignaturasPlan.filter(a => a.semestre === semNum);
      const totalCreditos = materias.reduce((acc, curr) => acc + curr.creditos, 0);
      return {
        numero: semNum,
        materias,
        totalCreditos
      };
    });
  });

  seleccionarCategoria(catId: 'componentes' | 'ciclos' | 'tipologias' | 'areas'): void {
    this.categoriaSeleccionada.set(catId);
    const subs = this.subelementosPorCategoria[catId];
    if (subs && subs.length > 0) {
      this.subelementoSeleccionado.set(subs[0].nombre);
    }
  }

  seleccionarSubelemento(nombre: string): void {
    this.subelementoSeleccionado.set(nombre);
  }

  categoriaActualObj(): CategoriaExplorador {
    return this.categorias.find(c => c.id === this.categoriaSeleccionada()) || this.categorias[0];
  }

  subelementosActuales(): { nombre: string; descripcion: string }[] {
    return this.subelementosPorCategoria[this.categoriaSeleccionada()] || [];
  }

  subelementoInfo(): { nombre: string; descripcion: string } | null {
    const sel = this.subelementoSeleccionado();
    return this.subelementosActuales().find(s => s.nombre === sel) || null;
  }

  asignaturasFiltradasCategorias = computed(() => {
    const cat = this.categoriaSeleccionada();
    const sub = this.subelementoSeleccionado();

    return this.asignaturasPlan.filter(asig => {
      if (cat === 'componentes') {
        return asig.componente === sub;
      }
      if (cat === 'ciclos') {
        return asig.ciclo === sub;
      }
      if (cat === 'tipologias') {
        return asig.tipologia === sub;
      }
      if (cat === 'areas') {
        const areaSigla = sub.split(' ')[0];
        return asig.areaSigla === areaSigla;
      }
      return true;
    });
  });

  abrirModalAsignatura(asig: AsignaturaMalla): void {
    this.asignaturaModal.set(asig);
  }

  cerrarModalAsignatura(): void {
    this.asignaturaModal.set(null);
  }

  obtenerClaseArea(areaSigla: AsignaturaMalla['areaSigla']): string {
    switch (areaSigla) {
      case 'CBI': return 'chip-area-cbi';
      case 'FE': return 'chip-area-fe';
      case 'CB': return 'chip-area-cb';
      case 'FC': return 'chip-area-fc';
      case 'Nv': return 'chip-area-nv';
      default: return 'chip-area-fe';
    }
  }
}