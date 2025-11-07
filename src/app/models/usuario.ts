export class Usuario {

    id: number;
    nombre: string;
    username: string;
    email: string;
    password: string;
    estado: boolean;
    tipoUsuario?: string;

    constructor(id: number, nombre: string, username: string, email: string, password: string, estado: boolean) {
        this.id = id;
        this.nombre = nombre;
        this.username = username;
        this.email = email;
        this.password = password;
        this.estado = estado;
    }
}
