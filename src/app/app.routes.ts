import { Routes } from '@angular/router';
import { Index } from './components/index/index';
import { Login } from './components/login/login';
import { Registro } from './components/registro/registro';
import { Inventario } from './components/inventario/inventario';
import { Compra } from './components/compra/compra';
import { Confirmacion } from './components/confirmacion/confirmacion';

export const routes: Routes = [
    {
        path: '',
        component: Index
    },
    {
        path: 'login',
        component: Login
    },
    {
        path: 'registro',
        component: Registro
    },
    {
        path: 'inventario',
        component: Inventario
    },
    {
        path: 'compra',
        component: Compra
    },
    {
        path: 'confirmacion',
        component: Confirmacion
    },
    {   path: '**',
        redirectTo: '',
        pathMatch: 'full'
    }
];
