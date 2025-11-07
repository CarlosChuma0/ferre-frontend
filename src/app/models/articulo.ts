export class Articulo {
    id: number;
    nombre: string;
    precio: number;
    descripcion: string;
    stock: number;
    estado: boolean;

    constructor(id: number, nombre: string, precio: number, descripcion: string, stock: number, estado: boolean) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.descripcion = descripcion;
        this.stock = stock;
        this.estado = estado;
    }
}
