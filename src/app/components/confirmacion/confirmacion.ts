import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { Ticket } from '../../models/ticket';
import { TicketService } from '../../services/ticket-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmacion',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './confirmacion.html',
  styleUrl: './confirmacion.css',
})
export class Confirmacion implements OnInit {
  ticket: any = null;   // ApiTicketResumen
  resumen: { nombre: string; cantidad: number; precio: number }[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    const nav = this.router.getCurrentNavigation();
    const st  = nav?.extras?.state || history.state;

    this.ticket  = st?.ticket || null;
    this.resumen = st?.resumen || [];

    if (!this.ticket) {
      // si no hay ticket en state, regresamos a compra
      this.router.navigateByUrl('/compra');
    }
  }

  get totalCalculado() {
    return this.resumen.reduce((acc, i) => acc + (i.precio * i.cantidad), 0);
  }
}
