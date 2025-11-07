// src/app/services/ticket-service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ArticuloService } from './articulo-service';
import { UsuarioService } from './usuario-service';
import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiTicketResumen } from '../api/api-types';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private base = environment.apiBaseUrl;

  constructor(
    private http: HttpClient,
    private articuloService: ArticuloService,
    private usuarioService: UsuarioService
  ) {}

  /** POST /api/tickets/compra */
  finalizarCompra$(): Observable<ApiTicketResumen> {
    const clienteId = this.usuarioService.userId;
    if (!clienteId) return throwError(() => new Error('Usuario no logueado'));

    const carrito = this.articuloService.getCarrito();
    if (!carrito.length) return throwError(() => new Error('Carrito vacío'));

    const body = {
      clienteId,
      lineas: carrito.map(i => ({
        articuloId: i.articulo.id,
        cantidad: i.cantidad,
        // si querés forzar precio desde front:
        precioUnitario: i.articulo.precio
      }))
    };

    return this.http.post<ApiTicketResumen>(`${this.base}/tickets/compra`, body).pipe(
      tap(() => this.articuloService.limpiarCarrito())
    );
  }

  /** GET /api/tickets/{id} (por si querés reconsultar) */
  getById$(id: number) {
    return this.http.get<ApiTicketResumen>(`${this.base}/tickets/${id}`);
  }
}
