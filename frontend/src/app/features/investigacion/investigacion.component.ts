import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

interface SublineaInvestigacion {
  nombre: string;
  descripcion: string;
}

interface LineaInvestigacion {
  titulo: string;
  descripcion: string;
  sublineas: SublineaInvestigacion[];
}

interface GrupoInvestigacion {
  nombre: string;
  sigla: string;
  objetivoGeneral: string;
  objetivosEspecificos: string[];
  mision: string;
  vision: string;
  proposito: string;
  coordinador: {
    nombre: string;
    cargo: string;
    bio: string;
    fotoUrl?: string;
    grupLAC: string;
    cvLAC: string;
  };
  lineasInvestigacion: string[];
  sublineasInvestigacion: string[];
}

interface IntegranteSemillero {
  nombre: string;
  rol: string;
  semestre: string;
  fotoUrl: string;
}

interface SemilleroInvestigacion {
  nombre: string;
  sigla: string;
  descripcion: string;
  grupoInvestigacion: string;
  lineaInvestigacion: string;
  sublineaInvestigacion: string;
  proyectoActual: { titulo: string; descripcion: string };
  proyectosTerminados: { titulo: string; descripcion: string }[];
  coordinador: {
    nombre: string;
    cargo: string;
    bio: string;
    fotoUrl?: string;
    grupLAC: string;
    cvLAC: string;
  };
  integrantes: IntegranteSemillero[];
}

type GrupoTab = 'proposito' | 'mision' | 'objetivos' | 'lineas';
type ProyectoTab = 'actual' | 'concluidos';

