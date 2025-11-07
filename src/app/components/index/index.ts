import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Articulo } from '../../models/articulo';
import { ArticuloService } from '../../services/articulo-service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-index',
  imports: [RouterLink, CommonModule],
  templateUrl: './index.html',
  styleUrl: './index.css',
})
export class Index implements OnInit {

  articulos: Articulo[] = [];

  constructor(private articuloService: ArticuloService) {}

  ngOnInit(): void {
    const svc: any = this.articuloService;
    if (typeof svc.getTop10$ === 'function') {
      svc.getTop10$().subscribe({
        next: (list: Articulo[]) => this.articulos = list.slice(0, 5), // 👈 trae top10 del back (o slice)
        error: () => this.articulos = this.articuloService.getArticulos().slice(0, 10) // fallback local
      });
    } else {
      this.articulos = this.articuloService.getArticulos().slice(0, 10);
    }
  }
    
}
