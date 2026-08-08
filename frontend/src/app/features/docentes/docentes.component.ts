import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

interface DocentePerfil {
  id: number;
  nombre: string;
  cargo: string;
  categoria: 'Administrativo' | 'Docente';
  titulos: string[];
  experienciaAnos: number;
  materias: string[];
  perfilMini: string;
  perfilCompleto: string;
  fotoUrl: string;
}

@Component({
  selector: 'app-docentes',
  standalone: true,
  imports: [RouterLink, FormsModule, NavbarComponent],
  changeDetection: ChangeDetectionStrategy.Default,
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

    /* HERO */
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
    .page-hero-container { position: relative; z-index: 10; max-width: 700px; margin: 0; text-align: left; }
    .page-hero h1 { font-size: 3.5rem; font-weight: 900; color: #ffffff; letter-spacing: -0.035em; line-height: 1.1; margin-bottom: 1.25rem; text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5); }
    .page-hero h1 span { color: #4ade80; }
    .page-hero p { font-size: 1.15rem; color: #e2e8f0; line-height: 1.65; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5); }

    /* BODY */
    .page-body { padding: 5rem 2rem; max-width: 1350px; margin: 0 auto; }

    .docentes-sub-header {
      margin-top: 1rem;
      margin-bottom: 2rem;
      padding-bottom: 1.1rem;
      border-bottom: 2px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
      scroll-margin-top: 100px;
    }
    .docentes-sub-header-title { display: flex; align-items: center; gap: 0.85rem; }
    .docentes-sub-header-bar { width: 5px; height: 30px; border-radius: 3px; background: linear-gradient(180deg, #15803d, #4ade80); flex-shrink: 0; }
    .docentes-sub-header h3 { font-size: 1.65rem; font-weight: 900; color: #0f172a; letter-spacing: -0.02em; line-height: 1.2; }
    .docentes-sub-header p.section-caption { font-size: 0.85rem; color: #64748b; font-weight: 500; margin-top: 0.15rem; }
    .docentes-badge-pill { background: #f0fdf4; color: #15803d; font-size: 0.78rem; font-weight: 800; padding: 0.4rem 0.9rem; border-radius: 999px; border: 1px solid #bbf7d0; white-space: nowrap; }

    /* FILTER / SEARCH BAR */
    .docentes-filter-bar {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      flex-wrap: wrap;
      margin-bottom: 1.75rem;
    }
    .search-input-wrap { position: relative; flex: 1 1 300px; }
    .search-input-wrap svg { position: absolute; left: 0.95rem; top: 50%; transform: translateY(-50%); width: 17px; height: 17px; color: #94a3b8; pointer-events: none; }
    .search-input {
      width: 100%;
      padding: 0.7rem 1rem 0.7rem 2.75rem;
      border-radius: 12px;
      border: 1.5px solid #e2e8f0;
      background: #ffffff;
      font-family: inherit;
      font-size: 0.88rem;
      color: #0f172a;
      transition: all 0.2s ease;
    }
    .search-input::placeholder { color: #94a3b8; }
    .search-input:focus { outline: none; border-color: #15803d; box-shadow: 0 0 0 4px rgba(21, 128, 61, 0.1); }

    .filter-chips { display: flex; gap: 0.55rem; flex-wrap: wrap; }
    .filter-chip {
      padding: 0.62rem 1.1rem;
      border-radius: 999px;
      border: 1.5px solid #e2e8f0;
      background: #ffffff;
      color: #475569;
      font-size: 0.82rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
      font-family: inherit;
    }
    .filter-chip:hover { border-color: #15803d; color: #15803d; }
    .filter-chip.active { background: #15803d; border-color: #15803d; color: #ffffff; box-shadow: 0 4px 12px rgba(21, 128, 61, 0.25); }

    .results-count { font-size: 0.84rem; color: #64748b; font-weight: 500; margin-bottom: 1.25rem; }
    .results-count strong { color: #0f172a; font-weight: 800; }

    /* GRIDS */
    .directivos-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.75rem;
      margin-bottom: 5rem;
    }
    .planta-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
      gap: 1.75rem;
      margin-bottom: 2.5rem;
    }

    /* CARD MODERN */
    .docente-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 18px;
      padding: 1.85rem 1.65rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
      height: 100%;
      position: relative;
      overflow: hidden;
    }
    .docente-card:hover { border-color: #86efac; transform: translateY(-6px); box-shadow: 0 20px 36px rgba(21, 128, 61, 0.1); }

    .docente-card-header { display: flex; align-items: flex-start; gap: 1.1rem; margin-bottom: 1.15rem; }
    .docente-photo { width: 68px; height: 68px; border-radius: 50%; object-fit: cover; border: 3px solid #f0fdf4; flex-shrink: 0; box-shadow: 0 4px 10px rgba(0,0,0,0.06); }
    .docente-meta { min-width: 0; }
    .docente-meta h5 { font-size: 1.08rem; font-weight: 800; color: #0f172a; margin-bottom: 0.2rem; line-height: 1.25; }
    .docente-cargo { font-size: 0.83rem; font-weight: 700; color: #15803d; display: block; margin-bottom: 0.3rem; }
    .docente-exp-tag { font-size: 0.74rem; font-weight: 600; color: #64748b; margin: 0; display: flex; align-items: center; gap: 0.3rem; }
    .docente-exp-tag svg { flex-shrink: 0; }

    .docente-subjects { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1.1rem; min-height: 1.8rem; align-content: flex-start; }
    .subject-chip { font-size: 0.71rem; font-weight: 700; background: #f8fafc; color: #475569; padding: 0.28rem 0.65rem; border-radius: 7px; border: 1px solid #e2e8f0; line-height: 1.3; }
    .subject-chip--more { background: transparent; border-style: dashed; color: #15803d; border-color: #86efac; }

    .docente-card p.mini-bio {
      font-size: 0.87rem;
      color: #475569;
      line-height: 1.6;
      margin-bottom: 1.35rem;
      flex-grow: 1;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .btn-ver-perfil {
      align-self: flex-start;
      margin-top: auto;
      font-size: 0.83rem;
      font-weight: 800;
      color: #15803d;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      padding: 0.55rem 1rem;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s ease;
      width: 100%;
      justify-content: center;
    }
    .docente-card:hover .btn-ver-perfil { background: #15803d; color: #ffffff; border-color: #15803d; }
    .btn-ver-perfil svg { width: 16px; height: 16px; transition: transform 0.2s ease; }
    .docente-card:hover .btn-ver-perfil svg { transform: translateX(4px); }

    /* NO RESULTS */
    .no-results-state {
      text-align: center;
      padding: 3.5rem 2rem;
      background: #ffffff;
      border: 1.5px dashed #cbd5e1;
      border-radius: 18px;
      color: #64748b;
      margin-bottom: 2.5rem;
    }
    .no-results-state svg { width: 40px; height: 40px; color: #cbd5e1; margin-bottom: 0.85rem; }
    .no-results-state p { font-size: 0.95rem; font-weight: 600; color: #334155; margin-bottom: 1rem; }
    .no-results-clear {
      border: 1.5px solid #15803d;
      background: transparent;
      color: #15803d;
      font-weight: 700;
      font-size: 0.85rem;
      padding: 0.55rem 1.25rem;
      border-radius: 10px;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s ease;
    }
    .no-results-clear:hover { background: #15803d; color: #ffffff; }

    /* PAGINATION */
    .pagination-wrap { display: flex; flex-direction: column; align-items: center; gap: 0.65rem; margin-top: 0.5rem; margin-bottom: 4rem; }
    .pagination-container {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    .pagination-status { font-size: 0.8rem; color: #94a3b8; font-weight: 600; }
    .page-btn {
      width: 42px;
      height: 42px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      border: 1px solid #cbd5e1;
      background: #ffffff;
      color: #334155;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 5px rgba(0,0,0,0.02);
    }
    .page-btn:hover:not(:disabled) {
      border-color: #15803d;
      color: #15803d;
      background: #f0fdf4;
      transform: translateY(-2px);
    }
    .page-btn.active {
      background: #15803d;
      color: #ffffff;
      border-color: #15803d;
      box-shadow: 0 4px 12px rgba(21, 128, 61, 0.3);
    }
    .page-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      transform: none;
    }

    /* MODAL */
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
    .docente-modal {
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
    .modal-docente-photo { width: 110px; height: 110px; border-radius: 50%; object-fit: cover; border: 4px solid #4ade80; flex-shrink: 0; box-shadow: 0 8px 20px rgba(0,0,0,0.3); }
    .modal-docente-title h3 { font-size: 1.8rem; font-weight: 900; color: #ffffff; margin-bottom: 0.4rem; letter-spacing: -0.02em; }
    .modal-docente-title p { font-size: 1rem; color: #4ade80; font-weight: 700; margin-bottom: 0.5rem; }
    .modal-docente-title span { font-size: 0.85rem; color: #94a3b8; }



    .modal-body-content { padding: 3rem; display: flex; flex-direction: column; gap: 2.5rem; }
    .modal-section-block h5 { font-size: 0.95rem; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem; }
    .modal-section-block h5::before { content: ''; width: 24px; height: 3px; background: #15803d; border-radius: 2px; }
    .modal-section-block p { font-size: 1rem; color: #334155; line-height: 1.75; }
    .modal-titles-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.85rem; }
    .modal-titles-list li { font-size: 0.95rem; color: #334155; font-weight: 500; display: flex; align-items: flex-start; gap: 0.75rem; line-height: 1.5; }
    .modal-titles-list li::before { content: '🎓'; font-size: 1.1rem; flex-shrink: 0; margin-top: -0.1rem; }

    /* FOOTER */
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
      .directivos-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 640px) {
      .page-hero { padding: 8rem 1.5rem 4rem; }
      .page-hero h1 { font-size: 2.5rem; }
      .directivos-grid, .planta-grid { grid-template-columns: 1fr; }
      .modal-header-banner { flex-direction: column; text-align: center; padding: 3rem 1.5rem 2rem; }
      .modal-body-content { padding: 2rem 1.5rem; }
      .docentes-sub-header { align-items: flex-start; }
      .docentes-filter-bar { flex-direction: column; align-items: stretch; }
      .filter-chips { justify-content: flex-start; }
    }
  `],
  template: `
    <app-navbar></app-navbar>

    <!-- HERO WITH UNSPLASH BACKGROUND IMAGE -->
    <section class="page-hero">
      <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1600&q=80" alt="Docentes Universitarios" class="hero-bg-image" />
      <div class="hero-overlay"></div>

      <div class="page-hero-container">
        <h1>Nuestros Docentes y <span>Directivos</span></h1>
        <p>
          Conoce al equipo docente y administrativo del Programa de Ingeniería de Sistemas de la Universidad del Pacífico.
        </p>
      </div>
    </section>

    <!-- BODY -->
    <main class="page-body">
      <!-- PARTE ADMINISTRATIVA -->
      <div class="docentes-sub-header">
        <div class="docentes-sub-header-title">
          <span class="docentes-sub-header-bar"></span>
          <div>
            <h3>Administración del Programa</h3>
            <p class="section-caption">Dirección académica y gestión administrativa</p>
          </div>
        </div>
        <span class="docentes-badge-pill">{{ directivosPrograma.length }} integrantes</span>
      </div>

      <div class="directivos-grid">
        @for (doc of directivosPrograma; track doc.id) {
          <div class="docente-card" (click)="abrirModalDocente(doc)">
            <div>
              <div class="docente-card-header">
                <img [src]="doc.fotoUrl" [alt]="doc.nombre" class="docente-photo" />
                <div class="docente-meta">
                  <h5>{{ doc.nombre }}</h5>
                  <span class="docente-cargo">{{ doc.cargo }}</span>
                  <p class="docente-exp-tag">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {{ doc.experienciaAnos }} años exp.
                  </p>
                </div>
              </div>

              <div class="docente-subjects">
                @for (m of doc.materias.slice(0, 3); track m) {
                  <span class="subject-chip">{{ m }}</span>
                }
                @if (doc.materias.length > 3) {
                  <span class="subject-chip subject-chip--more">+{{ doc.materias.length - 3 }}</span>
                }
              </div>

              <p class="mini-bio">{{ doc.perfilMini }}</p>
            </div>

            <button class="btn-ver-perfil">
              Ver perfil y títulos
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>
        }
      </div>

      <!-- CUERPO DOCENTE DE PLANTA -->
      <div class="docentes-sub-header" id="docentes-planta">
        <div class="docentes-sub-header-title">
          <span class="docentes-sub-header-bar"></span>
          <div>
            <h3>Cuerpo Docente de Planta</h3>
            <p class="section-caption">Profesores especializados por área de conocimiento</p>
          </div>
        </div>
        <span class="docentes-badge-pill">{{ docentesPlanta.length }} docentes</span>
      </div>

      <!-- BUSCADOR Y FILTROS -->
      <div class="docentes-filter-bar">
        <div class="search-input-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="text"
            class="search-input"
            placeholder="Buscar por nombre, cargo o asignatura..."
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearchChange()"
          />
        </div>
        <div class="filter-chips">
          <button class="filter-chip" [class.active]="activeFilter === 'todos'" (click)="setFilter('todos')">Todos</button>
          <button class="filter-chip" [class.active]="activeFilter === 'doctorado'" (click)="setFilter('doctorado')">Doctorado</button>
          <button class="filter-chip" [class.active]="activeFilter === 'magister'" (click)="setFilter('magister')">Magíster</button>
        </div>
      </div>

      <p class="results-count">
        Mostrando <strong>{{ paginatedDocentes.length }}</strong> de <strong>{{ docentesFiltrados.length }}</strong> docentes
      </p>

      @if (paginatedDocentes.length > 0) {
        <div class="planta-grid">
          @for (doc of paginatedDocentes; track doc.id) {
            <div class="docente-card" (click)="abrirModalDocente(doc)">
              <div>
                <div class="docente-card-header">
                  <img [src]="doc.fotoUrl" [alt]="doc.nombre" class="docente-photo" />
                  <div class="docente-meta">
                    <h5>{{ doc.nombre }}</h5>
                    <span class="docente-cargo">{{ doc.cargo }}</span>
                    <p class="docente-exp-tag">
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {{ doc.experienciaAnos }} años exp.
                    </p>
                  </div>
                </div>

                <div class="docente-subjects">
                  @for (m of doc.materias.slice(0, 3); track m) {
                    <span class="subject-chip">{{ m }}</span>
                  }
                  @if (doc.materias.length > 3) {
                    <span class="subject-chip subject-chip--more">+{{ doc.materias.length - 3 }}</span>
                  }
                </div>

                <p class="mini-bio">{{ doc.perfilMini }}</p>
              </div>

              <button class="btn-ver-perfil">
                Ver perfil completo
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </div>
          }
        </div>
      } @else {
        <div class="no-results-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto; display: block;"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <p>No encontramos docentes que coincidan con tu búsqueda.</p>
          <button class="no-results-clear" (click)="limpiarFiltros()">Limpiar filtros</button>
        </div>
      }

      <!-- PAGINATION CONTROLS -->
      @if (totalPages > 1) {
        <div class="pagination-wrap">
          <div class="pagination-container">
            <button class="page-btn" [disabled]="currentPage === 1" (click)="changePage(currentPage - 1)">‹</button>

            @for (page of pagesArray; track page) {
              <button class="page-btn" [class.active]="page === currentPage" (click)="changePage(page)">
                {{ page }}
              </button>
            }

            <button class="page-btn" [disabled]="currentPage === totalPages" (click)="changePage(currentPage + 1)">›</button>
          </div>
          <span class="pagination-status">Página {{ currentPage }} de {{ totalPages }}</span>
        </div>
      }
    </main>

    <!-- MODAL DOCENTE -->
    @if (docenteSeleccionado) {
      <div class="modal-backdrop" (click)="cerrarModalDocente()">
        <div class="docente-modal" (click)="$event.stopPropagation()">
          <div class="modal-header-banner">
            <button class="btn-close-modal" (click)="cerrarModalDocente()">✕</button>
            <img [src]="docenteSeleccionado.fotoUrl" [alt]="docenteSeleccionado.nombre" class="modal-docente-photo" />
            <div class="modal-docente-title">
              <h3>{{ docenteSeleccionado.nombre }}</h3>
              <p>{{ docenteSeleccionado.cargo }}</p>
              <span>{{ docenteSeleccionado.experienciaAnos }} Años de Experiencia Académica y Profesional</span>
            </div>
          </div>

          <div class="modal-body-content">
            <div class="modal-section-block">
              <h5>Perfil Académico & Profesional</h5>
              <p>{{ docenteSeleccionado.perfilCompleto }}</p>
            </div>

            <div class="modal-section-block">
              <h5>Títulos y Grados Académicos</h5>
              <ul class="modal-titles-list">
                @for (t of docenteSeleccionado.titulos; track t) {
                  <li>{{ t }}</li>
                }
              </ul>
            </div>

            <div class="modal-section-block">
              <h5>Asignaturas Impartidas</h5>
              <div class="docente-subjects">
                @for (m of docenteSeleccionado.materias; track m) {
                  <span class="subject-chip" style="font-size: 0.85rem; padding: 0.4rem 0.85rem;">{{ m }}</span>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- FOOTER -->
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
export class DocentesComponent {
  docenteSeleccionado: DocentePerfil | null = null;
  currentPage = 1;
  itemsPerPage = 6; // Shows 6 cards per page

  searchQuery = '';
  activeFilter: 'todos' | 'doctorado' | 'magister' = 'todos';

  abrirModalDocente(doc: DocentePerfil): void {
    this.docenteSeleccionado = doc;
  }

  cerrarModalDocente(): void {
    this.docenteSeleccionado = null;
  }

  setFilter(filter: 'todos' | 'doctorado' | 'magister'): void {
    this.activeFilter = filter;
    this.currentPage = 1;
  }

  onSearchChange(): void {
    this.currentPage = 1;
  }

  limpiarFiltros(): void {
    this.searchQuery = '';
    this.activeFilter = 'todos';
    this.currentPage = 1;
  }

  get docentesFiltrados(): DocentePerfil[] {
    let list = this.docentesPlanta;

    if (this.activeFilter === 'doctorado') {
      list = list.filter(d => d.titulos.some(t => t.toLowerCase().includes('doctor')));
    } else if (this.activeFilter === 'magister') {
      list = list.filter(d => d.titulos.some(t => t.toLowerCase().includes('magíster') || t.toLowerCase().includes('maestría')));
    }

    const q = this.searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(d =>
        d.nombre.toLowerCase().includes(q) ||
        d.cargo.toLowerCase().includes(q) ||
        d.materias.some(m => m.toLowerCase().includes(q))
      );
    }

    return list;
  }

  get paginatedDocentes(): DocentePerfil[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.docentesFiltrados.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.docentesFiltrados.length / this.itemsPerPage));
  }

  get pagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      // Scroll to the top of the grid with a slight offset for the header
      const element = document.getElementById('docentes-planta');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  readonly directivosPrograma: DocentePerfil[] = [
    {
      id: 1,
      nombre: 'Dr. Carlos A. Rentería',
      cargo: 'Director del Programa',
      categoria: 'Administrativo',
      titulos: [
        'Doctor en Ciencias de la Computación — Universidad Nacional de Colombia',
        'Magíster en Ingeniería de Software y Sistemas',
        'Ingeniero de Sistemas — Universidad del Pacífico'
      ],
      experienciaAnos: 18,
      materias: ['Dirección Académica', 'Arquitectura de Software', 'Seminario de Investigación'],
      perfilMini: 'Líder en gestión de calidad académica, acreditación institucional y desarrollo estratégico del programa.',
      perfilCompleto: 'Investigador sénior con más de 18 años de experiencia en la docencia universitaria y la administración educativa. Ha liderado procesos de acreditación de alta calidad y publicaciones internacionales en sistemas distribuidos y educación tecnológica territorial.',
      fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
    },
    {
      id: 101, // ID in intermedial value
      nombre: 'MSc. Andrés L. Palacios',
      cargo: 'Secretario Académico',
      categoria: 'Administrativo',
      titulos: [
        'Magíster en Administración Educativa',
        'Ingeniero de Sistemas — Universidad del Pacífico'
      ],
      experienciaAnos: 15,
      materias: ['Coordinación Académica', 'Evaluación de Programas'],
      perfilMini: 'Responsable de la planificación curricular y el seguimiento continuo del desempeño estudiantil.',
      perfilCompleto: 'Experto en procesos de administración y gestión educativa universitaria. Encargado de coordinar la oferta académica semestral, asegurar el cumplimiento de la carga horaria y facilitar la comunicación directa entre docentes, estudiantes y la dirección.',
      fotoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80'
    },
    {
      id: 2,
      nombre: 'Ing. Sandra M. Mosquera',
      cargo: 'Secretaria',
      categoria: 'Administrativo',
      titulos: [
        'Especialista en Gestión Educativa',
        'Ingeniera de Sistemas — Universidad del Pacífico'
      ],
      experienciaAnos: 12,
      materias: ['Gestión Documental', 'Atención Estudiantil'],
      perfilMini: 'Atención y validación formal de solicitudes estudiantiles, seguimiento a notas y registro supletorio.',
      perfilCompleto: 'Especialista en administración con 12 años de trayectoria continuada en la Universidad del Pacífico. Encargada de la supervisión formal de calendarios académicos, admisiones, emisión de constancias y procesos supletorios institucionales.',
      fotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80'
    }
  ];

  readonly docentesPlanta: DocentePerfil[] = [
    {
      id: 3,
      nombre: 'MSc. Wilman A. Quiñónez Valencia',
      cargo: 'Gestor Proyecto 51',
      categoria: 'Docente',
      titulos: ['Magíster en Ciencia de Datos', 'Magíster en Inteligencia Artificial Aplicada', 'Ingeniero de Sistemas'],
      experienciaAnos: 10,
      materias: ['Electiva Profesional III', 'Laboratorio Tecnológico III', 'Inteligencia Artificial', 'Sistemas Operativos'],
      perfilMini: 'Líder y gestor del Proyecto 51. Especialista en ciencia de datos, inteligencia artificial e innovación tecnológica.',
      perfilCompleto: 'Ingeniero de Sistemas y Magíster en Ciencia de Datos e IA Aplicada por la Universidad Icesi. Ha liderado la concepción, estructuración e implementación del Proyecto 51, una estrategia de Project-Based Learning que integra conocimientos mediante soluciones reales. Su área de especialidad incluye Machine Learning, Deep Learning, MLOps, Arquitectura de Soluciones y Transformación Digital.',
      fotoUrl: 'assets/images/desarrolladores/Wilman.jpeg'
    },
    {
      id: 4,
      nombre: 'Dr. Hernán F. Mina',
      cargo: 'Investigador AI',
      categoria: 'Docente',
      titulos: ['Doctor en IA', 'Magíster en Ciencias de Computación'],
      experienciaAnos: 16,
      materias: ['Inteligencia Artificial', 'Aprendizaje Automático'],
      perfilMini: 'Especialista en inteligencia artificial, analítica de datos y computación de alto rendimiento.',
      perfilCompleto: 'Experto en desarrollo de modelos predictivos y algoritmos de visión por computador. Lidera proyectos de analítica de datos aplicados al contexto del Pacífico colombiano.',
      fotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80'
    },
    {
      id: 5,
      nombre: 'MSc. Andrés F. Caicedo',
      cargo: 'Docente de Software',
      categoria: 'Docente',
      titulos: ['Magíster en Desarrollo de Software', 'Ingeniero de Sistemas'],
      experienciaAnos: 10,
      materias: ['Prog. Web Avanzada', 'Arquitectura de Software'],
      perfilMini: 'Orientación en diseño de sistemas distribuidos, microservicios y desarrollo web moderno.',
      perfilCompleto: 'Desarrollador e investigador en arquitecturas cloud native y microservicios. Docente de materias de programación orientada a objetos y frameworks modernos en Angular y Django.',
      fotoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80'
    },
    {
      id: 6,
      nombre: 'Ing. Beatriz E. Córdoba',
      cargo: 'Docente de Redes',
      categoria: 'Docente',
      titulos: ['Especialista en Ciberseguridad', 'Ingeniera de Sistemas'],
      experienciaAnos: 11,
      materias: ['Redes de Computadores', 'Seguridad de la Información'],
      perfilMini: 'Investigadora en ciberseguridad, redes de datos e infraestructura tecnológica.',
      perfilCompleto: 'Consultora en seguridad informática y administración de infraestructura de red. Docente encargada del laboratorio de redes y auditoría de sistemas.',
      fotoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80'
    },
    {
      id: 7,
      nombre: 'MSc. Mateo A. Quiñones',
      cargo: 'Proyectos de Grado',
      categoria: 'Docente',
      titulos: ['Magíster en Metodología Científica', 'Ingeniero de Sistemas'],
      experienciaAnos: 9,
      materias: ['Metodología de la Investigación', 'Proyecto de Grado I'],
      perfilMini: 'Acompañamiento y tutoría en metodologías de investigación e innovación tecnológica.',
      perfilCompleto: 'Tutor de trabajos de grado con énfasis en desarrollo de soluciones tecnológicas aplicadas al territorio del Pacífico.',
      fotoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&q=80'
    },
    {
      id: 8,
      nombre: 'Ing. Yulieth P. Rivas',
      cargo: 'Gestora Académica',
      categoria: 'Docente',
      titulos: ['Especialista en Telecomunicaciones', 'Ingeniera de Sistemas'],
      experienciaAnos: 8,
      materias: ['Bases de Datos I', 'Sistemas de Información'],
      perfilMini: 'Docente experta en modelado de datos relacionales y gestión de eventos tecnológicos.',
      perfilCompleto: 'Docente investigadora orientada a la ingeniería de datos y la organización de simposios académicos y eventos de divulgación científica.',
      fotoUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=256&q=80'
    },
    {
      id: 9,
      nombre: 'Dr. Luis M. Salazar',
      cargo: 'Docente de Matemáticas',
      categoria: 'Docente',
      titulos: ['Doctor en Matemáticas Aplicadas', 'Licenciado en Física'],
      experienciaAnos: 20,
      materias: ['Cálculo Multivariable', 'Ecuaciones Diferenciales'],
      perfilMini: 'Especialista en métodos numéricos y optimización matemática para ingeniería.',
      perfilCompleto: 'Investigador y líder del departamento de ciencias básicas con 20 años de experiencia impartiendo física matemática y estadística computacional.',
      fotoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80'
    },
    {
      id: 10,
      nombre: 'MSc. Diana C. Gómez',
      cargo: 'Docente de Humanidades',
      categoria: 'Docente',
      titulos: ['Magíster en Filosofía y Ética', 'Profesional en Sociología'],
      experienciaAnos: 15,
      materias: ['Ética Profesional', 'Competencias Ciudadanas'],
      perfilMini: 'Docente orientada al desarrollo humanístico, el pensamiento crítico y la ética profesional.',
      perfilCompleto: 'Investigadora en impactos socio-tecnológicos, promueve la reflexión ética sobre la inteligencia artificial y el rol del ingeniero en la sociedad contemporánea.',
      fotoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80'
    },
    {
      id: 11,
      nombre: 'Ing. Carlos E. Banguera',
      cargo: 'Especialista en IoT',
      categoria: 'Docente',
      titulos: ['Especialista en Electrónica Digital', 'Ingeniero de Sistemas'],
      experienciaAnos: 7,
      materias: ['Arquitectura de Computadores', 'Sistemas Embebidos'],
      perfilMini: 'Experto en robótica, Internet de las Cosas (IoT) y hardware de bajo nivel.',
      perfilCompleto: 'Líder del semillero de robótica e IoT de la universidad, impulsa proyectos de domótica y automatización con microcontroladores.',
      fotoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80'
    },
    {
      id: 12,
      nombre: 'MSc. Roberto C. Hinestroza',
      cargo: 'Sistemas Operativos',
      categoria: 'Docente',
      titulos: ['Magíster en Sistemas de Información', 'Ingeniero en Computación'],
      experienciaAnos: 13,
      materias: ['Sistemas Operativos', 'Linux y Servidores'],
      perfilMini: 'Administrador avanzado de sistemas UNIX/Linux y arquitecturas distribuidas.',
      perfilCompleto: 'Certificado en múltiples tecnologías cloud y arquitecturas Linux. Fomenta el uso de software libre y open source en la formación integral de los ingenieros.',
      fotoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=256&q=80'
    },
    {
      id: 13,
      nombre: 'MSc. Juliana P. Torres',
      cargo: 'Especialista en DevOps',
      categoria: 'Docente',
      titulos: ['Magíster en Ingeniería de Software', 'Ingeniera de Sistemas'],
      experienciaAnos: 6,
      materias: ['Pruebas de Software', 'CI/CD & DevOps'],
      perfilMini: 'Experta en metodologías ágiles, control de versiones y despliegue continuo.',
      perfilCompleto: 'Ha trabajado como Ingeniera DevOps en la industria por más de 5 años. Aporta la visión pragmática del mundo laboral a los procesos de integración y entrega continua.',
      fotoUrl: 'https://images.unsplash.com/photo-1589571894960-20bbe2828d0a?auto=format&fit=crop&w=256&q=80'
    },
    {
      id: 14,
      nombre: 'Ing. Francisco J. López',
      cargo: 'Docente Emprendimiento',
      categoria: 'Docente',
      titulos: ['Especialista en Innovación Empresarial', 'Ingeniero Industrial'],
      experienciaAnos: 10,
      materias: ['Innovación y Emprendimiento', 'Formulación de Proyectos'],
      perfilMini: 'Líder de la incubadora de empresas y promotor del espíritu emprendedor tecnológico.',
      perfilCompleto: 'Ayuda a los estudiantes a transformar sus proyectos de grado en startups tecnológicas funcionales y rentables, conectándolos con capital semilla.',
      fotoUrl: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=256&q=80'
    },
    {
      id: 15,
      nombre: 'Dr. Diego H. Castillo',
      cargo: 'Especialista en Big Data',
      categoria: 'Docente',
      titulos: ['Doctor en Ciencia de Datos', 'Estadístico'],
      experienciaAnos: 19,
      materias: ['Minería de Datos', 'Estadística Computacional'],
      perfilMini: 'Experto en procesamiento de grandes volúmenes de datos y machine learning.',
      perfilCompleto: 'Lidera investigaciones sobre análisis predictivo aplicado a problemas logísticos y ambientales del puerto de Buenaventura usando ecosistemas Hadoop y Spark.',
      fotoUrl: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=256&q=80'
    },
    {
      id: 16,
      nombre: 'Ing. María A. Vásquez',
      cargo: 'Diseñadora UX/UI',
      categoria: 'Docente',
      titulos: ['Especialista en Interacción Humano-Computador', 'Diseñadora Interactiva'],
      experienciaAnos: 8,
      materias: ['Interacción Humano-Computador', 'Diseño de Interfaces'],
      perfilMini: 'Especialista en accesibilidad web, diseño centrado en el usuario y usabilidad.',
      perfilCompleto: 'Consultora de diseño de producto digital. Enseña a los estudiantes de ingeniería la importancia de una buena experiencia de usuario (UX) para el éxito de cualquier software.',
      fotoUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=256&q=80'
    },
    {
      id: 17,
      nombre: 'MSc. Alberto K. Sinisterra',
      cargo: 'Consultor SAP',
      categoria: 'Docente',
      titulos: ['Magíster en Sistemas ERP', 'Ingeniero de Sistemas'],
      experienciaAnos: 12,
      materias: ['Sistemas de Información Gerencial', 'Bases de Datos Avanzadas'],
      perfilMini: 'Consultor en sistemas empresariales ERP y arquitectura de bases de datos empresariales.',
      perfilCompleto: 'Más de 10 años implementando soluciones SAP en la industria portuaria y logística. Imparte conocimientos sobre la alineación entre TI y los objetivos de negocio.',
      fotoUrl: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&w=256&q=80'
    },
    {
      id: 18,
      nombre: 'Ing. Viviana M. Murillo',
      cargo: 'Desarrolladora Mobile',
      categoria: 'Docente',
      titulos: ['Especialista en Computación Móvil', 'Ingeniera de Sistemas'],
      experienciaAnos: 9,
      materias: ['Programación de Dispositivos Móviles', 'Computación Ubicua'],
      perfilMini: 'Desarrolladora experta en Android, iOS y frameworks multiplataforma como Flutter.',
      perfilCompleto: 'Apasionada por la creación de aplicaciones móviles de alto rendimiento. Enseña arquitecturas móviles, consumo de APIs y publicación de aplicaciones en tiendas oficiales.',
      fotoUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=256&q=80'
    },
    {
      id: 19,
      nombre: 'MSc. Edwin J. Perea',
      cargo: 'Especialista en Cloud',
      categoria: 'Docente',
      titulos: ['Magíster en Computación en la Nube', 'Ingeniero Telemático'],
      experienciaAnos: 11,
      materias: ['Sistemas Distribuidos', 'Computación en la Nube'],
      perfilMini: 'Arquitecto Cloud certificado en AWS, Azure y Google Cloud Platform.',
      perfilCompleto: 'Su enseñanza se centra en diseñar arquitecturas altamente escalables, resilientes y tolerantes a fallos utilizando infraestructura como código y servicios serverless.',
      fotoUrl: 'https://images.unsplash.com/photo-1479865103639-6512eb8bd287?auto=format&fit=crop&w=256&q=80'
    },
    {
      id: 20,
      nombre: 'Dr. Simón E. Cárdenas',
      cargo: 'Líder de Investigación',
      categoria: 'Docente',
      titulos: ['Doctor en Ingeniería Informática', 'Ingeniero de Sistemas'],
      experienciaAnos: 22,
      materias: ['Seminario de Investigación II', 'Proyecto de Grado'],
      perfilMini: 'Coordinador del comité de investigaciones y líder de categorización de grupos ante Minciencias.',
      perfilCompleto: 'Pionero en la investigación informática en el Pacífico. Ha publicado docenas de artículos en revistas indexadas y asesora proyectos de impacto regional.',
      fotoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=256&q=80'
    },
    {
      id: 21,
      nombre: 'Ing. Gloria I. Sánchez',
      cargo: 'Especialista en QA',
      categoria: 'Docente',
      titulos: ['Especialista en Calidad de Software', 'Ingeniera de Sistemas'],
      experienciaAnos: 10,
      materias: ['Aseguramiento de la Calidad', 'Ingeniería de Software'],
      perfilMini: 'Experta en pruebas automatizadas, calidad y testing de aplicaciones.',
      perfilCompleto: 'Dedica sus clases a inculcar la importancia del TDD (Test-Driven Development) y las métricas de calidad de código para reducir la deuda técnica en los proyectos.',
      fotoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80'
    },
    {
      id: 22,
      nombre: 'MSc. Camilo A. Rivas',
      cargo: 'Docente de Videojuegos',
      categoria: 'Docente',
      titulos: ['Magíster en Desarrollo de Videojuegos', 'Ingeniero en Multimedia'],
      experienciaAnos: 7,
      materias: ['Computación Gráfica', 'Desarrollo de Entornos Virtuales'],
      perfilMini: 'Entusiasta del desarrollo de videojuegos, realidad virtual y realidad aumentada.',
      perfilCompleto: 'Imparte la electiva de desarrollo de videojuegos usando motores como Unity y Unreal Engine, fusionando programación avanzada con matemáticas y diseño.',
      fotoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=256&q=80'
    },
    {
      id: 23,
      nombre: 'Dr. Armando F. Quintero',
      cargo: 'Docente de Física',
      categoria: 'Docente',
      titulos: ['Doctor en Física Teórica', 'Físico'],
      experienciaAnos: 25,
      materias: ['Física Mecánica', 'Física Electromagnética'],
      perfilMini: 'Docente apasionado por acercar la física fundamental a los ingenieros de sistemas.',
      perfilCompleto: 'Autor de varios libros de texto universitarios de física. Su método de enseñanza relaciona constantemente las leyes físicas con la tecnología electrónica actual.',
      fotoUrl: 'https://images.unsplash.com/photo-1543269664-7eef42226a21?auto=format&fit=crop&w=256&q=80'
    },
    {
      id: 24,
      nombre: 'Ing. Elena T. Moreno',
      cargo: 'Experta Criptografía',
      categoria: 'Docente',
      titulos: ['Especialista en Seguridad de la Información', 'Ingeniera Matemática'],
      experienciaAnos: 8,
      materias: ['Criptografía Aplicada', 'Seguridad en Redes'],
      perfilMini: 'Investigadora en criptografía moderna, blockchain y seguridad ofensiva.',
      perfilCompleto: 'Fomenta la cultura del hacking ético y coordina competiciones CTF (Capture The Flag) para los estudiantes apasionados por la seguridad informática.',
      fotoUrl: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=256&q=80'
    },
    {
      id: 25,
      nombre: 'MSc. Kevin S. Andrade',
      cargo: 'Ingeniero de Datos',
      categoria: 'Docente',
      titulos: ['Magíster en Ingeniería de Datos', 'Ingeniero de Sistemas'],
      experienciaAnos: 6,
      materias: ['Bases de Datos NoSQL', 'Data Warehousing'],
      perfilMini: 'Especialista en modelado de bases de datos distribuidas y flujos de datos en tiempo real.',
      perfilCompleto: 'Enseña la construcción de pipelines de datos escalables utilizando tecnologías como Apache Kafka, MongoDB, y Cassandra. Certificado en arquitectura de datos en la nube.',
      fotoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80'
    },
    {
      id: 26,
      nombre: 'Ing. Patricia V. Guzmán',
      cargo: 'Analista de Negocios TI',
      categoria: 'Docente',
      titulos: ['Especialista en Inteligencia de Negocios', 'Ingeniera Industrial'],
      experienciaAnos: 14,
      materias: ['Inteligencia de Negocios', 'Análisis de Requerimientos'],
      perfilMini: 'Profesional enfocada en la intersección entre la tecnología y las estrategias comerciales empresariales.',
      perfilCompleto: 'Asesora a corporaciones portuarias en la toma de decisiones basada en datos. Sus clases brindan una perspectiva orientada a convertir requerimientos técnicos en valor real de negocio utilizando PowerBI y Tableau.',
      fotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80'
    }
  ];
}