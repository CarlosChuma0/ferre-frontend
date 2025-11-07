import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ApiUsuario } from '../api/api-types';
import { mapApiUsuarioToUsuario } from '../api/mappers/usuario.mapper';
import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';
import { ArticuloService } from './articulo-service'; // 👈 inyectamos para limpiar carrito

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private usuarios: Usuario[] = [];
  private usuario: Usuario | null = null;
  private base = environment.apiBaseUrl;

  constructor(private http: HttpClient, private articuloService: ArticuloService) {
    // mock local (opcional). Si querés, marcá este como ADMIN para probar:
    const mock = new Usuario(1, 'Ejemplo', 'EjemploU', 'ejemplo@ejemplo.com', '12345', true);
    (mock as any).tipoUsuario = 'ADMIN';             // 👈 opcional: rol para prueba local
    this.usuarios.push(mock);
  }

  // ********** LOCAL (fallback) **********
  registrarUsuario(usuario: Usuario): boolean {
    const existe = this.usuarios.find(u => u.email === usuario.email || u.username === usuario.username);
    if (existe) return false;
    this.usuarios.push(usuario);
    return true;
  }

  loginUsuario(email: string, password: string): boolean {
    const u = this.usuarios.find(user => user.email === email && user.password === password);
    if (!u) return false;
    this.usuario = u;
    sessionStorage.setItem('username', u.username);
    sessionStorage.setItem('estado', String(u.estado));
    sessionStorage.setItem('userId', String(u.id));
    sessionStorage.setItem('tipoUsuario', (u as any).tipoUsuario || 'CLIENTE');   // 👈 persistimos rol local
    this.articuloService.limpiarCarrito(); // 👈 limpia carrito al loguear
    return true;
  }

  logout(): void {
    this.usuario = null;
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('estado');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('tipoUsuario'); // 👈 limpia rol
    this.articuloService.limpiarCarrito();    // 👈 limpia carrito al salir
  }

  getUsuarioActual(): { username: string; estado: boolean; tipoUsuario?: string } | null {
    if (!this.usuario) {
      const storedUsername = sessionStorage.getItem('username');
      const storedEstado   = sessionStorage.getItem('estado');
      const storedTipo     = sessionStorage.getItem('tipoUsuario');
      if (storedUsername && storedEstado) {
        const tmp = new Usuario(0, storedUsername, storedUsername, '', '', storedEstado === 'true');
        (tmp as any).tipoUsuario = storedTipo || 'CLIENTE';
        this.usuario = tmp;
      }
    }
    return this.usuario ? { username: this.usuario.username, estado: this.usuario.estado, tipoUsuario: (this.usuario as any).tipoUsuario } : null;
  }

  // ********** API **********
  login$(email: string, password: string): Observable<Usuario> {
    return this.http.post<ApiUsuario>(`${this.base}/auth/login`, { email, password }).pipe(
      map(mapApiUsuarioToUsuario),
      tap(u => this.persistirSesion(u, /*limpiar*/ true))
    );
  }

  registrarCliente$(payload: {
    nombre: string; email: string; telefono: string; password: string;
    dni: string; cuit: string; direccion: string; categoriaFiscal: string;
  }): Observable<Usuario> {
    return this.http.post<ApiUsuario>(`${this.base}/auth/register/cliente`, payload).pipe(
      map(mapApiUsuarioToUsuario),
      tap(u => this.persistirSesion(u, /*limpiar*/ true))
    );
  }

  private persistirSesion(u: Usuario, limpiarCarrito = false) {
    this.usuario = u;
    sessionStorage.setItem('username', u.username);
    sessionStorage.setItem('estado', String(u.estado));
    sessionStorage.setItem('userId', String(u.id));
    sessionStorage.setItem('tipoUsuario', (u as any).tipoUsuario || 'CLIENTE');
    if (limpiarCarrito) this.articuloService.limpiarCarrito();
  }

  get userId(): number | null {
    const id = sessionStorage.getItem('userId');
    return id ? Number(id) : null;
  }

  isAdmin(): boolean {
    const rol = sessionStorage.getItem('tipoUsuario');
    return rol?.toLowerCase() === 'admin';
  }
}