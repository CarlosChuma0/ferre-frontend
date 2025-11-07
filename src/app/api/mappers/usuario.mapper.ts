// src/app/api/mappers/usuario.mapper.ts
import { ApiUsuario } from '../api-types';
import { Usuario } from '../../models/usuario';

export function mapApiUsuarioToUsuario(u: ApiUsuario): Usuario {
  const usr = new Usuario(
    u.id,
    u.nombre,
    u.email,   // usamos email como username
    u.email,
    '',        // nunca guardamos password del back
    u.estado
  );
  (usr as any).tipoUsuario = u.tipoUsuario; 
  return usr;
}