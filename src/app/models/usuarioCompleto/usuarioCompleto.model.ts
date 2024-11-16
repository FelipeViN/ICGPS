export interface UsuarioCompleto {
    // Atributos de usuario
    id: number;
    usuarioID:number;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    email: string;
    contraseña: string;
    tipoUsuario: string;
    Estatus: number;
    creationAt: string;
    updatedAt: string;
  
    // Atributos de administrativo
    departamento?: string;
    cargo?: string;
  
    // Atributos de estudiante
    matricula?: string;
    semestre?: number;
  
    // Atributos de profesor
    numeroEmpleado?: string;
    especialidad?: string;
  }
  