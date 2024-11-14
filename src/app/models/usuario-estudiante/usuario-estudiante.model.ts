export interface UsuarioEstudiante {
  id?: number; // Cambiamos `id` para que sea opcional
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    email: string;
    tipoUsuario: string;
    Estatus: number;
    creationAt: string;
    updatedAt: string;
    matricula?: string;
    semestre?: number;
  }
  