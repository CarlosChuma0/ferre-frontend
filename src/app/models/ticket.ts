import { Articulo } from "./articulo";

export class Ticket {
  id: number;
  fecha: Date;
  items: { articulo: Articulo; cantidad: number }[];
  total: number;

  constructor(id: number, items: { articulo: Articulo; cantidad: number }[]) {
    this.id = id;
    this.fecha = new Date();
    this.items = items;
    this.total = items.reduce((sum, i) => sum + i.articulo.precio * i.cantidad, 0);
  }
}