//js/registro.js
import * as v from './validacion.js';

//Elementos
const form = document.querySelector('#registro');
const usuario = document.querySelector('#usuario');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const confirmar = document.querySelector('#confirmar');
const nacimiento = document.querySelector('#fecha');
const terminos = document.querySelector('#terminos');
const aviso = document.querySelector('#registro-aviso');

//La fecha máxima es hoy: así el calendario no deja elegir fechas futuras
nacimiento.max = new Date().toLocaleDateString('sv-SE'); // formato AAAA-MM-DD

//Cada campo con su validación 
const campos = [
  [usuario, () => v.validarUsuario(usuario.value, { min: usuario.minLength, max: usuario.maxLength })],
  [email, () => v.validarEmail(email.value)],
  [password, () => v.validarPassword(password.value, { min: password.minLength })],
  [confirmar, () => v.validarRepetirPassword(confirmar.value, password.value)],
  [nacimiento, () => v.validarFechaNacimiento(nacimiento.value)],
  [terminos, () => v.validarCondiciones(terminos.checked)],
];

//Mostrar errores (sin alert)
function mostrarError(campo, texto) {
  const caja = document.querySelector('#' + campo.id + '-error');
  if (texto) {
    campo.setAttribute('aria-invalid', 'true');
    caja.textContent = texto;
  } else {
    campo.removeAttribute('aria-invalid');
    caja.textContent = '';
  }
}

//Valida un campo y muestra su error. Devuelve el texto del error (o null)
function comprobar(campo, validar) {
  const texto = campo.disabled ? null : validar();
  mostrarError(campo, texto);
  return texto;
}

//blur y input
campos.forEach(([campo, validar]) => {
  campo.addEventListener('blur', () => {
    campo.dataset.tocado = 'true';   // marca el campo como ya visitado
    comprobar(campo, validar);
  });
  campo.addEventListener('input', () => {
    if (campo.dataset.tocado) comprobar(campo, validar); // solo si ya se visitó
  });
});

//Si cambia la contraseña hay que revalidar repetir contraseña
password.addEventListener('input', () => {
  if (confirmar.dataset.tocado) comprobar(confirmar, campos[3][1]);
});

//Al enviar
function validarTodo() {
  let primero = null;
  campos.forEach(([campo, validar]) => {
    campo.dataset.tocado = 'true';
    if (comprobar(campo, validar) && !primero) primero = campo;
  });
  if (primero) primero.focus(); 
  return primero === null;           
}

function limpiarErrores() {
  campos.forEach(([campo]) => {
    delete campo.dataset.tocado;
    mostrarError(campo, null);
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validarTodo()) return;
  console.log('Formulario válido');
});