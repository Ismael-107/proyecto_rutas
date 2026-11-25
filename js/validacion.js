//js/validacion.js
//Cada función recibe un valor y devuelve un mensaje de error o null.

export const EDAD_MINIMA = 16; // cámbiala si tu app necesita otra edad

const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

//true si el valor está vacio o solo tiene espacios
const vacio = (v) => String(v ?? '').trim() === '';

export function validarUsuario(valor, { min = 3, max = 20 } = {}) {
  if (vacio(valor)) return 'Escribe un nombre de usuario.';
  const v = valor.trim();
  if (v.length < min) return `Debe tener al menos ${min} caracteres.`;
  if (v.length > max) return `No puede superar los ${max} caracteres.`;
  return null;
}

export function validarEmail(valor) {
  if (vacio(valor)) return 'Escribe tu correo electrónico.';
  return RE_EMAIL.test(valor.trim()) ? null : 'El correo no es válido (ejemplo: nombre@dominio.es).';
}

export function validarPassword(valor, { min = 8 } = {}) {
  if (vacio(valor)) return 'Escribe una contraseña.';
  if (valor.length < min) return `Debe tener al menos ${min} caracteres.`;
  if (!/[A-ZÁÉÍÓÚÑ]/.test(valor)) return 'Debe incluir al menos una mayúscula.';
  if (!/\d/.test(valor)) return 'Debe incluir al menos un número.';
  return null;
}

export function validarRepetirPassword(valor, password) {
  if (vacio(valor)) return 'Repite la contraseña.';
  return valor === password ? null : 'Las contraseñas no coinciden.';
}

//Convierte 'AAAA-MM-DD' en un objeto Date. Devuelve null si la fecha no existe.
export function aFecha(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso ?? '');
  if (!m) return null;
  const [, a, mes, d] = m.map(Number);
  const f = new Date(a, mes - 1, d);
  return f.getFullYear() === a && f.getMonth() === mes - 1 && f.getDate() === d ? f : null;
}

//Años cumplidos a fecha de hoy
export function calcularEdad(fecha, hoy = new Date()) {
  let edad = hoy.getFullYear() - fecha.getFullYear();
  const aunNoCumplidos =
    hoy.getMonth() < fecha.getMonth() ||
    (hoy.getMonth() === fecha.getMonth() && hoy.getDate() < fecha.getDate());
  return aunNoCumplidos ? edad - 1 : edad;
}

export function validarFechaNacimiento(valor, { edadMinima = EDAD_MINIMA } = {}) {
  if (vacio(valor)) return 'Indica tu fecha de nacimiento.';
  const fecha = aFecha(valor);
  if (!fecha) return 'La fecha no es válida.';
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  if (fecha > hoy) return 'La fecha no puede ser futura.';
  if (fecha.getFullYear() < 1910) return 'La fecha no es válida.';
  if (calcularEdad(fecha, hoy) < edadMinima) return `Debes tener al menos ${edadMinima} años.`;
  return null;
}

export function validarCondiciones(marcada) {
  return marcada ? null : 'Debes aceptar las condiciones para continuar.';
}