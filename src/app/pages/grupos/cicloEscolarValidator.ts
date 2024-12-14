import { AbstractControl, ValidationErrors } from '@angular/forms';

// Validador personalizado para el campo cicloEscolar
export function cicloEscolarValidator(control: AbstractControl): ValidationErrors | null {
  const cicloEscolarValue = control.value;

  if (!cicloEscolarValue) {
    return null; // Si no hay valor, no hay error
  }

  // Regex para validar el formato "Agosto-Diciembre 2024"
  const regex = /^[A-Za-z]+-[A-Za-z]+\s\d{4}$/;

  // Verificar si el valor coincide con el formato esperado
  if (!regex.test(cicloEscolarValue)) {
    return { invalidFormat: true }; // Error si el formato no es correcto
  }

  // Obtener el año actual y el siguiente
  const currentYear = new Date().getFullYear();
  const yearInCicloEscolar = parseInt(cicloEscolarValue.split(' ')[1], 10);

  // Verificar si el año está dentro del rango permitido
  if (yearInCicloEscolar > currentYear + 1) {
    return { yearTooFar: true }; // Error si el año es mayor al siguiente año
  }

  return null; // Si todo es válido
}
