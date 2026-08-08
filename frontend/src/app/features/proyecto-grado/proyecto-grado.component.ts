import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { CommonModule } from '@angular/common';



interface AlternativaGrado {
  id: string;
  nombre: string;
  descripcion: string;
  requisitos: string[];
  proceso: string[];
  icono: string;
}

interface HitoCalendario {
  fecha: string;
  evento: string;
  descripcion: string;
}

interface ProyectoGrado {
  id: number;
  titulo: string;
  descripcion: string;
  director: string;
  estudiantes: string[];
  anio: number;
}

@Component({
  selector: 'app-proyecto-grado',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
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
      min-height: 55vh;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 9rem 4rem 5rem;
      background: #0f172a;
      overflow: hidden;
    }
    .hero-bg-image { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.65; }
    .hero-overlay { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.75) 60%, rgba(15, 23, 42, 0.2) 100%); }
    .page-hero-container { position: relative; z-index: 10; max-width: 850px; margin: 0; text-align: left; }
    .page-hero h1 { font-size: 3.5rem; font-weight: 900; color: #ffffff; letter-spacing: -0.035em; line-height: 1.1; margin-bottom: 1.25rem; text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5); }
    .page-hero h1 span { color: #4ade80; }
    .page-hero p { font-size: 1.15rem; color: #e2e8f0; line-height: 1.65; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5); }

    /* ===== MAIN BODY ===== */
    .page-body { padding: 5rem 2rem; max-width: 1400px; margin: 0 auto; display: flex; flex-direction: column; gap: 6rem; }

    /* SECTION HEADER */
    .section-header-block { margin-bottom: 2.25rem; }
    .section-tag-pill { display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; font-weight: 800; color: #15803d; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.5rem; }
    .section-main-title { font-size: 2.2rem; font-weight: 800; color: #0f172a; letter-spacing: -0.02em; margin-bottom: 1.25rem; }
    .section-description { font-size: 1.1rem; color: #475569; line-height: 1.7; max-width: 900px; }

    /* ===== MISION, VISION, PROPOSITO (Tarjetas) ===== */
    .mvp-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
    .mvp-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px; padding: 2.5rem; box-shadow: 0 4px 20px rgba(0,0,0,0.02); transition: all 0.3s ease; display: flex; flex-direction: column; gap: 1.25rem; }
    .mvp-card:hover { transform: translateY(-5px); box-shadow: 0 12px 30px rgba(0,0,0,0.06); border-color: #cbd5e1; }
    .mvp-icon { width: 56px; height: 56px; border-radius: 16px; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); color: #15803d; display: flex; align-items: center; justify-content: center; }
    .mvp-icon svg { width: 28px; height: 28px; }
    .mvp-card h3 { font-size: 1.4rem; font-weight: 800; color: #0f172a; }
    .mvp-card p { font-size: 1rem; color: #475569; line-height: 1.7; margin: 0; }

    /* ===== ALTERNATIVAS DE GRADO (Tabs) ===== */
    .alternativas-container { display: flex; flex-direction: column; gap: 2rem; }
    .alt-tabs-wrap { display: flex; gap: 1rem; overflow-x: auto; padding-bottom: 0.5rem; scrollbar-width: none; }
    .alt-tabs-wrap::-webkit-scrollbar { display: none; }
    .alt-tab {
      padding: 1rem 1.5rem;
      background: #ffffff;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      color: #64748b;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      white-space: nowrap;
      transition: all 0.2s;
    }
    .alt-tab:hover { border-color: #cbd5e1; color: #334155; background: #f8fafc; }
    .alt-tab.active { background: #15803d; border-color: #15803d; color: #ffffff; box-shadow: 0 4px 14px rgba(21, 128, 61, 0.3); }

    .alt-content { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 24px; padding: 3rem; box-shadow: 0 8px 30px rgba(0,0,0,0.03); }
    .alt-header { margin-bottom: 2.5rem; padding-bottom: 2rem; border-bottom: 1px solid #e2e8f0; }
    .alt-header h3 { font-size: 2rem; font-weight: 800; color: #0f172a; margin-bottom: 1rem; }
    .alt-header p { font-size: 1.1rem; color: #475569; line-height: 1.7; }

    .alt-details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; }
    .detail-block h4 { font-size: 1.2rem; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem; }
    .detail-block h4::before { content: ''; display: block; width: 6px; height: 20px; border-radius: 3px; background: #4ade80; }
    
    .check-list, .step-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 1rem; }
    .check-list li { display: flex; align-items: flex-start; gap: 0.75rem; font-size: 0.95rem; color: #334155; line-height: 1.5; }
    .check-list li svg { width: 20px; height: 20px; color: #15803d; flex-shrink: 0; margin-top: 2px; }
    
    .step-list li { display: flex; gap: 1rem; }
    .step-number { width: 28px; height: 28px; border-radius: 50%; background: #f0fdf4; color: #15803d; font-weight: 800; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid #bbf7d0; }
    .step-text { font-size: 0.95rem; color: #334155; line-height: 1.5; padding-top: 4px; }

    /* ===== CALENDARIO (Interactive Timeline) ===== */
    .interactive-timeline { display: flex; flex-direction: column; gap: 2rem; margin-top: 1rem; }
    
    .timeline-track-container { position: relative; padding: 2rem 0; overflow-x: auto; scrollbar-width: none; }
    .timeline-track-container::-webkit-scrollbar { display: none; }
    .timeline-line { position: absolute; top: calc(50% - 10px); left: 2rem; right: 2rem; height: 4px; background: #e2e8f0; border-radius: 2px; z-index: 1; }
    .timeline-nodes { position: relative; z-index: 2; display: flex; justify-content: space-between; align-items: flex-start; min-width: 800px; padding: 0 2rem; }
    
    .timeline-node { background: transparent; border: none; display: flex; flex-direction: column; align-items: center; gap: 0.75rem; cursor: pointer; position: relative; outline: none; flex: 1; }
    .node-dot { width: 24px; height: 24px; border-radius: 50%; background: #ffffff; border: 4px solid #cbd5e1; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 0 0 6px var(--color-page, #f8fafc); }
    .node-date { font-size: 0.85rem; font-weight: 700; color: #64748b; white-space: nowrap; transition: color 0.3s; margin-top: 0.25rem; }
    
    .timeline-node:hover .node-dot { border-color: #94a3b8; transform: scale(1.1); }
    .timeline-node:hover .node-date { color: #334155; }
    
    .timeline-node.active .node-dot { border-color: #15803d; background: #15803d; transform: scale(1.25); box-shadow: 0 0 0 8px rgba(21, 128, 61, 0.15); }
    .timeline-node.active .node-date { color: #15803d; font-size: 0.95rem; }
    
    .timeline-featured-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px; padding: 3.5rem; box-shadow: 0 10px 30px rgba(0,0,0,0.04); text-align: center; max-width: 850px; margin: 0 auto; width: 100%; transition: all 0.3s ease; }
    .featured-date { display: inline-block; padding: 0.5rem 1.25rem; background: #f0fdf4; color: #15803d; font-size: 0.9rem; font-weight: 800; border-radius: 20px; margin-bottom: 1.5rem; letter-spacing: 0.05em; text-transform: uppercase; }
    .timeline-featured-card h3 { font-size: 2.2rem; font-weight: 900; color: #0f172a; margin-bottom: 1.25rem; }
    .timeline-featured-card p { font-size: 1.15rem; color: #475569; line-height: 1.7; margin: 0; }

    /* ===== DOCUMENTOS BANNER ===== */
    .docs-banner {
      background: linear-gradient(135deg, #15803d 0%, #166534 100%);
      border-radius: 24px;
      padding: 4rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 3rem;
      color: #ffffff;
      box-shadow: 0 20px 40px rgba(21, 128, 61, 0.2);
      position: relative;
      overflow: hidden;
    }
    .docs-banner::after { content: ''; position: absolute; right: -50px; top: -50px; width: 300px; height: 300px; background: rgba(255,255,255,0.05); border-radius: 50%; pointer-events: none; }
    .docs-info h3 { font-size: 2.2rem; font-weight: 900; margin-bottom: 1rem; letter-spacing: -0.02em; }
    .docs-info p { font-size: 1.1rem; color: #dcfce7; line-height: 1.6; max-width: 800px; margin: 0; }
    .btn-drive { display: inline-flex; align-items: center; gap: 0.75rem; background: #ffffff; color: #15803d; font-size: 1.05rem; font-weight: 800; padding: 1rem 2rem; border-radius: 12px; text-decoration: none; transition: all 0.2s ease; flex-shrink: 0; }
    .btn-drive:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
    .btn-drive svg { width: 22px; height: 22px; }

    /* ===== PROYECTOS GRID ===== */
    .proyectos-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 2rem; margin-top: 1rem; }
    .proyecto-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px; padding: 2.5rem; display: flex; flex-direction: column; transition: all 0.3s; }
    .proyecto-card:hover { border-color: #cbd5e1; box-shadow: 0 12px 30px rgba(0,0,0,0.05); transform: translateY(-4px); }
    .proyecto-anio { align-self: flex-start; padding: 0.35rem 0.85rem; background: #f1f5f9; color: #475569; font-size: 0.8rem; font-weight: 700; border-radius: 6px; margin-bottom: 1.25rem; }
    .proyecto-card h4 { font-size: 1.3rem; font-weight: 800; color: #0f172a; margin-bottom: 1rem; line-height: 1.4; }
    .proyecto-card p { font-size: 0.95rem; color: #475569; line-height: 1.6; margin-bottom: 1.75rem; flex-grow: 1; }
    .proyecto-meta { border-top: 1px solid #e2e8f0; padding-top: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem; }
    .meta-row { display: flex; align-items: flex-start; gap: 0.75rem; font-size: 0.9rem; color: #334155; }
    .meta-row svg { width: 18px; height: 18px; color: #94a3b8; flex-shrink: 0; margin-top: 2px; }
    .meta-row strong { font-weight: 700; color: #0f172a; margin-right: 0.25rem; }

    /* ===== RESPONSIVE ===== */
    @media (max-width: 1024px) {
      .mvp-grid { grid-template-columns: 1fr; }
      .alt-details-grid { grid-template-columns: 1fr; gap: 2.5rem; }
      .docs-banner { flex-direction: column; align-items: flex-start; padding: 3rem; gap: 2rem; }
      .proyectos-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 640px) {
      .page-hero { padding: 8rem 1.5rem 4rem; min-height: 50vh; }
      .page-hero h1 { font-size: 2.6rem; }
      .page-body { padding: 4rem 1.25rem; gap: 4.5rem; }
      .alt-content { padding: 2rem 1.5rem; }
      .docs-banner { padding: 2rem 1.5rem; }
      .docs-info h3 { font-size: 1.8rem; }
      .timeline-track-container { padding: 1.5rem 0; }
      .timeline-featured-card { padding: 2.5rem 1.5rem; }
      .timeline-featured-card h3 { font-size: 1.8rem; }
      .proyecto-card { padding: 1.75rem 1.5rem; }
    }
  `],
  template: `
    <app-navbar></app-navbar>

    <!-- HERO SECTION -->
    <section class="page-hero">
      <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80" alt="Estudiantes graduándose" class="hero-bg-image" />
      <div class="hero-overlay"></div>
      <div class="page-hero-container">
        <h1>Proyectos de <span>Grado</span></h1>
        <p>Culminación del proceso de aprendizaje, donde nuestros estudiantes aplican sus conocimientos para resolver problemas reales de la región y el país mediante la tecnología.</p>
      </div>
    </section>

    <main class="page-body">

      <!-- MISION, VISION, PROPOSITO -->
      <section>
        <div class="section-header-block">
          <span class="section-tag-pill">Fundamentos</span>
          <h2 class="section-main-title">Sentido del Trabajo de Grado</h2>
        </div>
        <div class="mvp-grid">
          <div class="mvp-card">
            <div class="mvp-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
            </div>
            <h3>Propósito</h3>
            <p>Verificar el nivel de madurez académica y profesional del estudiante, demostrando su capacidad para aplicar herramientas de ingeniería de sistemas en la solución de problemas reales.</p>
          </div>
          <div class="mvp-card">
            <div class="mvp-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            </div>
            <h3>Misión</h3>
            <p>Fomentar el desarrollo de proyectos innovadores que aporten al crecimiento tecnológico de Buenaventura y la región del Pacífico, garantizando calidad académica y ética profesional.</p>
          </div>
          <div class="mvp-card">
            <div class="mvp-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </div>
            <h3>Visión</h3>
            <p>Consolidarnos como un referente en la producción de soluciones tecnológicas y de software que impacten directamente en la mejora de procesos sociales, educativos y empresariales.</p>
          </div>
        </div>
      </section>

      <!-- ALTERNATIVAS DE GRADO -->
      <section>
        <div class="section-header-block">
          <span class="section-tag-pill">Opciones</span>
          <h2 class="section-main-title">Alternativas de Grado</h2>
          <p class="section-description">Como estudiante de Ingeniería de Sistemas, tienes diversas opciones para completar tu requisito de grado según tus intereses profesionales y académicos.</p>
        </div>

        <div class="alternativas-container">
          <!-- TABS -->
          <div class="alt-tabs-wrap">
            @for (alt of alternativas; track alt.id) {
              <button 
                class="alt-tab" 
                [class.active]="activeAlternativa() === alt.id"
                (click)="activeAlternativa.set(alt.id)">
                <span [innerHTML]="alt.icono"></span>
                {{ alt.nombre }}
              </button>
            }
          </div>

          <!-- TAB CONTENT -->
          <div class="alt-content">
            @for (alt of alternativas; track alt.id) {
              @if (activeAlternativa() === alt.id) {
                <div>
                  <div class="alt-header">
                    <h3>{{ alt.nombre }}</h3>
                    <p>{{ alt.descripcion }}</p>
                  </div>
                  
                  <div class="alt-details-grid">
                    <div class="detail-block">
                      <h4>Requisitos Previos</h4>
                      <ul class="check-list">
                        @for (req of alt.requisitos; track req) {
                          <li>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                            <span>{{ req }}</span>
                          </li>
                        }
                      </ul>
                    </div>
                    
                    <div class="detail-block">
                      <h4>Proceso a Seguir</h4>
                      <ul class="step-list">
                        @for (paso of alt.proceso; track paso; let i = $index) {
                          <li>
                            <div class="step-number">{{ i + 1 }}</div>
                            <div class="step-text">{{ paso }}</div>
                          </li>
                        }
                      </ul>
                    </div>
                  </div>
                </div>
              }
            }
          </div>
        </div>
      </section>

      <!-- CALENDARIO DE GRADOS -->
      <section>
        <div class="section-header-block">
          <span class="section-tag-pill">Cronograma</span>
          <h2 class="section-main-title">Calendario Académico de Grados</h2>
          <p class="section-description">Fechas estipuladas para el proceso de aprobación y sustentación de los trabajos de grado en el presente semestre.</p>
        </div>

        <div class="interactive-timeline">
          <!-- TRACK HORIZONTAL -->
          <div class="timeline-track-container">
            <div class="timeline-line"></div>
            <div class="timeline-nodes">
              @for (hito of calendario; track hito.evento; let i = $index) {
                <button 
                  class="timeline-node" 
                  [class.active]="activeHitoIndex() === i"
                  (click)="activeHitoIndex.set(i)">
                  <div class="node-dot"></div>
                  <span class="node-date">{{ hito.fecha.split(',')[0] }}</span>
                </button>
              }
            </div>
          </div>

          <!-- TARJETA DESTACADA -->
          <div class="timeline-featured-card">
            <div class="featured-date">{{ calendario[activeHitoIndex()].fecha }}</div>
            <h3>{{ calendario[activeHitoIndex()].evento }}</h3>
            <p>{{ calendario[activeHitoIndex()].descripcion }}</p>
          </div>
        </div>
      </section>

      <!-- DOCUMENTOS Y PLANTILLAS -->
      <section>
        <div class="docs-banner">
          <div class="docs-info">
            <h3>Documentos y Plantillas</h3>
            <p>Accede a nuestro repositorio oficial para descargar los formatos de inscripción, plantillas institucionales para tesis y lineamientos metodológicos para la redacción de tu proyecto de grado.</p>
          </div>
          <a href="https://drive.google.com/drive/my-drive" target="_blank" rel="noopener noreferrer" class="btn-drive">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Acceder al Drive
          </a>
        </div>
      </section>

      <!-- GALERIA DE PROYECTOS -->
      <section>
        <div class="section-header-block">
          <span class="section-tag-pill">Repositorio</span>
          <h2 class="section-main-title">Proyectos Destacados</h2>
          <p class="section-description">Explora los anteproyectos y trabajos de grado recientes desarrollados por nuestros estudiantes, aportando valor e innovación.</p>
        </div>

        <div class="proyectos-grid">
          @for (proyecto of proyectos; track proyecto.id) {
            <div class="proyecto-card">
              <span class="proyecto-anio">Periodo {{ proyecto.anio }}</span>
              <h4>{{ proyecto.titulo }}</h4>
              <p>{{ proyecto.descripcion }}</p>
              
              <div class="proyecto-meta">
                <div class="meta-row">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                  <span><strong>Estudiantes:</strong> {{ proyecto.estudiantes.join(', ') }}</span>
                </div>
                <div class="meta-row">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  <span><strong>Director:</strong> {{ proyecto.director }}</span>
                </div>
              </div>
            </div>
          }
        </div>
      </section>

    </main>
  `
})
export class ProyectoGradoComponent {
  // DATA DE ALTERNATIVAS
  activeAlternativa = signal<string>('pasantia');
  activeHitoIndex = signal<number>(0);

  alternativas: AlternativaGrado[] = [
    {
      id: 'pasantia',
      nombre: 'Pasantías',
      icono: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
      descripcion: 'Aplicación de conocimientos teóricos y metodológicos en el entorno empresarial real, resolviendo problemas específicos de una organización.',
      requisitos: [
        'Haber cursado y aprobado como mínimo el 80% de los créditos del plan de estudios.',
        'Carta de aceptación por parte de la empresa o institución donde se realizará la pasantía.',
        'Aprobación del plan de trabajo por parte del comité de trabajos de grado.'
      ],
      proceso: [
        'Presentar solicitud de inscripción al Comité de Trabajos de Grado con carta de aceptación.',
        'Asignación de un docente supervisor por parte de la universidad.',
        'Desarrollo de la pasantía por un tiempo mínimo de 6 meses (o 300 horas).',
        'Entrega de informes mensuales de avance.',
        'Presentación y sustentación del informe final de resultados.'
      ]
    },
    {
      id: 'diplomado',
      nombre: 'Diplomado',
      icono: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
      descripcion: 'Actualización y profundización en temáticas de vanguardia tecnológica, orientadas a desarrollar competencias específicas y avanzadas.',
      requisitos: [
        'Haber terminado y aprobado el 100% del plan de estudios.',
        'Estar a paz y salvo académica y financieramente con el programa.',
        'El diplomado debe estar ofertado por la Universidad u otra institución aprobada.'
      ],
      proceso: [
        'Inscripción oficial en el diplomado ofrecido por el programa o institución aliada.',
        'Asistencia mínima del 80% a las sesiones programadas.',
        'Aprobación de los módulos con una calificación superior a 3.5/5.0.',
        'Desarrollo de un artículo corto o proyecto aplicativo final.',
        'Solicitud de reconocimiento como alternativa de grado a la dirección.'
      ]
    },
    {
      id: 'tesina',
      nombre: 'Tesina',
      icono: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
      descripcion: 'Desarrollo de un trabajo de investigación formal que contribuye a la solución de un problema teórico o práctico de la región, aportando conocimiento estructurado.',
      requisitos: [
        'Haber cursado Metodología de la Investigación y Formulación de Proyectos.',
        'Contar con un director de tesis aprobado por el programa.',
        'Anteproyecto radicado y aprobado por el comité.'
      ],
      proceso: [
        'Elaboración y sustentación del Anteproyecto.',
        'Aprobación del anteproyecto por parte de los jurados evaluadores.',
        'Ejecución del proyecto (Desarrollo del software o investigación teórica).',
        'Entrega del documento final (Tomo) y código fuente.',
        'Sustentación pública del proyecto final.'
      ]
    },
    {
      id: 'transferencia',
      nombre: 'Transferencia',
      icono: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/><polyline points="16 16 12 12 8 16"/></svg>',
      descripcion: 'Participación en grupos de investigación o desarrollo de proyectos de impacto social, transfiriendo productos tecnológicos directamente a las comunidades.',
      requisitos: [
        'Estar vinculado como auxiliar a un grupo o semillero de investigación por al menos 1 año.',
        'Tener un producto tecnológico viable y funcional listo para transferencia.',
        'Carta de interés de la comunidad o entidad receptora.'
      ],
      proceso: [
        'Presentar el modelo de transferencia y el producto ante el comité.',
        'Firma de actas de compromiso con la comunidad o entidad beneficiaria.',
        'Capacitación y despliegue del sistema en el entorno real.',
        'Evaluación del impacto y uso por parte de los beneficiarios finales.',
        'Entrega de actas de satisfacción como requisito final.'
      ]
    }
  ];

  // DATA DEL CALENDARIO
  calendario: HitoCalendario[] = [
    { fecha: '15 de Agosto, 2026', evento: 'Recepción de Anteproyectos', descripcion: 'Fecha límite para entregar el formato de anteproyecto ante la dirección del programa.' },
    { fecha: '02 de Septiembre, 2026', evento: 'Asignación de Jurados', descripcion: 'El comité evalúa las propuestas y asigna a los dos jurados revisores por cada proyecto.' },
    { fecha: '30 de Septiembre, 2026', evento: 'Devolución con Correcciones', descripcion: 'Los jurados entregan las actas de evaluación con observaciones para corregir.' },
    { fecha: '15 de Octubre, 2026', evento: 'Entrega Final', descripcion: 'Entrega de los tomos finales empastados y el código fuente digital.' },
    { fecha: '05 - 10 de Noviembre, 2026', evento: 'Jornadas de Sustentación', descripcion: 'Defensas públicas de los proyectos de grado ante el auditorio.' },
    { fecha: '20 de Noviembre, 2026', evento: 'Envío a Biblioteca', descripcion: 'Entrega final de actas aprobatorias y documentación a la Biblioteca de la institución.' }
  ];

  // DATA DE PROYECTOS DE EJEMPLO
  proyectos: ProyectoGrado[] = [
    {
      id: 1,
      titulo: 'Sistema Predictivo de Mareas basado en Machine Learning para Pescadores de Buenaventura',
      descripcion: 'Desarrollo de un algoritmo inteligente que analiza datos históricos climatológicos para predecir anomalías en las mareas, alertando a comunidades costeras mediante una app móvil.',
      director: 'Ing. Carlos Valencia, MSc.',
      estudiantes: ['Juan David Torres', 'Maria Camila Angulo'],
      anio: 2026
    },
    {
      id: 2,
      titulo: 'Plataforma de Trazabilidad Logística Portuaria mediante Blockchain',
      descripcion: 'Implementación de un registro descentralizado (Smart Contracts) para el seguimiento transparente y seguro de contenedores en el puerto marítimo, reduciendo tiempos de espera.',
      director: 'Ing. Elena Riascos',
      estudiantes: ['Jader Rivas', 'Luis Fernando Ocoró'],
      anio: 2025
    },
    {
      id: 3,
      titulo: 'Automatización del Sistema de Votaciones del Consejo Superior (E-Voting)',
      descripcion: 'Construcción de un entorno web seguro con autenticación biométrica y encriptación E2E para las elecciones institucionales de representantes estudiantiles.',
      director: 'Ing. Jhonatan Estacio',
      estudiantes: ['Kevin Mosquera', 'Angela Mina'],
      anio: 2025
    },
    {
      id: 4,
      titulo: 'Sistema de Gestión Hospitalaria Integral para el Hospital Distrital',
      descripcion: 'Software arquitecturado bajo microservicios para la centralización de historias clínicas electrónicas, agendamiento de citas y control de inventario de farmacia.',
      director: 'Ing. Andrés Perlaza',
      estudiantes: ['Daniela Cuero'],
      anio: 2024
    }
  ];
}
