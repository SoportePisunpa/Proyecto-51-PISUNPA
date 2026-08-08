import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

interface EjeSocial {
  id: string;
  nombre: string;
  icono: string;
  descripcion: string;
  detalles: string[];
}

@Component({
  selector: 'app-proyeccion-social',
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
    .mvp-card h3 { font-size: 1.4rem; font-weight: 800; color: #0f172a; margin: 0; }
    .mvp-card p { font-size: 1rem; color: #475569; line-height: 1.7; margin: 0; }

    /* ===== EJES (Tabs) ===== */
    .ejes-container { display: flex; flex-direction: column; gap: 2rem; }
    .ejes-tabs-wrap { display: flex; gap: 1rem; overflow-x: auto; padding-bottom: 0.5rem; scrollbar-width: none; }
    .ejes-tabs-wrap::-webkit-scrollbar { display: none; }
    .eje-tab {
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
    .eje-tab:hover { border-color: #cbd5e1; color: #334155; background: #f8fafc; }
    .eje-tab.active { background: #15803d; border-color: #15803d; color: #ffffff; box-shadow: 0 4px 14px rgba(21, 128, 61, 0.3); }

    .eje-content { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 24px; padding: 3rem; box-shadow: 0 8px 30px rgba(0,0,0,0.03); }
    .eje-header { margin-bottom: 2.5rem; padding-bottom: 2rem; border-bottom: 1px solid #e2e8f0; }
    .eje-header h3 { font-size: 2rem; font-weight: 800; color: #0f172a; margin-bottom: 1rem; }
    .eje-header p { font-size: 1.1rem; color: #475569; line-height: 1.7; margin: 0; }

    .eje-details-grid { display: grid; grid-template-columns: 1fr; gap: 3rem; }
    .detail-block h4 { font-size: 1.2rem; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem; }
    .detail-block h4::before { content: ''; display: block; width: 6px; height: 20px; border-radius: 3px; background: #4ade80; }
    
    .check-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 1rem; }
    .check-list li { display: flex; align-items: flex-start; gap: 0.75rem; font-size: 1rem; color: #334155; line-height: 1.6; }
    .check-list li svg { width: 22px; height: 22px; color: #15803d; flex-shrink: 0; margin-top: 2px; }

    /* ===== RESPONSIVE ===== */
    @media (max-width: 1024px) {
      .mvp-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 640px) {
      .page-hero { padding: 8rem 1.5rem 4rem; min-height: 50vh; }
      .page-hero h1 { font-size: 2.6rem; }
      .page-body { padding: 4rem 1.25rem; gap: 4.5rem; }
      .eje-content { padding: 2rem 1.5rem; }
    }
  `],
  template: `
    <app-navbar></app-navbar>

    <!-- HERO SECTION -->
    <section class="page-hero">
      <img src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1600&q=80" alt="Proyección Social" class="hero-bg-image" />
      <div class="hero-overlay"></div>
      <div class="page-hero-container">
        <h1>Proyección <span>Social</span></h1>
        <p>Conectamos el conocimiento académico y tecnológico con las comunidades de nuestra región para generar impacto social, innovación y desarrollo sostenible.</p>
      </div>
    </section>

    <main class="page-body">

      <!-- MISION, VISION, PROPOSITO -->
      <section>
        <div class="section-header-block">
          <span class="section-tag-pill">Fundamentos</span>
          <h2 class="section-main-title">Impacto Comunitario</h2>
        </div>
        <div class="mvp-grid">
          <div class="mvp-card">
            <div class="mvp-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
            </div>
            <h3>Propósito</h3>
            <p>Fomentar el desarrollo integral y sustentable de las comunidades de Buenaventura mediante la transferencia efectiva de soluciones y conocimientos tecnológicos.</p>
          </div>
          <div class="mvp-card">
            <div class="mvp-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            </div>
            <h3>Misión</h3>
            <p>Articular el quehacer académico e investigativo de la Ingeniería de Sistemas con las necesidades reales del entorno social y empresarial del Pacífico.</p>
          </div>
          <div class="mvp-card">
            <div class="mvp-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </div>
            <h3>Visión</h3>
            <p>Ser reconocidos como el programa líder en innovación social y tecnológica comunitaria, promoviendo espacios de transformación e inclusión digital en toda la región.</p>
          </div>
        </div>
      </section>

      <!-- EJES DE PROYECCIÓN -->
      <section>
        <div class="section-header-block">
          <span class="section-tag-pill">Líneas de Acción</span>
          <h2 class="section-main-title">Ejes de Proyección Social</h2>
          <p class="section-description">Nuestra proyección se fundamenta en 6 ejes estratégicos que permiten al programa interactuar de manera activa y propositiva con la sociedad.</p>
        </div>

        <div class="ejes-container">
          <!-- TABS -->
          <div class="ejes-tabs-wrap">
            @for (eje of ejes; track eje.id) {
              <button 
                class="eje-tab" 
                [class.active]="activeEje() === eje.id"
                (click)="activeEje.set(eje.id)">
                <span [innerHTML]="eje.icono"></span>
                {{ eje.nombre }}
              </button>
            }
          </div>

          <!-- CONTENIDO DEL TABS -->
          @for (eje of ejes; track eje.id) {
            @if (activeEje() === eje.id) {
              <div class="eje-content">
                <div class="eje-header">
                  <h3>{{ eje.nombre }}</h3>
                  <p>{{ eje.descripcion }}</p>
                </div>
                
                <div class="eje-details-grid">
                  <div class="detail-block">
                    <h4>Impacto y Actividades</h4>
                    <ul class="check-list">
                      @for (detalle of eje.detalles; track detalle) {
                        <li>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          {{ detalle }}
                        </li>
                      }
                    </ul>
                  </div>
                </div>
              </div>
            }
          }
        </div>
      </section>
    </main>
  `
})
export class ProyeccionSocialComponent {
  activeEje = signal<string>('pasantias');

  ejes: EjeSocial[] = [
    {
      id: 'pasantias',
      nombre: 'Pasantías',
      icono: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
      descripcion: 'Prácticas empresariales que acercan a los estudiantes al mundo laboral mediante convenios con el sector productivo.',
      detalles: [
        'Convenios activos con la Cámara de Comercio de Buenaventura, Alcaldía Distrital y empresas portuarias.',
        'Actualmente contamos con más de 45 pasantes activos trabajando en entidades de la región.',
        'Acompañamiento docente para asegurar la calidad de la práctica profesional.',
        'Evaluación continua del desempeño y retroalimentación con empleadores.'
      ]
    },
    {
      id: 'extension',
      nombre: 'Extensión',
      icono: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
      descripcion: 'Llevamos el conocimiento y la formación directamente a la comunidad, democratizando el acceso a la tecnología.',
      detalles: [
        'Cursos de ofimática y herramientas digitales dictados gratuitamente a población vulnerable.',
        'Visitas regulares a colegios de educación media para enseñar bases de programación y robótica.',
        'Jornadas de alfabetización digital para adultos mayores y pequeños emprendedores locales.',
        'Semilleros abiertos a la comunidad general durante fines de semana.'
      ]
    },
    {
      id: 'egresados',
      nombre: 'Egresados',
      icono: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
      descripcion: 'Seguimiento y fortalecimiento de los lazos con nuestros profesionales que ya se encuentran transformando la industria.',
      detalles: [
        'Bolsa de empleo exclusiva y ferias laborales para graduados del programa.',
        'Nuestros muchachos se encuentran trabajando en reconocidas empresas de software a nivel nacional e internacional.',
        'Charlas de graduados destacados que regresan como mentores para los estudiantes actuales.',
        'Red de egresados (Alumni) para la creación de oportunidades y networking profesional.'
      ]
    },
    {
      id: 'emprendimiento',
      nombre: 'Emprendimiento',
      icono: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
      descripcion: 'Apoyo constante a la mentalidad creadora y empresarial, transformando proyectos de clase en verdaderas Startups.',
      detalles: [
        'Acompañamiento especializado en incubación de ideas de negocio de base tecnológica.',
        'Realización de la Feria Anual de Emprendimiento Universitario.',
        'Charlas constantes sobre innovación, creación de empresas y finanzas para startups.',
        'Asesoría técnica y de modelo de negocios para participar en convocatorias como Fondo Emprender.'
      ]
    },
    {
      id: 'internacionalizacion',
      nombre: 'Internacionalización',
      icono: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
      descripcion: 'Conectamos a nuestros estudiantes con dinámicas globales mediante la movilidad académica y colaboración externa.',
      detalles: [
        'Convenios de movilidad estudiantil y pasantías internacionales.',
        'Participación en proyectos de investigación conjunta con universidades de otros países.',
        'Clases espejo con docentes internacionales en asignaturas de alto perfil tecnológico.',
        'Capacitación en el dominio de segunda lengua enfocada a certificaciones y TI.'
      ]
    },
    {
      id: 'articulacion',
      nombre: 'Articulación',
      icono: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="M12 22v-8.3a4 4 0 0 0-1.17-2.83L5 5"/><path d="M12 22v-8.3a4 4 0 0 1 1.17-2.83L19 5"/></svg>',
      descripcion: 'Creamos puentes directos entre la educación media y superior para garantizar un tránsito armónico y exitoso.',
      detalles: [
        'Alianzas con colegios técnicos de la región para homologar saberes de estudiantes destacados.',
        'Campamentos de inmersión tecnológica para estudiantes de grados 10º y 11º.',
        'Capacitación a docentes de bachillerato en nuevas herramientas educativas y de programación.',
        'Jornadas de puertas abiertas ("Universidad por un día") para aspirantes.'
      ]
    }
  ];
}
