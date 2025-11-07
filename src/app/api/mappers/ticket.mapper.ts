import { ApiTicketResumen } from '../api-types';
import { Ticket } from '../../models/ticket';
import { Articulo } from '../../models/articulo';

type ItemBasico = { articulo: Articulo; cantidad: number };

/** Para GET por id: no hay ítems → devolvemos Ticket con items=[] */
export function mapApiTicketResumenToTicket(api: ApiTicketResumen): Ticket {
  const t = new Ticket(api.id, []);  // sin items (el back no los devuelve)
  t.fecha = new Date(api.fecha);
  t.total = api.total;
  return t;
}

/** Para POST compra: usamos los ítems del carrito que acabamos de enviar */
export function mapApiCompraToTicket(api: ApiTicketResumen, itemsUsados: ItemBasico[]): Ticket {
  const t = new Ticket(api.id, itemsUsados);
  t.fecha = new Date(api.fecha);
  t.total = api.total; // si querés respetar el total del back
  return t;
}
