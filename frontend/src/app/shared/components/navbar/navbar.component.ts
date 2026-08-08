import { Component, ChangeDetectionStrategy, signal, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .landing-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: rgba(255, 255, 255, 0.96);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid #e2e8f0;
      padding: 0.85rem 2.5rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
      transition: all 0.3s ease;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
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

    .nav-menu a.nav-link {
      color: #475569;
      text-decoration: none;
      font-size: 0.88rem;
      font-weight: 600;
      transition: color 0.2s ease;
      cursor: pointer;
      position: relative;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .nav-menu a.nav-link:hover, .nav-menu a.nav-link.active, .dropdown-trigger.active {
      color: #15803d;
    }

    .nav-menu a.nav-link.active::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      right: 0;
      height: 2px;
      background: #15803d;
      border-radius: 2px;
    }

    /* DROPDOWN MENU */
    .dropdown {
      position: relative;
    }

    .dropdown-trigger {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      background: none;
      border: none;
      color: #475569;
      font-size: 0.88rem;
      font-weight: 600;
      cursor: pointer;
      padding: 0;
      font-family: inherit;
      transition: color 0.2s ease;
    }
    .dropdown-trigger:hover { color: #15803d; }
    
    .dropdown-trigger svg {
      width: 14px;
      height: 14px;
      transition: transform 0.2s ease;
    }
    .dropdown-trigger[aria-expanded="true"] svg {
      transform: rotate(180deg);
    }

    .dropdown-menu {
      position: absolute;
      top: calc(100% + 1rem);
      right: 50%;
      transform: translateX(50%) translateY(10px);
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
      min-width: 220px;
      padding: 0.5rem;
      opacity: 0;
      visibility: hidden;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      pointer-events: none;
    }

    .dropdown-menu.show {
      opacity: 1;
      visibility: visible;
      transform: translateX(50%) translateY(0);
      pointer-events: auto;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      text-decoration: none;
      color: #334155;
      font-size: 0.88rem;
      font-weight: 600;
      border-radius: 8px;
      transition: all 0.2s ease;
    }

    .dropdown-item:hover {
      background: #f0fdf4;
      color: #15803d;
    }
    .dropdown-item.active {
      background: #f0fdf4;
      color: #15803d;
    }
    
    .dropdown-item svg {
      width: 18px;
      height: 18px;
      color: #94a3b8;
    }
    .dropdown-item:hover svg, .dropdown-item.active svg {
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

    @media (max-width: 1024px) {
      .landing-header { padding: 0.75rem 1.25rem; }
      .nav-menu { display: none; }
    }
  `],
  template: `
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
            <li><a routerLink="/landing" routerLinkActive="active" class="nav-link">Inicio</a></li>
            <li><a routerLink="/programa" routerLinkActive="active" class="nav-link">El Programa</a></li>
            <li><a routerLink="/malla" routerLinkActive="active" class="nav-link">Malla Curricular</a></li>
            <li><a routerLink="/docentes" routerLinkActive="active" class="nav-link">Docentes</a></li>
            <li><a routerLink="/investigacion" routerLinkActive="active" class="nav-link">Investigación</a></li>
            
            <li class="dropdown">
              <button 
                class="dropdown-trigger" 
                [attr.aria-expanded]="isDropdownOpen()" 
                (click)="toggleDropdown($event)">
                Comunidad
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              
              <div class="dropdown-menu" [class.show]="isDropdownOpen()">
                <a routerLink="/proyecto-grado" class="dropdown-item" (click)="closeDropdown()">
                  <div class="dropdown-item-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                    </svg>
                  </div>
                  <div class="dropdown-item-content">
                    <span class="dropdown-item-title">Proyectos de Grado</span>
                  </div>
                </a>
                <a routerLink="/proyeccion-social" routerLinkActive="active" class="dropdown-item" (click)="closeDropdown()">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  Proyección Social
                </a>
              </div>
            </li>
          </ul>
        </nav>

        <div class="nav-actions">
          <a routerLink="/login" class="btn-login-outline">Iniciar Sesión</a>
          <a routerLink="/registro" class="btn-register-solid">Registrarse</a>
        </div>
      </div>
    </header>
  `
})
export class NavbarComponent {
  isDropdownOpen = signal(false);

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.isDropdownOpen.update(v => !v);
  }

  closeDropdown(): void {
    this.isDropdownOpen.set(false);
  }

  @HostListener('document:click')
  onDocumentClick() {
    if (this.isDropdownOpen()) {
      this.closeDropdown();
    }
  }
}
