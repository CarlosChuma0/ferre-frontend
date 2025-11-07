// src/app/components/compra/compra.ts
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Articulo } from '../../models/articulo';
import { ArticuloService } from '../../services/articulo-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../services/ticket-service';
import { UsuarioService } from '../../services/usuario-service';

@Component({
  selector: 'app-compra',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './compra.html',
  styleUrl: './compra.css',
})
export class Compra implements OnInit {
  articulos: Articulo[] = [];
  carrito: { articulo: Articulo; cantidad: number }[] = [];
  cantidades: { [id: number]: number } = {};
  total = 0;
  userLoggedIn = false;
  loading = false;

  constructor(
    private usuarioService: UsuarioService,
    private articuloService: ArticuloService,
    private ticketService: TicketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userLoggedIn = !!this.usuarioService.getUsuarioActual();
    this.recargar();
  }

  private recargar() {
    this.articulos = this.articuloService.getArticulos();
    this.carrito = this.articuloService.getCarrito();
    this.calcularTotal();
  }

  agregarAlCarrito(articulo: Articulo): void {
    const cantidad = this.cantidades[articulo.id] || 1;
    this.articuloService.agregarAlCarrito(articulo, cantidad);
    this.carrito = this.articuloService.getCarrito();
    this.cantidades[articulo.id] = 1;
    this.calcularTotal();
  }

  quitarDelCarrito(id: number): void {
    this.articuloService.quitarDelCarrito(id);
    this.carrito = this.articuloService.getCarrito();
    this.calcularTotal();
  }

  calcularTotal(): void {
    this.total = this.carrito.reduce(
      (acc, item) => acc + item.articulo.precio * item.cantidad,
      0
    );
  }

  finalizarCompra() {
    if (!this.userLoggedIn) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/compra' } });
      return;
    }
    if (!this.carrito.length) return;

    // snapshot para mostrar en confirmación
    const resumen = this.carrito.map(i => ({
      nombre: i.articulo.nombre,
      cantidad: i.cantidad,
      precio: i.articulo.precio
    }));

    this.loading = true;
    this.ticketService.finalizarCompra$().subscribe({
      next: (t) => {
        this.loading = false;
        // llevamos ticket (resumen backend) + items comprados para render
        this.router.navigate(['/confirmacion'], { state: { ticket: t, resumen } });
      },
      error: (err) => {
        this.loading = false;
        alert(err?.message || 'No se pudo procesar la compra');
      }
    });
  }
}
