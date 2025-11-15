import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../services/usuario-service';
import { ArticuloService } from '../../services/articulo-service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  returnUrl: string = '/';
  currentRoute: string = '';
  hoverRoute: string | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private articuloService: ArticuloService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.returnUrl = this.route.snapshot?.queryParams?.['returnUrl'] || '/';
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
      }
    });
  }

  isActive(route: string): boolean {
    if (this.hoverRoute === route) return true;

    if (this.hoverRoute === null) {
      if (route === '/') {
        return this.currentRoute === '/';
      } else {
        return this.currentRoute.startsWith(route);
      }
    }

    return false;
  }

  onMouseEnter(route: string) {
    this.hoverRoute = route;
  }

  onMouseLeave() {
    this.hoverRoute = null;
  }

  userLoggedIn(): boolean {
    return !!this.usuarioService.getUsuarioActual();
  }

  userLogged(): string {
    return this.usuarioService.getUsuarioActual()?.username ?? '';
  }

  isAdmin(): boolean {
    return this.usuarioService.isAdmin();
  }

  logOut(): void {
    this.usuarioService.logout();
    this.articuloService.limpiarCarrito();
    this.router.navigateByUrl(this.returnUrl);
  }
}
