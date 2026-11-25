// js/validacion.js
// Funciones independientes de validación para el formulario de registro.

const EDAD_MINIMA = 16;

export function validarUsuario(valor, { min = 3, max = 20 } = {}) {
  const texto = valor.trim();
  if (!texto) return 'El nombre de usuario es obligatorio.';
  if (texto.length < min || texto.length > max) {
    return `El nombre de usuario debe tener entre ${min} y ${max} caracteres.`;
  }
  return null;
}

export function validarEmail(valor) {
  const email = valor.trim();
  // Formato habitual: texto@dominio.extensión
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!email) return 'El correo electrónico es obligatorio.';
  if (!regex.test(email)) return 'Introduce un correo electrónico válido.';
  return null;
}

export function validarPassword(valor, { min = 8 } = {}) {
  if (!valor) return 'La contraseña es obligatoria.';
  if (valor.length < min) return `La contraseña debe tener al menos ${min} caracteres.`;
  if (!/[A-ZÁÉÍÓÚÜÑ]/.test(valor)) return 'La contraseña debe incluir al menos una mayúscula.';
  if (!/[0-9]/.test(valor)) return 'La contraseña debe incluir al menos un número.';
  return null;
}

export function validarRepetirPassword(repetida, original) {
  if (!repetida) return 'Repite la contraseña.';
  if (repetida !== original) return 'Las contraseñas no coinciden.';
  return null;
}

export function aFecha(valor) {
  // Parseo local para evitar cambios de día por zonas horarias.
  const [anio, mes, dia] = valor.split('-').map(Number);
  return new Date(anio, mes - 1, dia);
}

export function validarFechaNacimiento(valor, edadMinima = EDAD_MINIMA) {
  if (!valor) return 'La fecha de nacimiento es obligatoria.';

  const fecha = aFecha(valor);
  if (Number.isNaN(fecha.getTime()) ||
      fecha.getFullYear() !== Number(valor.slice(0, 4)) ||
      fecha.getMonth() !== Number(valor.slice(5, 7)) - 1 ||
      fecha.getDate() !== Number(valor.slice(8, 10))) {
    return 'Introduce una fecha válida.';
  }

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  if (fecha > hoy) return 'La fecha de nacimiento no puede ser futura.';

  let edad = hoy.getFullYear() - fecha.getFullYear();
  const aunNoCumple =
    hoy.getMonth() < fecha.getMonth() ||
    (hoy.getMonth() === fecha.getMonth() && hoy.getDate() < fecha.getDate());
  if (aunNoCumple) edad--;

  if (edad < edadMinima) return `Debes tener al menos ${edadMinima} años.`;
  return null;
}

export function validarCondiciones(aceptadas) {
  return aceptadas ? null : 'Debes aceptar los términos y condiciones.';
}
