import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

interface IntegranteEquipo {
  nombre: string;
  cargo: string;
  area: string;
  descripcion: string;
  fotoUrl: string;
  esLider?: boolean;
  perfilCompleto?: string;
  titulos?: string[];
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

    :host {
      display: block;
      width: 100%;
      min-height: 100vh;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: #ffffff;
      color: #0f172a;
      overflow-x: hidden;

      --color-primary: #15803d;
      --color-primary-dark: #14532d;
      --color-ink: #0f172a;
      --color-muted: #64748b;
      --color-border: #e2e8f0;
      --color-surface: #f8fafc;
    }

    /* ===== NAVBAR (sin cambios) ===== */
    .landing-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      background: rgba(255, 255, 255, 0.96);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid #e2e8f0;
      padding: 0.85rem 2.5rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
      transition: all 0.3s ease;
    }

    .header-container {
      max-width: 1280px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .brand-group {
      display: flex;
      align-items: center;
      gap: 1rem;
      text-decoration: none;
    }

    .brand-logo-img {
      height: 48px;
      width: auto;
      object-fit: contain;
    }

    .brand-text {
      display: flex;
      flex-direction: column;
    }

    .brand-title-small {
      color: #0f172a;
      font-size: 1rem;
      font-weight: 900;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      line-height: 1.15;
    }

    .brand-sub-small {
      color: #15803d;
      font-size: 0.74rem;
      font-weight: 700;
    }

    .nav-menu {
      display: flex;
      align-items: center;
      gap: 1.8rem;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .nav-menu a {
      color: #475569;
      text-decoration: none;
      font-size: 0.88rem;
      font-weight: 600;
      transition: color 0.2s ease;
      cursor: pointer;
    }

    .nav-menu a:hover {
      color: #15803d;
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 0.85rem;
    }

    .btn-login-outline {
      padding: 0.55rem 1.35rem;
      border: 2px solid #15803d;
      border-radius: 8px;
      color: #15803d;
      font-size: 0.88rem;
      font-weight: 700;
      text-decoration: none;
      transition: all 0.25s ease;
      background: transparent;
    }

    .btn-login-outline:hover {
      background: #15803d;
      color: #ffffff;
      transform: translateY(-1px);
    }

    .btn-register-solid {
      padding: 0.6rem 1.35rem;
      background: linear-gradient(135deg, #15803d 0%, #166534 100%);
      color: #ffffff;
      border-radius: 8px;
      font-size: 0.88rem;
      font-weight: 700;
      text-decoration: none;
      box-shadow: 0 4px 14px rgba(21, 128, 61, 0.4);
      transition: all 0.25s ease;
    }

    .btn-register-solid:hover {
      background: linear-gradient(135deg, #166534 0%, #14532d 100%);
      transform: translateY(-1px);
      box-shadow: 0 6px 18px rgba(21, 128, 61, 0.55);
    }

    /* ===== HERO SECTION (sin cambios) ===== */
    .hero-section {
      position: relative;
      min-height: 90vh;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 8.5rem 4rem 5rem;
      background: #0f172a;
      box-sizing: border-box;
      overflow: hidden;
    }

    .hero-bg-image {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 1;
      display: block;
    }

    .hero-container {
      position: relative;
      z-index: 10;
      max-width: 600px;
      margin: 0;
      text-align: left;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .hero-title {
      font-size: 3.4rem;
      font-weight: 900;
      color: #ffffff;
      letter-spacing: -0.035em;
      line-height: 1.1;
      margin-bottom: 1.25rem;
      max-width: 580px;
      text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
      text-align: left;
    }

    .hero-title span {
      color: #4ade80;
    }

    .hero-slogan-text {
      font-size: 1.02rem;
      font-style: italic;
      color: #4ade80;
      font-weight: 600;
      max-width: 550px;
      margin: 0;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.6);
      line-height: 1.5;
      text-align: left;
    }

    /* ===========================================================
       CUERPO — REDISEÑADO
       =========================================================== */

    .editorial-section {
      padding: 6rem 2rem;
      max-width: 1240px;
      margin: 0 auto;
    }

    .section-divider {
      height: 1px;
      background: linear-gradient(90deg, transparent 0%, #e2e8f0 50%, transparent 100%);
      margin: 5rem 0;
    }

    .feature-tag {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8rem;
      font-weight: 800;
      color: #15803d;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .feature-title {
      font-size: 2.2rem;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.2;
      letter-spacing: -0.02em;
    }

    .feature-description {
      font-size: 1.05rem;
      color: #475569;
      line-height: 1.65;
    }

    /* ===== ACERCA DE — intro a ancho completo, ya no grid falso ===== */
    .about-section { margin-bottom: 1rem; }

    .about-intro {
      display: flex;
      flex-direction: column;
      gap: 1.1rem;
      max-width: 680px;
      margin-bottom: 3rem;
    }

    .about-cards-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.75rem;
    }

    .about-card {
      background: #ffffff;
      border: 1px solid var(--color-border);
      border-radius: 16px;
      padding: 1.85rem 1.6rem;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .about-card-icon {
      width: 42px;
      height: 42px;
      border-radius: 10px;
      background: #f0fdf4;
      color: #15803d;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.25rem;
    }

    .about-card-icon svg { width: 21px; height: 21px; }

    .about-card h4 { font-size: 1.05rem; font-weight: 800; color: #0f172a; margin-bottom: 0.55rem; }
    .about-card p { font-size: 0.87rem; color: #64748b; line-height: 1.6; margin: 0; }

    /* ===== EQUIPO — spotlight de líder + agrupado por área ===== */
    .team-section {
      margin-top: 5rem;
      padding-top: 4rem;
      border-top: 1px solid var(--color-border);
    }

    .team-section-header { max-width: 620px; margin-bottom: 2.5rem; display: flex; flex-direction: column; gap: 0.55rem; }
    .team-section-header h3 { font-size: 1.7rem; font-weight: 800; color: #0f172a; letter-spacing: -0.015em; }
    .team-section-header p { font-size: 0.95rem; color: #64748b; }

    .leader-card {
      display: flex;
      align-items: center;
      gap: 2rem;
      padding: 2.25rem 2.5rem;
      border: 1.5px solid #bbf7d0;
      border-radius: 20px;
      background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
      cursor: pointer;
      transition: border-color 0.2s ease;
      margin-bottom: 3.5rem;
    }
    .leader-card:hover { border-color: var(--color-primary); }

    .leader-photo {
      width: 96px;
      height: 96px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid #15803d;
      flex-shrink: 0;
    }

    .leader-info h4 { font-size: 1.35rem; font-weight: 800; color: #0f172a; margin-bottom: 0.3rem; }
    .leader-role { font-size: 0.8rem; font-weight: 800; color: #15803d; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.7rem; }
    .leader-desc { font-size: 0.94rem; color: #475569; line-height: 1.6; max-width: 640px; margin-bottom: 0.9rem; }
    .leader-cta { display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.83rem; font-weight: 800; color: #15803d; }

    .area-group { margin-bottom: 2.5rem; }
    .area-group:last-child { margin-bottom: 0; }

    .area-label { display: flex; align-items: baseline; gap: 0.6rem; margin-bottom: 1.15rem; }
    .area-label .dot { width: 7px; height: 7px; border-radius: 50%; background: #15803d; flex-shrink: 0; }
    .area-label .area-name { font-size: 0.78rem; font-weight: 800; color: #15803d; text-transform: uppercase; letter-spacing: 0.08em; }
    .area-label .area-count { font-size: 0.78rem; color: #94a3b8; font-weight: 600; }

    .area-people-row {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.15rem;
    }

    .person-card {
      background: #ffffff;
      border: 1px solid var(--color-border);
      border-radius: 16px;
      padding: 1.4rem;
      display: flex;
      flex-direction: column;
      gap: 0.9rem;
      cursor: pointer;
      transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
    }
    .person-card:hover {
      border-color: var(--color-primary);
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
    }

    .person-top { display: flex; align-items: center; gap: 0.85rem; }

    .person-photo-img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
      flex-shrink: 0;
      box-shadow: 0 0 0 2px #ffffff, 0 0 0 3px var(--color-border);
    }
    .person-card:hover .person-photo-img { box-shadow: 0 0 0 2px #ffffff, 0 0 0 3px var(--color-primary); }

    .person-info h5 { font-size: 0.92rem; font-weight: 800; color: #0f172a; margin-bottom: 0.1rem; line-height: 1.3; }
    .person-role { font-size: 0.72rem; font-weight: 700; color: #15803d; }

    .person-desc { font-size: 0.82rem; color: #64748b; line-height: 1.55; margin: 0; }
    .person-cta { font-size: 0.75rem; font-weight: 800; color: #15803d; margin-top: auto; }

    /* ===== FEATURE ROWS (Supletorios / Egresados) ===== */
    .feature-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
    }

    .feature-row.reverse { direction: rtl; }
    .feature-row.reverse .feature-content { direction: ltr; }

    .feature-content { display: flex; flex-direction: column; gap: 1.25rem; }

    .feature-highlights { display: flex; flex-direction: column; gap: 1rem; margin-top: 0.5rem; }

    .highlight-item { display: flex; align-items: flex-start; gap: 0.85rem; }

    .highlight-icon {
      width: 24px;
      height: 24px;
      border-radius: 6px;
      background: #dcfce7;
      color: #15803d;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 2px;
    }
    .highlight-icon svg { width: 14px; height: 14px; }

    .highlight-text { font-size: 0.95rem; color: #334155; font-weight: 600; line-height: 1.4; }

    /* Showcase Visual Panel */
    .showcase-panel {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 20px;
      padding: 2.75rem;
    }

    .showcase-panel-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.75rem; }

    .showcase-badge-icon {
      width: 42px;
      height: 42px;
      border-radius: 12px;
      background: #15803d;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .showcase-badge-icon svg { width: 21px; height: 21px; }

    .showcase-panel-title { font-size: 1.15rem; font-weight: 800; color: #0f172a; }

    /* Flujo de pasos reales (proceso secuencial) con línea conectora */
    .step-flow { position: relative; display: flex; flex-direction: column; gap: 1.1rem; }
    .step-flow::before {
      content: '';
      position: absolute;
      left: 16px;
      top: 22px;
      bottom: 22px;
      width: 2px;
      background: #bbf7d0;
    }

    .step-box {
      position: relative;
      background: #ffffff;
      border: 1px solid var(--color-border);
      border-radius: 12px;
      padding: 1.05rem 1.3rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      z-index: 1;
    }

    .step-num {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #15803d;
      color: #ffffff;
      font-size: 0.85rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .step-info h5 { font-size: 0.95rem; font-weight: 700; color: #0f172a; margin-bottom: 0.15rem; }
    .step-info p { font-size: 0.82rem; color: #64748b; margin: 0; }

    /* Lista de funcionalidades paralelas (no es un proceso, no lleva numeración) */
    .chip-feature-list { display: flex; flex-direction: column; gap: 1rem; }

    .chip-feature-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: #ffffff;
      border: 1px solid var(--color-border);
      border-radius: 12px;
      padding: 1.05rem 1.3rem;
    }

    .chip-feature-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: #f0fdf4;
      color: #15803d;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .chip-feature-icon svg { width: 18px; height: 18px; }

    .chip-feature-row h5 { font-size: 0.95rem; font-weight: 700; color: #0f172a; margin-bottom: 0.15rem; }
    .chip-feature-row p { font-size: 0.82rem; color: #64748b; margin: 0; }

    /* ===== FOOTER (sin cambios) ===== */
    .landing-footer {
      background: linear-gradient(135deg, #15803d 0%, #14532d 100%);
      color: #ffffff;
      padding: 4.5rem 2rem 2.5rem;
      border-top: 1px solid #166534;
    }

    .footer-container {
      max-width: 1240px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 3.5rem;
      margin-bottom: 3.5rem;
    }

    .footer-brand h4 {
      color: #ffffff;
      font-size: 1.3rem;
      font-weight: 900;
      margin-bottom: 0.85rem;
      letter-spacing: -0.01em;
    }

    .footer-brand p {
      color: rgba(255, 255, 255, 0.85);
      font-size: 0.9rem;
      line-height: 1.65;
      max-width: 350px;
    }

    .footer-col h5 {
      color: #ffffff;
      font-size: 0.9rem;
      font-weight: 800;
      margin-bottom: 1.25rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .footer-links a, .footer-links button {
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.9rem;
      text-decoration: none;
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      text-align: left;
      font-family: inherit;
      transition: color 0.2s ease;
    }

    .footer-links a:hover, .footer-links button:hover {
      color: #ffffff;
      text-decoration: underline;
    }

    .footer-bottom {
      max-width: 1240px;
      margin: 0 auto;
      padding-top: 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.15);
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.75);
    }

    /* MODAL INTEGRANTES */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 200;
      background: rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      animation: fadeIn 0.3s ease;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .team-modal {
      background: #ffffff;
      border-radius: 24px;
      max-width: 750px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      position: relative;
      animation: slideUp 0.3s ease;
    }
    .modal-header-banner {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      padding: 3rem 3rem 2.5rem;
      color: #ffffff;
      position: relative;
      border-top-left-radius: 24px;
      border-top-right-radius: 24px;
      display: flex;
      align-items: center;
      gap: 2rem;
    }
    .btn-close-modal {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 1.2rem;
      transition: all 0.2s;
    }
    .btn-close-modal:hover { background: rgba(255, 255, 255, 0.25); transform: rotate(90deg); }
    .modal-person-photo { width: 110px; height: 110px; border-radius: 50%; object-fit: cover; border: 4px solid #4ade80; flex-shrink: 0; box-shadow: 0 8px 20px rgba(0,0,0,0.3); }
    .modal-person-title h3 { font-size: 1.8rem; font-weight: 900; color: #ffffff; margin-bottom: 0.4rem; letter-spacing: -0.02em; }
    .modal-person-title p { font-size: 1rem; color: #4ade80; font-weight: 700; margin-bottom: 0.5rem; }
    .modal-body-content { padding: 3rem; display: flex; flex-direction: column; gap: 2.5rem; }
    .modal-section-block h5 { font-size: 0.95rem; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem; }
    .modal-section-block h5::before { content: ''; width: 24px; height: 3px; background: #15803d; border-radius: 2px; }
    .modal-section-block p { font-size: 1rem; color: #334155; line-height: 1.75; white-space: pre-wrap; }

    /* RESPONSIVE */
    @media (max-width: 1024px) {
      .hero-title { font-size: 2.8rem; }
      .feature-row { grid-template-columns: 1fr; gap: 2.5rem; }
      .feature-row.reverse { direction: ltr; }
      .about-cards-grid { grid-template-columns: 1fr 1fr; }
      .leader-card { flex-direction: column; align-items: flex-start; text-align: left; }
      .footer-container { grid-template-columns: 1fr 1fr; }
    }

    @media (max-width: 640px) {
      .landing-header { padding: 0.75rem 1.25rem; }
      .nav-menu { display: none; }
      .hero-title { font-size: 2.2rem; }
      .about-cards-grid { grid-template-columns: 1fr; }
      .area-people-row { grid-template-columns: 1fr; }
      .footer-container { grid-template-columns: 1fr; }
    }
  `],
  template: `
    <!-- NAVBAR -->
    <header class="landing-header">
      <div class="header-container">
        <a routerLink="/" class="brand-group">
          <img src="assets/images/logo_unpa.png" alt="Logo Universidad del Pacífico" class="brand-logo-img" />
          <div class="brand-text">
            <span class="brand-title-small">Universidad del Pacífico</span>
            <span class="brand-sub-small">Ingeniería de Sistemas — PISUNPA</span>
          </div>
        </a>

        <nav>
          <ul class="nav-menu">
            <li><a (click)="scrollToSection('inicio', $event)">Inicio</a></li>
            <li><a routerLink="/programa">El Programa</a></li>
            <li><a routerLink="/malla">Malla Curricular</a></li>
            <li><a routerLink="/docentes">Docentes</a></li>
            <li><a routerLink="/investigacion">Investigación</a></li>
          </ul>
        </nav>

        <div class="nav-actions">
          <a routerLink="/login" class="btn-login-outline">Iniciar Sesión</a>
          <a routerLink="/registro" class="btn-register-solid">Registrarse</a>
        </div>
      </div>
    </header>

    <!-- HERO SECTION -->
    <section id="inicio" class="hero-section">
      <img src="assets/images/fondo_landing.png" alt="Fondo Universidad del Pacífico" class="hero-bg-image" />

      <div class="hero-container">
        <h1 class="hero-title">
          Sistema de Gestión de <span>Egresados</span>
        </h1>

        <p class="hero-slogan-text">
          "Innovar no es una opción, es nuestro próximo paso. ¡Construyamos juntos el futuro!"
        </p>
      </div>
    </section>

    <!-- CUERPO -->
    <main class="editorial-section">
      <!-- SECCIÓN: ACERCA DE -->
      <section id="acerca" class="about-section">
        <div class="about-intro">
          <span class="feature-tag">Programa Académico</span>
          <h2 class="feature-title">Acerca de la Plataforma PISUNPA</h2>
          <p class="feature-description">
            Plataforma web del Programa de Ingeniería de Sistemas desarrollada para gestionar las solicitudes de exámenes supletorios y el registro de egresados de la Universidad del Pacífico.
          </p>
        </div>

        <div class="about-cards-grid">
          <div class="about-card">
            <div class="about-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <h4>Solicitud de Supletorios</h4>
            <p>Radicación de supletorios por los estudiantes con soporte de pago, revisión de secretaría y calificación docente.</p>
          </div>

          <div class="about-card">
            <div class="about-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
              </svg>
            </div>
            <h4>Registro de Egresados</h4>
            <p>Registro y actualización de información personal y profesional para los graduados de Ingeniería de Sistemas.</p>
          </div>

          <div class="about-card">
            <div class="about-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h4>Gestión Docente y Secretaría</h4>
            <p>Aprobación administrativa de solicitudes y registro de calificaciones definitivas en el sistema.</p>
          </div>
        </div>

        <!-- EQUIPO: LÍDER + AGRUPADO POR ÁREA -->
        <div class="team-section">
          <div class="team-section-header">
            <span class="feature-tag">Equipo Desarrollador</span>
            <h3>Integrantes del Proyecto PISUNPA</h3>
            <p>Docente asesor y los 8 estudiantes desarrolladores responsables de la creación de la plataforma. Toca cualquier perfil para ver más.</p>
          </div>

          <!-- DOCENTE ASESOR -->
          <div class="leader-card" (click)="abrirModal(docenteLider)">
            <img [src]="docenteLider.fotoUrl" [alt]="docenteLider.nombre" class="leader-photo" />
            <div class="leader-info">
              <h4>{{ docenteLider.nombre }}</h4>
              <span class="leader-role">{{ docenteLider.cargo }}</span>
              <p class="leader-desc">{{ docenteLider.descripcion }}</p>
              <span class="leader-cta">
                Ver perfil completo
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </span>
            </div>
          </div>

          <!-- ESTUDIANTES AGRUPADOS POR ÁREA -->
          @for (grupo of equipoPorArea; track grupo.area) {
            <div class="area-group">
              <div class="area-label">
                <span class="dot"></span>
                <span class="area-name">{{ grupo.area }}</span>
                <span class="area-count">{{ grupo.personas.length }} {{ grupo.personas.length === 1 ? 'integrante' : 'integrantes' }}</span>
              </div>

              <div class="area-people-row">
                @for (estudiante of grupo.personas; track estudiante.nombre) {
                  <div class="person-card" (click)="abrirModal(estudiante)">
                    <div class="person-top">
                      <img [src]="estudiante.fotoUrl" [alt]="estudiante.nombre" class="person-photo-img" />
                      <div class="person-info">
                        <h5>{{ estudiante.nombre }}</h5>
                        <span class="person-role">{{ estudiante.cargo }}</span>
                      </div>
                    </div>
                    <p class="person-desc">{{ estudiante.descripcion }}</p>
                    <span class="person-cta">Ver perfil →</span>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      </section>

      <div class="section-divider"></div>

      <!-- ROW 1: SUPLETORIOS (proceso real → pasos numerados con línea) -->
      <section id="supletorios" class="feature-row">
        <div class="feature-content">
          <span class="feature-tag">Módulo Académico</span>
          <h2 class="feature-title">Gestión Digital de Exámenes Supletorios</h2>
          <p class="feature-description">
            Un flujo estructurado e integrado que permite a los estudiantes radicar solicitudes, verificar el estado de pago, obtener aprobación de Secretaría Académica y permitir la calificación por parte de los docentes.
          </p>

          <div class="feature-highlights">
            <div class="highlight-item">
              <div class="highlight-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <span class="highlight-text">Radicación en línea con selección de asignatura y docente responsable</span>
            </div>

            <div class="highlight-item">
              <div class="highlight-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <span class="highlight-text">Verificación y aprobación transparente por Secretaría y Dirección</span>
            </div>

            <div class="highlight-item">
              <div class="highlight-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <span class="highlight-text">Bandeja docente para asignación y registro de notas definitivas</span>
            </div>
          </div>
        </div>

        <div class="showcase-panel">
          <div class="showcase-panel-header">
            <div class="showcase-badge-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
            <h3 class="showcase-panel-title">Flujo del Supletorio</h3>
          </div>

          <div class="step-flow">
            <div class="step-box">
              <div class="step-num">1</div>
              <div class="step-info">
                <h5>Radicación Estudiantil</h5>
                <p>Ingreso de asignatura, fecha y comprobante de pago.</p>
              </div>
            </div>

            <div class="step-box">
              <div class="step-num">2</div>
              <div class="step-info">
                <h5>Aprobación Administrativa</h5>
                <p>Revisión por Secretaría y asignación al profesor.</p>
              </div>
            </div>

            <div class="step-box">
              <div class="step-num">3</div>
              <div class="step-info">
                <h5>Evaluación y Nota</h5>
                <p>Aplicación de prueba y registro directo de calificación.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="section-divider"></div>

      <!-- ROW 2: EGRESADOS (funcionalidades paralelas → lista sin numerar) -->
      <section id="egresados" class="feature-row reverse">
        <div class="feature-content">
          <span class="feature-tag">Red Institucional</span>
          <h2 class="feature-title">Portal y Seguimiento a Egresados</h2>
          <p class="feature-description">
            Espacio dedicado a mantener el vínculo entre los graduados de Ingeniería de Sistemas y la Universidad del Pacífico, facilitando la actualización de perfiles profesionales, eventos y analítica institucional.
          </p>

          <div class="feature-highlights">
            <div class="highlight-item">
              <div class="highlight-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <span class="highlight-text">Registro de perfil profesional e historia ocupacional</span>
            </div>

            <div class="highlight-item">
              <div class="highlight-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <span class="highlight-text">Convocatorias y notificaciones de eventos académicos</span>
            </div>

            <div class="highlight-item">
              <div class="highlight-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <span class="highlight-text">Tableros de control y analítica para la Coordinación de Egresados</span>
            </div>
          </div>
        </div>

        <div class="showcase-panel">
          <div class="showcase-panel-header">
            <div class="showcase-badge-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h3 class="showcase-panel-title">Comunidad Egresada</h3>
          </div>

          <div class="chip-feature-list">
            <div class="chip-feature-row">
              <div class="chip-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a8 8 0 0 1 16 0v1"/></svg>
              </div>
              <div>
                <h5>Perfil de Graduado</h5>
                <p>Información laboral actualizada y contacto continuo.</p>
              </div>
            </div>

            <div class="chip-feature-row">
              <div class="chip-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <div>
                <h5>Eventos y Talleres</h5>
                <p>Notificaciones a correo e inscripción activa.</p>
              </div>
            </div>

            <div class="chip-feature-row">
              <div class="chip-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
              </div>
              <div>
                <h5>Informes e Impacto</h5>
                <p>Distribución geográfica y consolidado institucional.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- MODAL INTEGRANTE EQUIPO -->
    @if (integranteSeleccionado) {
      <div class="modal-backdrop" (click)="cerrarModal()">
        <div class="team-modal" (click)="$event.stopPropagation()">
          <div class="modal-header-banner">
            <button class="btn-close-modal" (click)="cerrarModal()">✕</button>
            <img [src]="integranteSeleccionado.fotoUrl" [alt]="integranteSeleccionado.nombre" class="modal-person-photo" />
            <div class="modal-person-title">
              <h3>{{ integranteSeleccionado.nombre }}</h3>
              <p>{{ integranteSeleccionado.cargo }}</p>
              <span style="color: #94a3b8; font-size: 0.85rem; font-weight: 700;">{{ integranteSeleccionado.area }}</span>
            </div>
          </div>
          <div class="modal-body-content">
            <div class="modal-section-block">
              <h5>Perfil & Contribución al Proyecto</h5>
              <p>{{ integranteSeleccionado.perfilCompleto || integranteSeleccionado.descripcion }}</p>
            </div>
            @if (integranteSeleccionado.titulos && integranteSeleccionado.titulos.length > 0) {
              <div class="modal-section-block">
                <h5>Títulos y Grados Académicos</h5>
                <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.85rem;">
                  @for (t of integranteSeleccionado.titulos; track t) {
                    <li style="font-size: 0.95rem; color: #334155; font-weight: 500; display: flex; align-items: flex-start; gap: 0.75rem; line-height: 1.5;"><span style="font-size: 1.1rem; flex-shrink: 0; margin-top: -0.1rem;">🎓</span> {{ t }}</li>
                  }
                </ul>
              </div>
            }
          </div>
        </div>
      </div>
    }

    <!-- FOOTER (VERDE INSTITUCIONAL ELEGANTE) -->
    <footer id="contacto" class="landing-footer">
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
            <li><button (click)="scrollToSection('inicio', $event)">Inicio</button></li>
            <li><a routerLink="/programa">El Programa</a></li>
            <li><a routerLink="/docentes">Docentes</a></li>
            <li><a routerLink="/investigacion">Investigación</a></li>
            <li><button (click)="scrollToSection('supletorios', $event)">Supletorios</button></li>
            <li><button (click)="scrollToSection('egresados', $event)">Egresados</button></li>
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
export class LandingComponent {
  integranteSeleccionado: IntegranteEquipo | null = null;

  readonly docenteLider: IntegranteEquipo = {
    nombre: 'MSc. Wilman A. Quiñónez Valencia',
    cargo: 'Líder del Proyecto & Docente Asesor',
    area: 'Gestor del Proyecto 51',
    descripcion: 'Líder y gestor del Proyecto 51. Especialista en ciencia de datos, inteligencia artificial e innovación tecnológica.',
    fotoUrl: 'assets/images/desarrolladores/Wilman.jpeg',
    esLider: true,
    perfilCompleto: `Ingeniero de Sistemas y egresado del Programa de Ingeniería de Sistemas de la Universidad del Pacífico, institución en la que actualmente se desempeña como docente universitario, contribuyendo a la formación de profesionales competentes en las áreas de desarrollo de software, ciencia de datos, inteligencia artificial e innovación tecnológica.

Es Magíster en Ciencia de Datos y Magíster en Inteligencia Artificial Aplicada por la Universidad Icesi, formación que ha fortalecido sus competencias en analítica avanzada, aprendizaje automático, inteligencia artificial, ingeniería de datos, transformación digital y desarrollo de soluciones tecnológicas basadas en datos para la toma de decisiones.

Como docente del Programa de Ingeniería de Sistemas, ha orientado diversas asignaturas enfocadas en el fortalecimiento de las competencias profesionales de los estudiantes. Entre ellas se destaca la Asignatura Electiva Profesional III, espacio académico desde el cual lideró la concepción, estructuración e implementación del Proyecto 51, una estrategia de aprendizaje basada en proyectos (Project-Based Learning) que busca integrar los conocimientos adquiridos durante la carrera mediante el desarrollo de soluciones tecnológicas aplicadas a necesidades reales de la Universidad y del entorno.

En este contexto, es líder y gestor del Proyecto 51, iniciativa académica que promueve el trabajo colaborativo, la investigación aplicada y la innovación como pilares fundamentales de la formación profesional. Como resultado de este proceso se consolidó la primera sub-línea denominada PISUNPA (Plataforma Integral de Servicios de la Universidad del Pacífico).

Bajo su liderazgo, el Proyecto 51 ha permitido que estudiantes de diferentes semestres participen en equipos multidisciplinarios para desarrollar aplicaciones utilizando metodologías ágiles, arquitectura de software, inteligencia artificial, ciencia de datos, computación en la nube, ciberseguridad y desarrollo web, fortaleciendo competencias técnicas y profesionales alineadas con las necesidades del sector productivo y los desafíos de la transformación digital.

Sus principales áreas de interés incluyen la Ciencia de Datos, la Inteligencia Artificial, el Machine Learning, el Deep Learning, MLOps, la Ingeniería de Software, la Arquitectura de Soluciones, la Computación en la Nube y la Transformación Digital.`,
    titulos: [
      'Magíster en Ciencia de Datos — Universidad Icesi',
      'Magíster en Inteligencia Artificial Aplicada — Universidad Icesi',
      'Ingeniero de Sistemas — Universidad del Pacífico'
    ]
  };

  readonly estudiantesIntegrantes: IntegranteEquipo[] = [
    {
      nombre: 'Jader Riascos',
      cargo: 'Desarrollador Frontend UI/UX',
      area: 'Frontend',
      descripcion: 'Diseño visual de interfaz de usuario, maquetación adaptativa y experiencia de usuario.',
      fotoUrl: 'assets/images/desarrolladores/Jader.png'
    },
    {
      nombre: 'Jefferson Manuel Valencia Riascos',
      cargo: 'Desarrollador Frontend UI/UX',
      area: 'Frontend',
      descripcion: 'Implementación de componentes interactivos, optimización de flujos de navegación y maquetación responsiva.',
      fotoUrl: 'assets/images/desarrolladores/Jefferson%20Valencia.jpeg'
    },
    {
      nombre: 'JUAN ROMAN CUERO ORDOÑEZ',
      cargo: 'Desarrollador Backend Lead',
      area: 'Backend',
      descripcion: 'Diseño de la arquitectura de la API REST, controladores y lógica principal.',
      fotoUrl: 'assets/images/desarrolladores/JUAN.jpeg'
    },
    {
      nombre: 'DARIO RESTREPO LANDAZURY',
      cargo: 'Desarrollador Backend Servicios',
      area: 'Backend',
      descripcion: 'Servicios para módulos de supletorios y egresados y validaciones del negocio.',
      fotoUrl: 'assets/images/desarrolladores/DARIO.jpg'
    },
    {
      nombre: 'Mateo Alejandro Quiñones',
      cargo: 'Desarrollador Backend Seguridad',
      area: 'Backend',
      descripcion: 'Autenticación de usuarios, gestión de permisos JWT y seguridad de datos.',
      fotoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&q=80'
    },
    {
      nombre: 'Diego Fernando Rivas',
      cargo: 'Administrador Base de Datos',
      area: 'Base de Datos',
      descripcion: 'Diseño del modelo relacional E-R, creación de tablas y gestión de persistencia.',
      fotoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80'
    },
    {
      nombre: 'Hernán Rentería',
      cargo: 'Especialista Base de Datos & SQL',
      area: 'Base de Datos',
      descripcion: 'Consultas optimizadas, integridad de datos y soporte en la capa de datos.',
      fotoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80'
    },
    {
      nombre: 'Julián Esteban Angulo',
      cargo: 'Analista QA & Documentación',
      area: 'Documentación & QA',
      descripcion: 'Pruebas de calidad, especificación de requerimientos y documentación del sistema.',
      fotoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80'
    }
  ];

  private readonly ordenAreas = ['Frontend', 'Backend', 'Base de Datos', 'Documentación & QA'];

  get equipoPorArea(): { area: string; personas: IntegranteEquipo[] }[] {
    return this.ordenAreas
      .map((area) => ({
        area,
        personas: this.estudiantesIntegrantes.filter((p) => p.area === area)
      }))
      .filter((grupo) => grupo.personas.length > 0);
  }

  scrollToSection(sectionId: string, event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  abrirModal(integrante: IntegranteEquipo): void {
    this.integranteSeleccionado = integrante;
  }

  cerrarModal(): void {
    this.integranteSeleccionado = null;
  }
}