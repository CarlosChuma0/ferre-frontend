export interface ApiArticulo {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  precioLista: number;
  stock: number;
  estado: boolean;
}

export interface ApiCliente {
  id: number;
  nombre: string;
  email: string;
  passwordHash?: string;
  telefono: string;
  tipoUsuario: string;
  creadoEn: string;
  estado: boolean;
  dni: string;
  cuitCuil: string;
  direccion: string;
  categoriaFiscal: string;
}

export interface ApiTicketResumen {
  id: number;
  fecha: string;
  total: number;
  tipoTicket: string;
  cliente: ApiCliente;
  estado: boolean;
}

export interface ApiUsuario extends ApiCliente {} // login / register devuelven esto
