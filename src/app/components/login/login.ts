import { Component } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../../services/usuario-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  email = '';
  password = '';
  msglogin = '';
  returnUrl = '/';
  loading = false;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.returnUrl = this.route.snapshot?.queryParams?.['returnUrl'] || '/';
  }

  logearUsuario() {
    this.msglogin = '';
    if (!this.email || !this.password) {
      this.msglogin = 'Ingresá email y contraseña.';
      return;
    }

    // Si existe login$ (backend): lo usamos
    const asAny = this.usuarioService as any;
    if (typeof asAny.login$ === 'function') {
      this.loading = true;
      asAny.login$(this.email, this.password)
        .pipe(finalize(() => (this.loading = false)))
        .subscribe({
          next: () => this.router.navigateByUrl(this.returnUrl),
          error: (err: any) => {
            // mensaje del backend o genérico
            this.msglogin =
              err?.error?.message || 'Credenciales incorrectas o servicio no disponible.';
          },
        });
      return;
    }

    // Fallback: tu login local en memoria (por si aún no conectaste el back)
    const exito = this.usuarioService.loginUsuario(this.email, this.password);
    if (exito) {
      this.router.navigateByUrl(this.returnUrl);
    } else {
      this.msglogin = 'Credenciales incorrectas.';
    }
  }
}
