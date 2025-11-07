// src/app/services/articulo-service.ts
import { Injectable } from '@angular/core';
import { Articulo } from '../models/articulo';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ApiArticulo } from '../api/api-types';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { mapApiArticuloToArticulo } from '../api/mappers/articulo.mapper';

@Injectable({ providedIn: 'root' })
export class ArticuloService {
  private base = environment.apiBaseUrl; // debería ser '/api'
  private articulos: Articulo[] = [];
  private carrito: { articulo: Articulo; cantidad: number }[] = [];

  constructor(private http: HttpClient) {
    this.inicializarArticulos();
  }

  private inicializarArticulos(): void {
    this.articulos = [
      new Articulo(1, 'Martillo', 3500, 'Martillo de acero reforzado', 12, true),
      new Articulo(2, 'Destornillador', 1200, 'Destornillador plano', 30, true),
      new Articulo(3, 'Taladro inalámbrico', 28500, 'Taladro recargable 18V', 5, true),
      new Articulo(4, 'Llave inglesa', 5200, 'Llave inglesa ajustable', 8, true),
      new Articulo(5, 'Cinta métrica', 950, 'Cinta de 5 metros', 25, true)
    ];
  }

  // GET /api/articulos/top10
  getTop10$() {
    return this.http.get<ApiArticulo[]>(`${this.base}/articulos/top10`).pipe(
      map(list => list.filter(a => a.estado).map(mapApiArticuloToArticulo)),
      catchError(() => of(this.getArticulos())) // fallback mock si falla
    );
  }

  // PUT /api/articulos/{id}/stock?delta=...&adminId=...
  ajustarStock$(id: number, delta: number, adminId: number) {
    const params = new HttpParams()
      .set('delta', String(delta))
      .set('adminId', String(adminId));

    return this.http
      .put<ApiArticulo>(`${this.base}/articulos/${id}/stock`, null, { params })
      .pipe(map(mapApiArticuloToArticulo));
  }

  // --------- Métodos locales (carrito) ---------
  getArticulos(): Articulo[] {
    return this.articulos.filter(a => a.estado === true);
  }

  eliminarArticulo(id: number): void {
    const index = this.articulos.findIndex(a => a.id === id);
    if (index !== -1) this.articulos.splice(index, 1);
  }

  getCarrito() { return this.carrito; }

  agregarAlCarrito(articulo: Articulo, cantidad: number = 1): void {
    if (cantidad <= 0) return;
    const item = this.carrito.find(i => i.articulo.id === articulo.id);
    if (item) item.cantidad += cantidad; else this.carrito.push({ articulo, cantidad });
  }

  quitarDelCarrito(id: number): void {
    this.carrito = this.carrito.filter(i => i.articulo.id !== id);
  }

  limpiarCarrito(): void {
    this.carrito = [];
  }
}