@Component({
  selector: 'app-investigacion',
  standalone: true,
  imports: [RouterLink, NavbarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700;9..144,900&family=Inter:wght@300;400;500;600;700;800;900&display=swap');

    :host {
      display: block;
      width: 100%;
      min-height: 100vh;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: #ffffff;
      color: #0f172a;
      overflow-x: hidden;

      --font-display: 'Fraunces', Georgia, serif;
      --color-primary: #15803d;
      --color-primary-dark: #14532d;
      --color-pacific: #0e7490;
      --color-ink: #0f172a;
      --color-muted: #64748b;
      --color-border: #e2e8f0;
      --color-surface: #f8fafc;
    }

    /* ===== HERO (sin cambios) ===== */
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
      max-width: 720px;
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

    .page-hero h1 span {
      color: #4ade80;
    }

    .page-hero p {
      font-size: 1.15rem;
      color: #f1f5f9;
      line-height: 1.6;
      font-weight: 500;
      text-shadow: 0 2px 12px rgba(0, 0, 0, 0.7);
    }

    /* ===========================================================
       CUERPO — REDISEÑADO
       =========================================================== */

    .page-body {
      padding: 5rem 2rem 6rem;
      max-width: 1180px;
      margin: 0 auto;
    }

    .section-header { margin-bottom: 2.5rem; max-width: 640px; }

    .section-eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      font-size: 0.78rem;
      font-weight: 700;
      color: var(--color-primary);
      text-transform: uppercase;
      letter-spacing: 0.12em;
      margin-bottom: 0.85rem;
    }

    .section-eyebrow::before {
      content: '';
      width: 22px;
      height: 2px;
      background: var(--color-primary);
      display: inline-block;
    }

    .section-title {
      font-family: var(--font-display);
      font-size: clamp(1.8rem, 2.4vw, 2.4rem);
      font-weight: 700;
      color: var(--color-ink);
      letter-spacing: -0.01em;
      line-height: 1.15;
      margin-bottom: 0.65rem;
    }

    .section-subtitle {
      font-size: 1rem;
      color: var(--color-muted);
      line-height: 1.65;
    }

    /* Divisor tipo "ola" — un único momento distintivo, evoca el Pacífico */
    .wave-divider { width: 100%; margin: 5rem 0; line-height: 0; }
    .wave-divider svg { width: 100%; height: 22px; display: block; }

    /* ===== FRANJA DE CIFRAS (formato editorial, no tarjetas SaaS) ===== */
    .stat-strip {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      border-top: 1px solid var(--color-border);
      border-bottom: 1px solid var(--color-border);
      margin-bottom: 5.5rem;
    }

    .stat-cell {
      padding: 2.1rem 1.85rem;
      border-right: 1px solid var(--color-border);
    }
    .stat-cell:last-child { border-right: none; }

    .stat-number {
      font-family: var(--font-display);
      font-size: 2.5rem;
      font-weight: 600;
      color: var(--color-primary);
      line-height: 1;
      margin-bottom: 0.6rem;
    }

    .stat-label {
      font-size: 0.92rem;
      font-weight: 800;
      color: var(--color-ink);
      margin-bottom: 0.35rem;
    }

    .stat-desc {
      font-size: 0.82rem;
      color: var(--color-muted);
      line-height: 1.55;
    }

    /* ===== INTRO BREVE A GRUPOS DE INVESTIGACIÓN ===== */
    .intro-lede {
      font-family: var(--font-display);
      font-size: 1.35rem;
      font-weight: 500;
      color: #1e293b;
      line-height: 1.55;
      max-width: 760px;
      margin-bottom: 4rem;
      padding-left: 1.5rem;
      border-left: 3px solid var(--color-primary);
    }

    /* ===== TARJETAS DE GRUPO DE INVESTIGACIÓN (perfil institucional) ===== */
    .grupos-list { display: flex; flex-direction: column; gap: 2.5rem; margin-bottom: 1rem; }

    .grupo-card {
      border: 1px solid var(--color-border);
      border-radius: 20px;
      overflow: hidden;
      background: #ffffff;
    }

    .grupo-card-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 2rem;
      flex-wrap: wrap;
      padding: 2.25rem 2.25rem 1.75rem;
      background: var(--color-surface);
      border-bottom: 1px solid var(--color-border);
    }

    .grupo-identity { display: flex; align-items: center; gap: 1.1rem; }

    .monogram {
      width: 54px;
      height: 54px;
      border-radius: 14px;
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 1.05rem;
      flex-shrink: 0;
    }

    .grupo-identity-text h3 {
      font-family: var(--font-display);
      font-size: 1.4rem;
      font-weight: 700;
      color: var(--color-ink);
      line-height: 1.3;
      margin-bottom: 0.25rem;
    }

    .grupo-identity-text .tag-registrado {
      font-size: 0.72rem;
      font-weight: 800;
      color: var(--color-pacific);
      text-transform: uppercase;
      letter-spacing: 0.07em;
    }

    /* Chip de coordinador — estilo perfil, expandible */
    .coord-chip {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      padding: 0.7rem 1rem 0.7rem 0.7rem;
      background: #ffffff;
      border: 1.5px solid var(--color-border);
      border-radius: 16px;
      cursor: pointer;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
      min-width: 240px;
    }
    .coord-chip:hover { border-color: var(--color-primary); box-shadow: 0 6px 16px rgba(21, 128, 61, 0.1); }
    .coord-chip:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }

    .coord-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--color-pacific) 0%, var(--color-primary) 100%);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 0.85rem;
      flex-shrink: 0;
    }

    .coord-meta { display: flex; flex-direction: column; text-align: left; }
    .coord-meta .coord-name { font-size: 0.88rem; font-weight: 800; color: var(--color-ink); line-height: 1.3; }
    .coord-meta .coord-role { font-size: 0.72rem; color: var(--color-muted); font-weight: 600; }

    .coord-chevron { margin-left: auto; color: #94a3b8; transition: transform 0.25s ease; flex-shrink: 0; }
    .coord-chip.is-open .coord-chevron { transform: rotate(180deg); color: var(--color-primary); }

    .coord-panel {
      padding: 1.5rem 2.25rem;
      background: #f0fdf4;
      border-bottom: 1px solid var(--color-border);
      animation: revealDown 0.22s ease;
    }

    .coord-panel-bio {
      font-size: 0.92rem;
      color: #334155;
      line-height: 1.7;
      max-width: 620px;
      margin-bottom: 1.1rem;
    }

    .coord-links { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .coord-link {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.45rem 0.9rem;
      border-radius: 8px;
      font-size: 0.82rem;
      font-weight: 700;
      text-decoration: none;
    }
    .coord-link.gruplac { color: var(--color-pacific); background: #ecfeff; }
    .coord-link.cvlac { color: var(--color-primary); background: #f0fdf4; }

    @keyframes revealDown {
      from { opacity: 0; transform: translateY(-6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Cuerpo de la tarjeta de grupo */
    .grupo-card-body { padding: 2rem 2.25rem 2.25rem; }

    .grupo-proposito {
      font-size: 1rem;
      color: #334155;
      line-height: 1.75;
      margin-bottom: 1.75rem;
      max-width: 720px;
    }

    /* Pestañas */
    .tab-group {
      display: inline-flex;
      gap: 0.2rem;
      padding: 0.25rem;
      background: var(--color-surface);
      border-radius: 12px;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    .tab-btn {
      padding: 0.5rem 1.05rem;
      border: none;
      background: transparent;
      border-radius: 9px;
      font-family: inherit;
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--color-muted);
      cursor: pointer;
      transition: all 0.18s ease;
    }
    .tab-btn:hover { color: var(--color-ink); }
    .tab-btn.active { background: #ffffff; color: var(--color-primary); box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08); }

    .tab-panel { font-size: 0.94rem; color: #475569; line-height: 1.7; }

    .tab-panel-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
    .tab-panel-grid h5 { font-size: 0.78rem; font-weight: 800; color: var(--color-ink); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.5rem; }

    .clean-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.6rem; }
    .clean-list li { position: relative; padding-left: 1.15rem; }
    .clean-list li::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0.55em;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--color-primary);
    }

    /* ===== LÍNEAS DE INVESTIGACIÓN — selector + panel único ===== */
    .linea-switch { display: flex; gap: 0.75rem; margin-bottom: 2rem; flex-wrap: wrap; }

    .linea-switch-btn {
      flex: 1;
      min-width: 240px;
      text-align: left;
      padding: 1.1rem 1.4rem;
      border: 1.5px solid var(--color-border);
      border-radius: 16px;
      background: #ffffff;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s ease;
    }
    .linea-switch-btn:hover { border-color: #94a3b8; }
    .linea-switch-btn.active { border-color: var(--color-primary); background: #f0fdf4; }

    .linea-switch-btn .linea-index {
      font-size: 0.72rem;
      font-weight: 800;
      color: var(--color-primary);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      display: block;
      margin-bottom: 0.35rem;
    }
    .linea-switch-btn .linea-nombre { font-size: 1rem; font-weight: 800; color: var(--color-ink); line-height: 1.35; }

    .linea-panel {
      border: 1px solid var(--color-border);
      border-radius: 20px;
      padding: 2.5rem;
    }

    .linea-panel-desc {
      font-size: 1rem;
      color: #475569;
      line-height: 1.75;
      max-width: 720px;
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid var(--color-border);
    }

    .sublinea-row {
      padding: 1.15rem 0;
      border-bottom: 1px solid #f1f5f9;
      display: grid;
      grid-template-columns: 100px 1fr;
      gap: 1.5rem;
      align-items: baseline;
    }
    .sublinea-row:last-child { border-bottom: none; }

    .sublinea-row .sublinea-tag {
      font-size: 0.72rem;
      font-weight: 800;
      color: var(--color-pacific);
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    .sublinea-row h5 { font-size: 1rem; font-weight: 800; color: var(--color-ink); margin-bottom: 0.35rem; }
    .sublinea-row p { font-size: 0.88rem; color: var(--color-muted); line-height: 1.6; margin: 0; }

    /* ===== SEMILLEROS ===== */
    .semilleros-list { display: flex; flex-direction: column; gap: 2.5rem; }

    .semillero-card {
      border: 1px solid var(--color-border);
      border-radius: 20px;
      padding: 2.5rem;
    }

    .semillero-top-bar {
      display: flex;
      align-items: center;
      gap: 1.1rem;
      margin-bottom: 1.4rem;
    }

    .semillero-title-group h4 {
      font-family: var(--font-display);
      font-size: 1.3rem;
      font-weight: 700;
      color: var(--color-ink);
      letter-spacing: -0.005em;
    }

    .semillero-status-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.35rem 0.85rem;
      background: #dcfce7;
      color: var(--color-primary);
      border-radius: 20px;
      font-size: 0.74rem;
      font-weight: 800;
      margin-left: auto;
    }
    .semillero-status-pill::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--color-primary); }

    .semillero-description {
      font-size: 0.98rem;
      color: #475569;
      line-height: 1.7;
      margin-bottom: 1.5rem;
      max-width: 760px;
    }

    /* Breadcrumb de adscripción — reemplaza el bloque en caja */
    .adscripcion-trail {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
      font-size: 0.82rem;
      color: var(--color-muted);
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #f1f5f9;
    }
    .adscripcion-trail .crumb { font-weight: 700; color: var(--color-ink); }
    .adscripcion-trail .sep { color: #cbd5e1; }

    /* Proyectos con pestañas */
    .proyectos-wrapper { margin-bottom: 2.25rem; }

    .proyecto-panel {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 16px;
      padding: 1.75rem;
    }
    .proyecto-panel.destacado { background: #f0fdf4; border-color: #bbf7d0; }

    .proyecto-panel h5 { font-size: 1.02rem; font-weight: 800; color: var(--color-ink); margin-bottom: 0.5rem; }
    .proyecto-panel p { font-size: 0.9rem; color: #475569; line-height: 1.65; margin: 0; }

    .proyecto-list-item { padding: 1.4rem 0; border-bottom: 1px solid #f1f5f9; }
    .proyecto-list-item:last-child { border-bottom: none; }
    .proyecto-list-item h5 { font-size: 0.96rem; font-weight: 800; color: var(--color-ink); margin-bottom: 0.4rem; }
    .proyecto-list-item p { font-size: 0.88rem; color: var(--color-muted); line-height: 1.6; margin: 0; }

    /* Integrantes */
    .integrantes-wrapper { border-top: 1px solid #f1f5f9; padding-top: 1.75rem; }

    .integrantes-subtitle {
      font-size: 0.78rem;
      font-weight: 800;
      color: var(--color-ink);
      text-transform: uppercase;
      letter-spacing: 0.07em;
      margin-bottom: 1.25rem;
    }

    .integrantes-grid-5 { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1rem; }

    .member-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 1rem 0.5rem;
      border-radius: 14px;
      transition: background 0.2s ease;
    }
    .member-card:hover { background: var(--color-surface); }

    .member-photo {
      width: 54px;
      height: 54px;
      border-radius: 50%;
      object-fit: cover;
      margin-bottom: 0.7rem;
      box-shadow: 0 0 0 2px #ffffff, 0 0 0 3.5px var(--color-border);
    }
    .member-card:hover .member-photo { box-shadow: 0 0 0 2px #ffffff, 0 0 0 3.5px var(--color-primary); }

    .member-name { font-size: 0.85rem; font-weight: 800; color: var(--color-ink); margin-bottom: 0.1rem; line-height: 1.25; }
    .member-role { font-size: 0.72rem; font-weight: 700; color: var(--color-primary); margin-bottom: 0.1rem; }
    .member-semestre { font-size: 0.7rem; color: var(--color-muted); }

    /* ===== FOOTER (sin cambios) ===== */
    .landing-footer { background: linear-gradient(135deg, #15803d 0%, #14532d 100%); color: #ffffff; padding: 4.5rem 2rem 2.5rem; border-top: 1px solid #166534; }
    .footer-container { max-width: 1240px; margin: 0 auto; display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 3.5rem; margin-bottom: 3.5rem; }
    .footer-brand h4 { color: #ffffff; font-size: 1.3rem; font-weight: 900; margin-bottom: 0.85rem; }
    .footer-brand p { color: rgba(255, 255, 255, 0.85); font-size: 0.9rem; line-height: 1.65; max-width: 350px; }
    .footer-col h5 { color: #ffffff; font-size: 0.9rem; font-weight: 800; margin-bottom: 1.25rem; text-transform: uppercase; letter-spacing: 0.06em; }
    .footer-links { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.75rem; }
    .footer-links a { color: rgba(255, 255, 255, 0.8); font-size: 0.9rem; text-decoration: none; }
    .footer-links a:hover { color: #ffffff; text-decoration: underline; }

    .footer-bottom { max-width: 1240px; margin: 0 auto; padding-top: 2rem; border-top: 1px solid rgba(255, 255, 255, 0.15); display: flex; align-items: center; justify-content: space-between; font-size: 0.85rem; color: rgba(255, 255, 255, 0.75); }

    @media (max-width: 1024px) {
      .stat-strip { grid-template-columns: repeat(2, 1fr); }
      .stat-cell:nth-child(2) { border-right: none; }
      .stat-cell { border-bottom: 1px solid var(--color-border); }
      .tab-panel-grid { grid-template-columns: 1fr; gap: 1.25rem; }
      .integrantes-grid-5 { grid-template-columns: repeat(3, 1fr); }
      .footer-container { grid-template-columns: 1fr 1fr; }
      .grupo-card-header { flex-direction: column; align-items: stretch; }
    }

    @media (max-width: 640px) {
      .page-hero { padding: 8rem 1.5rem 4rem; }
      .page-hero h1 { font-size: 2.2rem; }
      .stat-strip { grid-template-columns: 1fr; }
      .stat-cell { border-right: none; border-bottom: 1px solid var(--color-border); }
      .integrantes-grid-5 { grid-template-columns: repeat(2, 1fr); }
      .footer-container { grid-template-columns: 1fr; }
      .grupo-card-body, .grupo-card-header, .semillero-card, .linea-panel { padding: 1.5rem; }
      .sublinea-row { grid-template-columns: 1fr; gap: 0.35rem; }
    }
  `],
  template: `
    <app-navbar></app-navbar>

    <!-- HERO PHOTO BACKGROUND -->
    <section class="page-hero">
      <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80" alt="Laboratorio de Investigación en Sistemas" class="hero-bg-image" />
      <div class="hero-overlay"></div>

      <div class="page-hero-container">
        <h1>Investigación e <span>Innovación Tecnológica</span></h1>
        <p>
          Ingeniería de Sistemas — Desarrollo de conocimiento científico, líneas de investigación, Grupo IES y semilleros formativos.
        </p>
      </div>
    </section>

    <!-- CUERPO PRINCIPAL -->
    <main class="page-body">

      <!-- FRANJA DE CIFRAS -->
      <div class="stat-strip">
        <div class="stat-cell">
          <div class="stat-number">{{ gruposInvestigacion.length }}</div>
          <div class="stat-label">Grupo registrado</div>
          <p class="stat-desc">Unidad básica de generación de conocimiento científico del programa.</p>
        </div>
        <div class="stat-cell">
          <div class="stat-number">{{ lineasInvestigacion.length }}</div>
          <div class="stat-label">Líneas institucionales</div>
          <p class="stat-desc">Ciencia, Tecnología e Innovación y su relación con la Sociedad.</p>
        </div>
        <div class="stat-cell">
          <div class="stat-number">{{ semillerosInvestigacion.length }}</div>
          <div class="stat-label">Semilleros activos</div>
          <p class="stat-desc">SIC (Inteligencia Computacional) y SDWS (Desarrollo Web y Sistemas).</p>
        </div>
        <div class="stat-cell">
          <div class="stat-number">{{ totalIntegrantes }}</div>
          <div class="stat-label">Estudiantes investigadores</div>
          <p class="stat-desc">Vinculados actualmente a proyectos de investigación formativa.</p>
        </div>
      </div>

      <!-- SECCIÓN: GRUPOS DE INVESTIGACIÓN -->
      <section class="section-header">
        <span class="section-eyebrow">Estructura investigativa</span>
        <h2 class="section-title">Grupos de Investigación</h2>
        <p class="section-subtitle">Unidades que formulan y ejecutan proyectos de investigación aplicada del programa.</p>
      </section>

      <p class="intro-lede">
        Un grupo de investigación articula líneas, sublíneas y semilleros formativos alrededor de problemáticas reales del Pacífico colombiano, fortaleciendo la capacidad científica de la institución.
      </p>

      <div class="grupos-list">
        @for (grupo of gruposInvestigacion; track grupo.sigla) {
          <article class="grupo-card">
            <div class="grupo-card-header">
              <div class="grupo-identity">
                <div class="monogram">{{ grupo.sigla }}</div>
                <div class="grupo-identity-text">
                  <h3>{{ grupo.nombre }}</h3>

                  <button
                    type="button"
                    class="coord-chip"
                    [class.is-open]="isCoordExpanded(grupo.sigla)"
                    (click)="toggleCoordinador(grupo.sigla)"
                    [attr.aria-expanded]="isCoordExpanded(grupo.sigla)"
                  >
                    <span class="coord-avatar">
                      @if (grupo.coordinador.fotoUrl) {
                        <img [src]="grupo.coordinador.fotoUrl" [alt]="grupo.coordinador.nombre" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">
                      } @else {
                        {{ initials(grupo.coordinador.nombre) }}
                      }
                    </span>
                    <span class="coord-meta">
                      <span class="coord-name">{{ grupo.coordinador.nombre }}</span>
                      <span class="coord-role">Ver perfil del coordinador</span>
                    </span>
                    <svg class="coord-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </button>
                </div>
              </div>
            </div>

            @if (isCoordExpanded(grupo.sigla)) {
              <div class="coord-panel" style="border-bottom: 1px solid var(--color-border);">
                <p class="coord-panel-bio">
                  <strong>{{ grupo.coordinador.cargo }}.</strong> {{ grupo.coordinador.bio }}
                </p>
                <div class="coord-links">
                  <a [href]="grupo.coordinador.grupLAC" target="_blank" class="coord-link gruplac">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                    Ver GrupLAC
                  </a>
                  <a [href]="grupo.coordinador.cvLAC" target="_blank" class="coord-link cvlac">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    Ver CvLAC
                  </a>
                </div>
              </div>
            }

            <div class="grupo-card-body">
              <p class="grupo-proposito">{{ grupo.proposito }}</p>

              <div class="tab-group" role="tablist">
                <button type="button" class="tab-btn" [class.active]="isGrupoTabActive(grupo.sigla, 'mision')" (click)="setGrupoTab(grupo.sigla, 'mision')">Misión y visión</button>
                <button type="button" class="tab-btn" [class.active]="isGrupoTabActive(grupo.sigla, 'objetivos')" (click)="setGrupoTab(grupo.sigla, 'objetivos')">Objetivos</button>
                <button type="button" class="tab-btn" [class.active]="isGrupoTabActive(grupo.sigla, 'lineas')" (click)="setGrupoTab(grupo.sigla, 'lineas')">Líneas y sublíneas</button>
              </div>

              @switch (getGrupoTab(grupo.sigla)) {
                @case ('mision') {
                  <div class="tab-panel tab-panel-grid">
                    <div>
                      <h5>Misión</h5>
                      <p>{{ grupo.mision }}</p>
                    </div>
                    <div>
                      <h5>Visión</h5>
                      <p>{{ grupo.vision }}</p>
                    </div>
                  </div>
                }
                @case ('objetivos') {
                  <div class="tab-panel">
                    <p style="margin-bottom: 1rem;"><strong style="color:#0f172a;">General:</strong> {{ grupo.objetivoGeneral }}</p>
                    <ul class="clean-list">
                      @for (obj of grupo.objetivosEspecificos; track obj) {
                        <li>{{ obj }}</li>
                      }
                    </ul>
                  </div>
                }
                @case ('lineas') {
                  <div class="tab-panel tab-panel-grid">
                    <div>
                      <h5>Líneas</h5>
                      <ul class="clean-list">
                        @for (linea of grupo.lineasInvestigacion; track linea) {
                          <li>{{ linea }}</li>
                        }
                      </ul>
                    </div>
                    <div>
                      <h5>Sublíneas</h5>
                      <ul class="clean-list">
                        @for (sub of grupo.sublineasInvestigacion; track sub) {
                          <li>{{ sub }}</li>
                        }
                      </ul>
                    </div>
                  </div>
                }
              }
            </div>
          </article>
        }
      </div>

      <div class="wave-divider">
        <svg viewBox="0 0 1200 24" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 12 Q 50 2, 100 12 T 200 12 T 300 12 T 400 12 T 500 12 T 600 12 T 700 12 T 800 12 T 900 12 T 1000 12 T 1100 12 T 1200 12" stroke="#15803d" stroke-width="1.5" fill="none" opacity="0.3"/>
        </svg>
      </div>

      <!-- SECCIÓN: LÍNEAS DE INVESTIGACIÓN -->
      <section class="section-header">
        <span class="section-eyebrow">Ejes temáticos</span>
        <h2 class="section-title">Líneas de Investigación del Programa</h2>
        <p class="section-subtitle">Estructura que orienta los trabajos de grado y proyectos formativos de los estudiantes.</p>
      </section>

      <div class="linea-switch">
        @for (linea of lineasInvestigacion; track linea.titulo; let i = $index) {
          <button type="button" class="linea-switch-btn" [class.active]="activeLinea() === i" (click)="activeLinea.set(i)">
            <span class="linea-index">Línea {{ i + 1 }} de {{ lineasInvestigacion.length }}</span>
            <span class="linea-nombre">{{ linea.titulo }}</span>
          </button>
        }
      </div>

      <div class="linea-panel">
        <p class="linea-panel-desc">{{ lineasInvestigacion[activeLinea()].descripcion }}</p>
        @for (sub of lineasInvestigacion[activeLinea()].sublineas; track sub.nombre; let i = $index) {
          <div class="sublinea-row">
            <span class="sublinea-tag">Sublínea {{ i + 1 }}</span>
            <div>
              <h5>{{ sub.nombre }}</h5>
              <p>{{ sub.descripcion }}</p>
            </div>
          </div>
        }
      </div>

      <div class="wave-divider">
        <svg viewBox="0 0 1200 24" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 12 Q 50 2, 100 12 T 200 12 T 300 12 T 400 12 T 500 12 T 600 12 T 700 12 T 800 12 T 900 12 T 1000 12 T 1100 12 T 1200 12" stroke="#0e7490" stroke-width="1.5" fill="none" opacity="0.3"/>
        </svg>
      </div>

      <!-- SECCIÓN: SEMILLEROS DE INVESTIGACIÓN -->
      <section class="section-header">
        <span class="section-eyebrow">Formación investigativa</span>
        <h2 class="section-title">Semilleros de Investigación Estudiantil</h2>
        <p class="section-subtitle">Espacios de aprendizaje práctico donde estudiantes y docentes desarrollan proyectos informáticos innovadores.</p>
      </section>

      <div class="semilleros-list">
        @for (semillero of semillerosInvestigacion; track semillero.sigla) {
          <article class="semillero-card">
            <div class="semillero-top-bar">
              <div class="monogram">{{ semillero.sigla }}</div>
              <div class="semillero-title-group">
                <h4>{{ semillero.nombre }}</h4>
              </div>
              <span class="semillero-status-pill">Activo</span>
            </div>

            <p class="semillero-description">{{ semillero.descripcion }}</p>

            <div class="adscripcion-trail">
              <span class="crumb">{{ semillero.grupoInvestigacion }}</span>
              <span class="sep">›</span>
              <span class="crumb">{{ semillero.lineaInvestigacion }}</span>
              <span class="sep">›</span>
              <span class="crumb">{{ semillero.sublineaInvestigacion }}</span>
            </div>

            <div style="margin-top: 1.5rem; margin-bottom: 0.5rem;">
              <button
                type="button"
                class="coord-chip"
                [class.is-open]="isCoordExpanded(semillero.sigla)"
                (click)="toggleCoordinador(semillero.sigla)"
                [attr.aria-expanded]="isCoordExpanded(semillero.sigla)"
              >
                <span class="coord-avatar">
                  @if (semillero.coordinador.fotoUrl) {
                    <img [src]="semillero.coordinador.fotoUrl" [alt]="semillero.coordinador.nombre" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">
                  } @else {
                    {{ initials(semillero.coordinador.nombre) }}
                  }
                </span>
                <span class="coord-meta">
                  <span class="coord-name">{{ semillero.coordinador.nombre }}</span>
                  <span class="coord-role">Coordinador del Semillero</span>
                </span>
                <svg class="coord-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
            </div>

            @if (isCoordExpanded(semillero.sigla)) {
              <div class="coord-panel" style="border-bottom: 1px solid var(--color-border); margin-bottom: 1.5rem; padding-bottom: 1.5rem;">
                <p class="coord-panel-bio">
                  <strong>{{ semillero.coordinador.cargo }}.</strong> {{ semillero.coordinador.bio }}
                </p>
                <div class="coord-links">
                  <a [href]="semillero.coordinador.grupLAC" target="_blank" class="coord-link gruplac">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                    Ver GrupLAC
                  </a>
                  <a [href]="semillero.coordinador.cvLAC" target="_blank" class="coord-link cvlac">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    Ver CvLAC
                  </a>
                </div>
              </div>
            }

            <div class="proyectos-wrapper">
              <div class="tab-group" role="tablist">
                <button type="button" class="tab-btn" [class.active]="isProyectoTabActive(semillero.sigla, 'actual')" (click)="setProyectoTab(semillero.sigla, 'actual')">En ejecución</button>
                <button type="button" class="tab-btn" [class.active]="isProyectoTabActive(semillero.sigla, 'concluidos')" (click)="setProyectoTab(semillero.sigla, 'concluidos')">Concluidos ({{ semillero.proyectosTerminados.length }})</button>
              </div>

              @if (getProyectoTab(semillero.sigla) === 'actual') {
                <div class="proyecto-panel destacado">
                  <h5>{{ semillero.proyectoActual.titulo }}</h5>
                  <p>{{ semillero.proyectoActual.descripcion }}</p>
                </div>
              } @else {
                <div class="proyecto-panel">
                  @for (pTerm of semillero.proyectosTerminados; track pTerm.titulo) {
                    <div class="proyecto-list-item">
                      <h5>{{ pTerm.titulo }}</h5>
                      <p>{{ pTerm.descripcion }}</p>
                    </div>
                  }
                </div>
              }
            </div>

            <div class="integrantes-wrapper">
              <div class="integrantes-subtitle">Estudiantes investigadores integrantes</div>
              <div class="integrantes-grid-5">
                @for (member of semillero.integrantes; track member.nombre) {
                  <div class="member-card">
                    <img [src]="member.fotoUrl" [alt]="member.nombre" class="member-photo" />
                    <span class="member-name">{{ member.nombre }}</span>
                    <span class="member-role">{{ member.rol }}</span>
                    <span class="member-semestre">{{ member.semestre }}</span>
                  </div>
                }
              </div>
            </div>
          </article>
        }
      </div>
    </main>

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
export class InvestigacionComponent {
  // ---- estado de interacción (perfiles / pestañas) ----
  private expandedCoordinadores = signal<Set<string>>(new Set());
  private grupoTabs = signal<Record<string, GrupoTab>>({});
  activeLinea = signal(0);
  private proyectoTabs = signal<Record<string, ProyectoTab>>({});

  toggleCoordinador(sigla: string): void {
    const current = new Set(this.expandedCoordinadores());
    current.has(sigla) ? current.delete(sigla) : current.add(sigla);
    this.expandedCoordinadores.set(current);
  }
  isCoordExpanded(sigla: string): boolean {
    return this.expandedCoordinadores().has(sigla);
  }

  getGrupoTab(sigla: string): GrupoTab {
    return this.grupoTabs()[sigla] ?? 'mision';
  }
  isGrupoTabActive(sigla: string, tab: GrupoTab): boolean {
    return this.getGrupoTab(sigla) === tab;
  }
  setGrupoTab(sigla: string, tab: GrupoTab): void {
    this.grupoTabs.set({ ...this.grupoTabs(), [sigla]: tab });
  }

  getProyectoTab(sigla: string): ProyectoTab {
    return this.proyectoTabs()[sigla] ?? 'actual';
  }
  isProyectoTabActive(sigla: string, tab: ProyectoTab): boolean {
    return this.getProyectoTab(sigla) === tab;
  }
  setProyectoTab(sigla: string, tab: ProyectoTab): void {
    this.proyectoTabs.set({ ...this.proyectoTabs(), [sigla]: tab });
  }

  initials(nombre: string): string {
    return nombre
      .split(' ')
      .filter((p) => p.length > 1)
      .slice(0, 2)
      .map((p) => p[0])
      .join('')
      .toUpperCase();
  }

  get totalIntegrantes(): number {
    return this.semillerosInvestigacion.reduce((acc, s) => acc + s.integrantes.length, 0);
  }

  // ---- datos ----
  readonly gruposInvestigacion: GrupoInvestigacion[] = [
    {
      nombre: 'Grupo de Investigación en Ingeniería, Energía y Sistemas',
      sigla: 'IES',
      objetivoGeneral: 'Desarrollar soluciones tecnológicas innovadoras y proyectos de investigación aplicada que contribuyan al desarrollo sostenible de la región del Pacífico.',
      objetivosEspecificos: [
        'Fomentar la apropiación social del conocimiento tecnológico en las comunidades locales.',
        'Impulsar el desarrollo de software y sistemas de información adaptados a las necesidades institucionales.',
        'Promover la investigación formativa a través de la consolidación de semilleros de investigación.'
      ],
      mision: 'Generar desarrollo tecnológico autónomo en el Pacífico colombiano mediante la ejecución de proyectos de investigación en sistemas y computación.',
      vision: 'Ser el grupo de investigación referente en la región del Pacífico en materia de innovación tecnológica y desarrollo de sistemas de información.',
      proposito: 'Estructurar proyectos de investigación aplicada que resuelvan problemáticas locales en energía, sistemas distribuidos, e inteligencia computacional.',
      coordinador: {
        nombre: 'MSc. Jorge E. Valencia',
        cargo: 'Coordinador del Grupo de Investigación',
        bio: 'Magíster en Ingeniería con énfasis en sistemas de información. Lidera proyectos de innovación tecnológica aplicada al desarrollo territorial del Pacífico colombiano y la consolidación de los semilleros formativos del programa.',
        fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
        grupLAC: 'https://scienti.minciencias.gov.co/gruplac/',
        cvLAC: 'https://scienti.minciencias.gov.co/cvlac/'
      },
      lineasInvestigacion: [
        'Ciencia, Tecnología e Innovación',
        'Ciencia, Tecnología, Innovación y Sociedad'
      ],
      sublineasInvestigacion: [
        'Desarrollo de Software Distribuido & Cloud',
        'Sistemas Inteligentes & Analítica de Datos',
        'Inclusión Digital & Apropiación Social'
      ]
    },
    {
      nombre: 'Grupo de Investigación en Ciencias Computacionales e Inteligencia Artificial',
      sigla: 'GICCIA',
      objetivoGeneral: 'Investigar y desarrollar modelos computacionales avanzados basados en inteligencia artificial para la optimización de procesos y el apoyo a la toma de decisiones.',
      objetivosEspecificos: [
        'Diseñar algoritmos de machine learning aplicados a la educación y la salud.',
        'Desarrollar sistemas expertos y plataformas analíticas para la región.',
        'Promover la publicación científica en revistas indexadas de alto impacto.'
      ],
      mision: 'Aportar al avance del conocimiento en ciencias de la computación mediante la investigación rigurosa, fomentando el desarrollo de tecnologías inteligentes en el entorno universitario y regional.',
      vision: 'Convertirnos en un núcleo de excelencia en inteligencia artificial y computación avanzada a nivel nacional, reconocido por su impacto en la academia y la industria.',
      proposito: 'Consolidar un espacio de investigación en algoritmos predictivos, minería de datos y arquitecturas de software inteligente.',
      coordinador: {
        nombre: 'MSc. Wilman A. Quiñónez Valencia',
        cargo: 'Director del Grupo GICCIA',
        bio: 'Magíster en Ciencia de Datos y Magíster en Inteligencia Artificial Aplicada. Experto en analítica avanzada, aprendizaje automático y desarrollo de soluciones tecnológicas basadas en datos.',
        fotoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80',
        grupLAC: 'https://scienti.minciencias.gov.co/gruplac/',
        cvLAC: 'https://scienti.minciencias.gov.co/cvlac/'
      },
      lineasInvestigacion: [
        'Ciencia, Tecnología e Innovación'
      ],
      sublineasInvestigacion: [
        'Sistemas Inteligentes & Analítica de Datos'
      ]
    }
  ];

  readonly lineasInvestigacion: LineaInvestigacion[] = [
    {
      titulo: 'Ciencia, Tecnología e Innovación',
      descripcion: 'Investigación orientada a la creación de modelos computacionales avanzados, desarrollo de software adaptativo y redes distribuidas de alto desempeño.',
      sublineas: [
        {
          nombre: 'Desarrollo de Software Distribuido & Cloud',
          descripcion: 'Patrones de arquitectura de microservicios, APIs resilientes y computación distribuida.'
        },
        {
          nombre: 'Sistemas Inteligentes & Analítica de Datos',
          descripcion: 'Modelos de machine learning, visión por computador y analítica predictiva.'
        },
        {
          nombre: 'Infraestructura & Redes de Alta Velocidad',
          descripcion: 'Optimización de protocolos de comunicación, ciberseguridad y telefonía IP.'
        }
      ]
    },
    {
      titulo: 'Ciencia, Tecnología, Innovación y Sociedad',
      descripcion: 'Línea de investigación enfocada en la apropiación social del conocimiento y el impacto tecnológico en la transformación comunitaria de Buenaventura.',
      sublineas: [
        {
          nombre: 'Inclusión Digital & Apropiación Social',
          descripcion: 'Estrategias tecnológicas para el cierre de la brecha digital en comunidades del Pacífico.'
        },
        {
          nombre: 'Informática Educativa del Pacífico',
          descripcion: 'Plataformas de aprendizaje adaptativo y herramientas didácticas digitales.'
        },
        {
          nombre: 'Gestión Tecnológica Territorial',
          descripcion: 'Sistemas de información para la gobernanza, medio ambiente y desarrollo sostenible.'
        }
      ]
    }
  ];

  readonly semillerosInvestigacion: SemilleroInvestigacion[] = [
    {
      nombre: 'Semillero de Inteligencia Computacional',
      sigla: 'SIC',
      descripcion: 'Espacio de formación investigativa dedicado a la exploración y desarrollo de algoritmos de inteligencia artificial, procesamiento de lenguaje natural y modelos predictivos.',
      grupoInvestigacion: 'Grupo IES',
      lineaInvestigacion: 'Ciencia, Tecnología e Innovación',
      sublineaInvestigacion: 'Sistemas Inteligentes & Analítica de Datos',
      proyectoActual: {
        titulo: 'Sistema Predictivo de Rendimiento Académico Universitario',
        descripcion: 'Implementación de modelos de redes neuronales para la detección temprana de riesgo de deserción estudiantil.'
      },
      proyectosTerminados: [
        {
          titulo: 'Plataforma de Diagnóstico Agro-Ambiental Territorial',
          descripcion: 'Procesamiento de imágenes satelitales para la clasificación de cobertura de suelo en el Valle del Cauca.'
        }
      ],
      coordinador: {
        nombre: 'MSc. Wilman A. Quiñónez Valencia',
        cargo: 'Tutor del Semillero SIC',
        bio: 'Magíster en Inteligencia Artificial y Ciencia de Datos. Lidera a los estudiantes en la concepción y desarrollo de modelos predictivos aplicados a problemáticas regionales.',
        fotoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80',
        grupLAC: 'https://scienti.minciencias.gov.co/gruplac/',
        cvLAC: 'https://scienti.minciencias.gov.co/cvlac/'
      },
      integrantes: [
        { nombre: 'Camilo Torres', rol: 'Líder Estudiantil', semestre: '8.° Semestre', fotoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80' },
        { nombre: 'Daniel Valencia', rol: 'Investigador IA', semestre: '7.° Semestre', fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80' },
        { nombre: 'Esteban Rentería', rol: 'Desarrollador Datos', semestre: '6.° Semestre', fotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80' },
        { nombre: 'Kevin Angulo', rol: 'Analista de Modelos', semestre: '5.° Semestre', fotoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=256&q=80' },
        { nombre: 'Mateo Caicedo', rol: 'Asistente de Pruebas', semestre: '4.° Semestre', fotoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80' }
      ]
    },
    {
      nombre: 'Semillero de Desarrollo Web & Sistemas Distribuidos',
      sigla: 'SDWS',
      descripcion: 'Semillero enfocado en la investigación aplicada de estándares de desarrollo web moderno, arquitecturas desacopladas y seguridad en plataformas en la nube.',
      grupoInvestigacion: 'Grupo IES',
      lineaInvestigacion: 'Ciencia, Tecnología e Innovación',
      sublineaInvestigacion: 'Desarrollo de Software Distribuido & Cloud',
      proyectoActual: {
        titulo: 'Arquitectura de Microservicios para Portales Institucionales',
        descripcion: 'Diseño de un framework distribuido ligero en Node.js y Angular para servicios educativos universitarios.'
      },
      proyectosTerminados: [
        {
          titulo: 'Monitor y Analizador de Tráfico de Redes Universitarias',
          descripcion: 'Herramienta en tiempo real para el diagnóstico de latencia y uso de ancho de banda en la red de campus.'
        }
      ],
      coordinador: {
        nombre: 'MSc. Jorge E. Valencia',
        cargo: 'Tutor del Semillero SDWS',
        bio: 'Magíster en Ingeniería. Dirige las iniciativas de desarrollo distribuido y computación en la nube, fortaleciendo el perfil tecnológico de los investigadores en formación.',
        fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
        grupLAC: 'https://scienti.minciencias.gov.co/gruplac/',
        cvLAC: 'https://scienti.minciencias.gov.co/cvlac/'
      },
      integrantes: [
        { nombre: 'Santiago Córdoba', rol: 'Líder Estudiantil', semestre: '9.° Semestre', fotoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80' },
        { nombre: 'Felipe Mosquera', rol: 'Desarrollador Fullstack', semestre: '8.° Semestre', fotoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&q=80' },
        { nombre: 'Andrés Rivas', rol: 'Especialista API', semestre: '7.° Semestre', fotoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80' },
        { nombre: 'Julián Mina', rol: 'Desarrollador Frontend', semestre: '6.° Semestre', fotoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80' },
        { nombre: 'Diego Quiñones', rol: 'Analista QA', semestre: '5.° Semestre', fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80' }
      ]
    }
  ];
}