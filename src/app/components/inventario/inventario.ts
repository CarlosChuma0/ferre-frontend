// src/app/components/inventario/inventario.ts
import { Component } from '@angular/core';
import { ArticuloService } from '../../services/articulo-service';
import { Articulo } from '../../models/articulo';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario-service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

type ArticuloEditable = Articulo & { stockEditable: number };

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventario.html',
  styleUrl: './inventario.css',
})
export class Inventario {
  articulos: ArticuloEditable[] = [];
  loading = false;
  errorMsg = '';

  constructor(
    private articuloService: ArticuloService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.usuarioService.isAdmin()) {
      this.router.navigateByUrl('/');
      return;
    }
    this.refrescar();
  }

  private refrescar() {
    this.loading = true;
    this.articuloService.getTop10$().subscribe({
      next: (list: Articulo[]) => {
        this.articulos = list.map(a => ({ ...a, stockEditable: a.stock })) as ArticuloEditable[];
        this.loading = false;
      },
      error: () => {
        const local = this.articuloService.getArticulos();
        this.articulos = local.map(a => ({ ...a, stockEditable: a.stock })) as ArticuloEditable[];
        this.loading = false;
      }
    });
  }

  onEditStock(art: ArticuloEditable, val: number) {
    art.stockEditable = Number(val);
  }

  guardarCambios(art: ArticuloEditable) {
    this.errorMsg = '';
    const nuevo = Number(art.stockEditable ?? art.stock);
    const actual = Number(art.stock);
    const delta = nuevo - actual;
     if (!Number.isFinite(nuevo)) { alert('Valor de stock inválido'); return; }
  if (delta === 0) { return; } // nada que guardar

  const adminId = this.usuarioService.userId ?? 1;

  // DEBUG: confirmá que el click dispara y el delta es correcto
  console.log('[Inventario] PUT ajustarStock', { id: art.id, delta, adminId });

  this.loading = true;
  this.articuloService.ajustarStock$(art.id, delta, adminId).subscribe({
    next: (aAct) => {
      art.stock = aAct.stock;
      art.stockEditable = aAct.stock;
      this.loading = false;
    },
    error: (err) => {
      this.errorMsg = err?.error?.message || 'No se pudo ajustar el stock.';
      this.loading = false;
    }
  });
}
}
