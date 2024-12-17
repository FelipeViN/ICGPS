export interface CalificacionEducativa {
  id: number | null;
  estudainte_id: number;
  grupo_id: number;
  primera_evaluacion: number;
  segunda_evaluacion: number;
  evaluacion_final: number;
  promedio: number;
  creationAt: string;
  updatedAt: string;
}
