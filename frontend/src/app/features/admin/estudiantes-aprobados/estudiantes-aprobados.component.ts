import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosService } from '../../../services/usuarios.service';
import { EgresadosService } from '../../../services/egresados.service';
import { FeedbackService } from '../../../shared/services/feedback.service';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { Usuario } from '../../../models/usuario.model';
import { Programa } from '../../../models/programa.model';

@Component({
  selector: 'app-estudiantes-aprobados',
  standalone: true,
  imports: [CommonModule, ModalComponent, ConfirmDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './estudiantes-aprobados.component.html',
  styles: [`
    .filtros { margin: 1rem 0; }
    .contador { color: #666; font-size: 0.9rem; margin: 0.5rem 0 1rem; }
    .table-scroll { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    th, td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid #eee; }
    th { background: #0a2463; color: white; font-weight: 600; }
    tr:hover { background: #f8f9fa; }
    .vacio { text-align: center; padding: 2rem; background: #f8f9fa; border-radius: 8px; color: #666; }
    .acciones { display: flex; gap: 0.5rem; }
    .btn-editar { padding: 0.4rem 0.8rem; background: #3da5d9; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.8rem; font-weight: 600; }
    .btn-promover { padding: 0.4rem 0.8rem; background: #8e44ad; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.8rem; font-weight: 600; }
    .btn-promover:hover { background: #7d3c98; }
    .programa-badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.8rem; font-weight: 600; background: #e3f2fd; color: #1565c0; }
    .programa-badge.vacio { background: #f5f5f5; color: #666; }
    .cargando { color: #666; text-align: center; padding: 2rem; }
    .modal-cuerpo p { margin: 0 0 1rem; color: #333; }
    .modal-cuerpo label { display: block; font-weight: 600; color: #333; margin-bottom: 0.4rem; }
    .modal-cuerpo select { width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 6px; font-size: 0.95rem; }
    .modal-acciones { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1.25rem; }
    .btn-secundario { padding: 0.5rem 1rem; background: #e9ecef; color: #333; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; }
    .btn-guardar { padding: 0.5rem 1.25rem; background: #0a2463; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; }
    .btn-guardar:disabled { background: #ccc; cursor: not-allowed; }
    .importar-section { background: #fff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); padding: 1.5rem; margin-top: 1.5rem; }
    .importar-header h3 { font-size: 1.1rem; color: #0a2463; margin: 0 0 0.5rem; }
    .importar-descripcion { color: #555; font-size: 0.9rem; margin-bottom: 1rem; line-height: 1.4; }
    .importar-dropzone { border: 2px dashed #ccc; border-radius: 8px; padding: 1.5rem; text-align: center; cursor: pointer; transition: border-color 0.2s, background 0.2s; }
    .importar-dropzone:hover { border-color: #8e44ad; background: #f8f0fc; }
    .importar-dropzone.arrastrando { border-color: #8e44ad; background: #f0e6f6; }
    .importar-dropzone-texto { color: #555; font-size: 0.9rem; }
    .importar-dropzone-texto strong { color: #8e44ad; }
    .importar-dropzone-input { display: none; }
    .archivo-importado { margin-top: 1rem; display: flex; align-items: center; gap: 0.75rem; background: #d4edda; border: 1px solid #c3e6cb; padding: 0.75rem 1rem; border-radius: 6px; }
    .archivo-importado-info { flex: 1; }
    .archivo-importado-info .nombre { font-weight: 600; font-size: 0.9rem; color: #155724; }
    .archivo-importado-info .detalle { font-size: 0.8rem; color: #155724; opacity: 0.8; }
    .btn-importar { display: inline-flex; align-items: center; gap: 0.5rem; background: #8e44ad; color: #fff; border: none; padding: 0.6rem 1.2rem; border-radius: 6px; cursor: pointer; font-size: 0.9rem; font-weight: 500; margin-top: 1rem; }
    .btn-importar:hover { background: #7d3c98; }
    .btn-importar:disabled { background: #ccc; cursor: not-allowed; }
    .btn-quitar-archivo { background: transparent; color: #c0392b; border: none; cursor: pointer; font-size: 0.8rem; font-weight: 500; }
    .formatos-ayuda { margin-top: 0.75rem; font-size: 0.8rem; color: #888; }
    .card-resumen { padding: 0.75rem 1rem; border-radius: 6px; margin-top: 1rem; font-size: 0.9rem; background: #d4edda; color: #155724; }
    .card-resumen .errores { color: #dc3545; font-weight: 600; }
    .card-resumen ul { margin: 0.5rem 0 0; padding-left: 1.25rem; }
  `],
})
export class EstudiantesAprobadosComponent {
  private usuariosService = inject(UsuariosService);
  private egresadosService = inject(EgresadosService);
  private feedback = inject(FeedbackService);

  estudiantes = signal<Usuario[]>([]);
  programas = signal<Programa[]>([]);
  cargando = signal(true);
  filtroNombre = signal('');
  filtroPrograma = signal('');

  estudiantePrograma = signal<Usuario | null>(null);
  mostrarModalPrograma = signal(false);
  programaSeleccionado = signal('');
  estudiantePromover = signal<Usuario | null>(null);

  archivoImportacion = signal<File | null>(null);
  arrastrandoImportacion = signal(false);
  importando = signal(false);
  resultadoImportacion = signal<{ creados: number; duplicados: number; errores: string[]; total_procesados: number } | null>(null);

  constructor() {
    this.egresadosService.getProgramas().subscribe(p => this.programas.set(p));
    this.cargarEstudiantes();
  }

  readonly estudiantesFiltrados = computed(() => {
    const consulta = this.filtroNombre().trim().toLocaleLowerCase();
    const programa = this.filtroPrograma();
    return this.estudiantes().filter(e => {
      const nombre = [e.first_name, e.last_name].filter(Boolean).join(' ').toLocaleLowerCase();
      if (consulta && !nombre.includes(consulta) && !(e.email ?? '').toLocaleLowerCase().includes(consulta)) return false;
      if (programa && e.programa?.id !== programa) return false;
      return true;
    });
  });

  readonly hayFiltrosActivos = computed(() => Boolean(this.filtroNombre().trim() || this.filtroPrograma()));

  cargarEstudiantes(): void {
    this.cargando.set(true);
    this.usuariosService.listarEstudiantes().subscribe({
      next: (data) => {
        this.estudiantes.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.feedback.show('Error al cargar estudiantes.', 'error');
        this.cargando.set(false);
      },
    });
  }

  limpiarFiltros(): void {
    this.filtroNombre.set('');
    this.filtroPrograma.set('');
  }

  onFiltroPrograma(valor: string): void {
    this.filtroPrograma.set(valor);
  }

  abrirPrograma(e: Usuario): void {
    this.estudiantePrograma.set(e);
    this.programaSeleccionado.set(e.programa?.id ?? '');
    this.mostrarModalPrograma.set(true);
  }

  cerrarModalPrograma(): void {
    this.mostrarModalPrograma.set(false);
    this.estudiantePrograma.set(null);
  }

  guardarPrograma(): void {
    const e = this.estudiantePrograma();
    if (!e) return;
    this.usuariosService.cambiarPrograma(e.id, this.programaSeleccionado() || null).subscribe({
      next: (actualizado) => {
        this.estudiantes.update(lista => lista.map(u => u.id === actualizado.id ? actualizado : u));
        this.cerrarModalPrograma();
        this.feedback.show('Programa actualizado.');
      },
      error: (err) => {
        this.feedback.show(err.error?.error || 'Error al actualizar el programa.', 'error');
      },
    });
  }

  solicitarPromover(e: Usuario): void {
    this.estudiantePromover.set(e);
  }

  cancelarPromover(): void {
    this.estudiantePromover.set(null);
  }

  confirmarPromover(): void {
    const e = this.estudiantePromover();
    if (!e) return;
    this.usuariosService.promoverEgresado(e.id, e.programa?.id).subscribe({
      next: () => {
        this.estudiantes.update(lista => lista.filter(u => u.id !== e.id));
        this.cancelarPromover();
        this.feedback.show(`${e.first_name} ${e.last_name} fue promovido a egresado.`);
      },
      error: (err) => {
        this.feedback.show(err.error?.error || 'Error al promover a egresado.', 'error');
        this.cancelarPromover();
      },
    });
  }

  onDragOverImportacion(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.arrastrandoImportacion.set(true);
  }

  onDragLeaveImportacion(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.arrastrandoImportacion.set(false);
  }

  onDropImportacion(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.arrastrandoImportacion.set(false);
    const archivos = event.dataTransfer?.files;
    if (archivos && archivos.length > 0) {
      this.procesarArchivoImportacion(archivos[0]);
    }
  }

  onFileImportacionSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.procesarArchivoImportacion(input.files[0]);
    }
  }

  private procesarArchivoImportacion(archivo: File): void {
    const tiposPermitidos = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    const extensionesPermitidas = ['.csv', '.xls', '.xlsx'];
    const extension = '.' + archivo.name.split('.').pop()?.toLowerCase();

    if (!tiposPermitidos.includes(archivo.type) && !extensionesPermitidas.includes(extension)) {
      this.feedback.show('Solo se permiten archivos CSV o Excel (.csv, .xls, .xlsx).', 'error');
      return;
    }

    this.archivoImportacion.set(archivo);
    this.resultadoImportacion.set(null);
  }

  eliminarArchivoImportacion(): void {
    this.archivoImportacion.set(null);
  }

  procesarImportacion(): void {
    const archivo = this.archivoImportacion();
    if (!archivo) return;

    this.importando.set(true);
    this.usuariosService.importarEstudiantes(archivo).subscribe({
      next: (r) => {
        this.resultadoImportacion.set(r);
        this.importando.set(false);
        this.archivoImportacion.set(null);
        this.cargarEstudiantes();
      },
      error: (err) => {
        this.feedback.show(err.error?.error || 'Error al importar estudiantes.', 'error');
        this.importando.set(false);
      },
    });
  }
}
