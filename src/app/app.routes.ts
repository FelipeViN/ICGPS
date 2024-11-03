import { Routes } from '@angular/router';

export const routes: Routes = [
    {path: 'bienvenida',loadComponent:()=>import('./pages/welcome/welcome.component'),},
    {path: 'iniciar-sesion',loadComponent:()=>import('./pages/login-page/login-page.component'),},
    {path: 'datosPersonales',loadComponent:()=>import('./pages/datos-personales/datos-personales.component'),},
    {path: 'alumnos', loadComponent:()=>import('./pages/alumnos/alumnos.component')},
    {path: 'profesores', loadComponent:()=>import('./pages/profesores/profesores.component')},
    {path: 'materias', loadComponent:()=>import('./pages/materias/materias.component')},
    {path: 'grupos', loadComponent:()=>import('./pages/grupos/grupos.component')},
    {path: 'mapa', loadComponent:()=>import('./pages/mapa/mapa.component')},
    {path: 'credencial', loadComponent:()=>import('./pages/credencial/credencial.component')},
    {path: '', redirectTo: 'iniciar-sesion', pathMatch: 'full'},
    { path: '**', redirectTo: '/iniciar-sesion' }
];
