import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { EstudiantesAprobadosComponent } from '../estudiantes-aprobados/estudiantes-aprobados.component';
import { EstudiantesPendientesComponent } from '../estudiantes-pendientes/estudiantes-pendientes.component';

@Component({
  selector: 'app-gestion-estudiantes',
  standalone: true,
  imports: [EstudiantesAprobadosComponent, EstudiantesPendientesComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './gestion-estudiantes.component.html',
  styles: [`
    .contenedor { padding: 1.5rem; }
    h2 { color: #0a2463; margin-bottom: 0.25rem; }
    .subtitulo { color: #666; margin-bottom: 1rem; font-size: 0.9rem; }
    .tabs {
      display: flex;
      gap: 0.5rem;
      border-bottom: 2px solid #eee;
      margin-bottom: 1.5rem;
    }
    .tab {
      padding: 0.65rem 1.25rem;
      border: none;
      background: transparent;
      font-size: 0.95rem;
      font-weight: 600;
      color: #555;
      cursor: pointer;
      border-bottom: 3px solid transparent;
      margin-bottom: -2px;
    }
    .tab:hover { color: #0a2463; }
    .tab.activa { color: #0a2463; border-bottom-color: #0a2463; }
    .tab-badge {
      display: inline-block;
      background: #dc3545;
      color: #fff;
      border-radius: 10px;
      padding: 0.1rem 0.5rem;
      font-size: 0.75rem;
      margin-left: 0.4rem;
      vertical-align: middle;
    }
  `],
})
export class GestionEstudiantesComponent {
  tabActiva = signal<'aprobados' | 'pendientes'>('aprobados');
  conteoPendientes = signal(0);

  onConteoCambio(conteo: number): void {
    this.conteoPendientes.set(conteo);
  }
}
