import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink} from '@angular/router';
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

  constructor(
    private usuarioService: UsuarioService,
    private articuloService: ArticuloService, 
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.returnUrl = this.route.snapshot?.queryParams?.['returnUrl'] || '/';
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
