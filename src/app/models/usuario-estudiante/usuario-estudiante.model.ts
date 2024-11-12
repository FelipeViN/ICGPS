export interface UsuarioEstudiante {
    id: number;
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
  