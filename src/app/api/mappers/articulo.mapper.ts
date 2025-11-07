import { ApiArticulo } from '../api-types';
import { Articulo } from '../../models/articulo';

export function mapApiArticuloToArticulo(a: ApiArticulo): Articulo {
  return new Articulo(
    a.id,
    a.nombre,
    a.precioLista,    // 👈 mapeo clave
    a.descripcion,
    a.stock,
    a.estado
  );
}