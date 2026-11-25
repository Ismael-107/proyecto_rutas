// js/registro.js
import * as v from './validacion.js';

const form = document.querySelector('#registro');
if (form) {
  const usuario = document.querySelector('#usuario');
  const email = document.querySelector('#email');
  const password = document.querySelector('#password');
  const confirmar = document.querySelector('#confirmar');
  const nacimiento = document.querySelector('#fecha');
  const terminos = document.querySelector('#terminos');
  const aviso = document.querySelector('#registro-aviso');
  const titulo = document.querySelector('#registro-titulo');
  const botonGuardar = document.querySelector('#registro-guardar');
  const cancelar = document.querySelector('#registro-cancelar');
  const bloquePasswords = document.querySelector('#registro-passwords');
  const lista = document.querySelector('#lista-usuarios');
  const usuariosVacio = document.querySelector('#usuarios-vacio');

  const CLAVE = 'usuarios';
  const hoyISO = () => {
    const hoy = new Date();
    const local = new Date(hoy.getTime() - hoy.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  };
  nacimiento.max = hoyISO();

  function leerUsuarios() {
    try {
      const datos = JSON.parse(localStorage.getItem(CLAVE) || '[]');
      return Array.isArray(datos) ? datos : [];
    } catch {
      return [];
    }
  }

  function guardarUsuarios(usuarios) {
    localStorage.setItem(CLAVE, JSON.stringify(usuarios));
  }


function mostrarError(campo, texto) {
    const caja = document.querySelector(`#${campo.id}-error`);
    if (texto) {
        campo.setAttribute('aria-invalid', 'true');
    } else {
        campo.setAttribute('aria-invalid', 'false');
    }
    if (caja) {
        caja.textContent = texto || '';
    }
}


  const campos = [
    [usuario, () => v.validarUsuario(usuario.value, {
      min: Number(usuario.minLength) || 3,
      max: Number(usuario.maxLength) || 20
    })],
    [email, () => v.validarEmail(email.value)],
    [password, () => v.validarPassword(password.value, {
      min: Number(password.minLength) || 8
    })],
    [confirmar, () => v.validarRepetirPassword(confirmar.value, password.value)],
    [nacimiento, () => v.validarFechaNacimiento(nacimiento.value)],
    [terminos, () => v.validarCondiciones(terminos.checked)]
  ];

  function comprobar(campo, validar) {
    const error = campo.disabled ? null : validar();
    mostrarError(campo, error);
    return error;
  }

  campos.forEach(([campo, validar]) => {
    campo.addEventListener('blur', () => {
      campo.dataset.tocado = 'true';
      comprobar(campo, validar);
    });
    campo.addEventListener('input', () => {
      if (campo.dataset.tocado) comprobar(campo, validar);
    });
    campo.addEventListener('change', () => {
      if (campo.dataset.tocado) comprobar(campo, validar);
    });
  });

  password.addEventListener('input', () => {
    if (confirmar.dataset.tocado) comprobar(confirmar, campos[3][1]);
  });

  

function validarTodo() {
    let primerCampoIncorrecto = null;
    for (const [campo, validar] of campos) {
        campo.dataset.tocado = 'true';

        const error = comprobar(campo, validar);

        if (error && !primerCampoIncorrecto) {
            primerCampoIncorrecto = campo;
        }
    }
    if (primerCampoIncorrecto) {
        primerCampoIncorrecto.focus();
    }
    return primerCampoIncorrecto === null;
}



  function limpiarErrores() {
    campos.forEach(([campo]) => {
      delete campo.dataset.tocado;
      mostrarError(campo, '');
    });
  }

  function modoRegistro(user = null) {
    form.reset();
    limpiarErrores();
    form.dataset.editando = user ? user.id : '';
    titulo.textContent = user ? 'Editar usuario' : 'Crear una cuenta';
    botonGuardar.textContent = user ? 'Guardar cambios' : 'Crear cuenta';
    cancelar.hidden = !user;

    // En edición no se solicitan contraseñas: nunca se almacenan.
    bloquePasswords.hidden = Boolean(user);
    password.disabled = Boolean(user);
    confirmar.disabled = Boolean(user);
    password.required = !user;
    confirmar.required = !user;

    if (user) {
      usuario.value = user.usuario;
      email.value = user.email;
      nacimiento.value = user.nacimiento;
      terminos.checked = Boolean(user.terminos);
    }
  }

  function crearElemento(etiqueta, texto = '') {
    const nodo = document.createElement(etiqueta);
    nodo.textContent = texto;
    return nodo;
  }

  function crearBoton(texto, accion, id) {
    const boton = crearElemento('button', texto);
    boton.type = 'button';
    boton.dataset.accion = accion;
    boton.dataset.id = id;
    return boton;
  }

  function pintarUsuarios() {
    const usuarios = leerUsuarios();
    usuariosVacio.hidden = usuarios.length > 0;
    lista.replaceChildren();

    usuarios.forEach((u) => {
      const li = document.createElement('li');
      const fecha = v.aFecha(u.nacimiento).toLocaleDateString('es-ES');
      li.append(
        crearElemento('strong', u.usuario),
        crearElemento('span', ` · ${u.email} · nacido el ${fecha} `),
        crearBoton('Editar', 'editar', u.id),
        crearBoton('Borrar', 'borrar', u.id)
      );
      lista.append(li);
    });
  }

  form.addEventListener('submit', (evento) => {
    evento.preventDefault();
    if (!validarTodo()) return;

    const dato = {
      usuario: usuario.value.trim(),
      email: email.value.trim().toLowerCase(),
      nacimiento: nacimiento.value,
      terminos: terminos.checked
      // Importante: password y confirmar NO se incluyen en el objeto.
    };

    const usuarios = leerUsuarios();
    const id = form.dataset.editando;

    if (id) {
      const indice = usuarios.findIndex((u) => u.id === id);
      if (indice === -1) {
        aviso.textContent = 'No se ha encontrado el usuario que quieres editar.';
        modoRegistro();
        return;
      }
      usuarios[indice] = { ...usuarios[indice], ...dato };
      aviso.textContent = 'Usuario actualizado.';
    } else {
      usuarios.push({ ...dato, id: `${Date.now()}-${Math.random().toString(16).slice(2)}` });
      aviso.textContent = 'Cuenta creada correctamente.';
    }

    try {
      guardarUsuarios(usuarios);
      modoRegistro();
      pintarUsuarios();
    } catch {
      aviso.textContent = 'No se han podido guardar los datos en este navegador.';
    }
  });

  cancelar.addEventListener('click', () => modoRegistro());

  lista.addEventListener('click', (evento) => {
    const boton = evento.target.closest('button[data-accion]');
    if (!boton) return;

    const usuarios = leerUsuarios();
    const user = usuarios.find((u) => u.id === boton.dataset.id);
    if (!user) return;

    if (boton.dataset.accion === 'editar') {
      modoRegistro(user);
      usuario.focus();
    } else if (boton.dataset.accion === 'borrar' &&
               confirm(`¿Borrar al usuario «${user.usuario}»?`)) {
      guardarUsuarios(usuarios.filter((u) => u.id !== user.id));
      if (form.dataset.editando === user.id) modoRegistro();
      pintarUsuarios();
      aviso.textContent = 'Usuario borrado.';
    }
  });

  modoRegistro();
  pintarUsuarios();
}
