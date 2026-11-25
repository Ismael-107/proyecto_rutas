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
export function configurarEventosValidacion(campos, validarCampo) {

  const camposTocados = new Set();

  campos.forEach(campo => {

    campo.addEventListener("blur", () => {
        camposTocados.add(campo);
        validarCampo(campo);

      });

      campo.addEventListener("input", () => {
          if (camposTocados.has(campo)) {
              validarCampo(campo);
          }
    });
  });
}
//Aqui empieza la validacion de ruta formulario

const formulario = document.querySelector("#formulario-ruta");

if (formulario) {

    const nombre = document.querySelector("#f_nombre");
    const email = document.querySelector("#f_email");
    const telefono = document.querySelector("#f_telefono");
    const llamada = document.querySelector("#f_llamada");
    const motivo = document.querySelector("#f_motivo");
    const mensaje = document.querySelector("#f_mensaje");
    const contador = document.querySelector("#contador-mensaje");
    const listaMensajes = document.querySelector("#lista-mensajes");

    const camposTocados = new Set();

    const campos = [
        nombre,
        email,
        telefono,
        motivo,
        mensaje
    ].filter(Boolean);



    function validarTelefono() {

        const numero = telefono.value.replace(/[\s-]/g, "");

        const regexTelefono = /^(?:\+34)?[6789]\d{8}$/;

        if (numero === "") {

            if (llamada.checked) {
                telefono.setCustomValidity(
                    "Debes introducir un teléfono si prefieres que te llamemos."
                );
                return false;
            }

            telefono.setCustomValidity("");
            return true;
        }

        if (!regexTelefono.test(numero)) {

            telefono.setCustomValidity(
                "Introduce un teléfono español válido."
            );

            return false;
        }

        telefono.setCustomValidity("");
        return true;
    }



    
    function validarCampo(campo) {
        if (campo === telefono) {
            validarTelefono();
        }

        const valido = campo.checkValidity();
        const cajaError = document.querySelector(`#${campo.id}-error`);
        campo.setAttribute("aria-invalid", valido ? "false" : "true");

        if (cajaError) {
            cajaError.textContent = valido ? "" : campo.validationMessage;
        }
        return valido;
    }




    campos.forEach(function (campo) {
        campo.addEventListener("blur", function () {

            camposTocados.add(campo);
            validarCampo(campo);
        });

        campo.addEventListener("input", function () {

            if (camposTocados.has(campo)) {
                validarCampo(campo);
            }
        });
    });


    llamada.addEventListener("change", function () {

        camposTocados.add(telefono);
        validarCampo(telefono);

    });



    mensaje.addEventListener("input", function () {

        const longitud = mensaje.value.length;

        contador.textContent = longitud + " / 500 caracteres";

    });


    const CLAVE_MENSAJES = "mensajesRutas";

    function obtenerMensajes() {

        try {
            return JSON.parse(localStorage.getItem(CLAVE_MENSAJES)) || [];
        } catch {
            return [];
        }

    }

    function guardarMensajes(mensajes) {

        localStorage.setItem(
            CLAVE_MENSAJES,
            JSON.stringify(mensajes)
        );
    }



    function mostrarMensajes() {

        const mensajes = obtenerMensajes();

        listaMensajes.replaceChildren();

        if (mensajes.length === 0) {

            const texto = document.createElement("p");
            texto.textContent = "Todavía no has enviado ninguna solicitud.";

            listaMensajes.appendChild(texto);
            return;
        }

        mensajes.forEach(function (mensajeGuardado, indice) {

            const tarjeta = document.createElement("article");

            const titulo = document.createElement("h3");
            titulo.textContent = mensajeGuardado.motivo;

            const nombreMensaje = document.createElement("p");
            nombreMensaje.textContent = "Nombre: " + mensajeGuardado.nombre;

            const correo = document.createElement("p");
            correo.textContent = "Correo: " + mensajeGuardado.email;

            const textoMensaje = document.createElement("p");
            textoMensaje.textContent = "Mensaje: " + mensajeGuardado.mensaje;

            const boton = document.createElement("button");
            boton.type = "button";
            boton.textContent = "Borrar";

            boton.addEventListener("click", function () {

                const mensajesActualizados = obtenerMensajes();

                mensajesActualizados.splice(indice, 1);

                guardarMensajes(mensajesActualizados);
                mostrarMensajes();

            });

            tarjeta.append(
                titulo,
                nombreMensaje,
                correo,
                textoMensaje,
                boton
            );

            listaMensajes.appendChild(tarjeta);
      });
    }


    const CLAVE_USUARIO = "usuarioRuta";
    const DURACION = 30 * 24 * 60 * 60 * 1000;

    function guardarDatosUsuario(nombreUsuario, correoUsuario) {
        const datos = {
            nombre: nombreUsuario,
            email: correoUsuario,
            caducidad: Date.now() + DURACION
        };

        localStorage.setItem(
            CLAVE_USUARIO,
            JSON.stringify(datos)
        );

    }

    function recuperarDatosUsuario() {
        const datosGuardados = localStorage.getItem(CLAVE_USUARIO);

        if (!datosGuardados) {
            return;
        }

        let datos;
        try {
            datos = JSON.parse(datosGuardados);
        } catch {
            localStorage.removeItem(CLAVE_USUARIO);
            return;
        }

        if (Date.now() > datos.caducidad) {
            localStorage.removeItem(CLAVE_USUARIO);
            return;

        }
        nombre.value = datos.nombre;
        email.value = datos.email;

    }

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        campos.forEach(function (campo) {
            camposTocados.add(campo);
        });

        let formularioValido = true;
        let primerCampoIncorrecto = null;

        campos.forEach(function (campo) {

            if (!validarCampo(campo)) {
                formularioValido = false;

                if (!primerCampoIncorrecto) {
                    primerCampoIncorrecto = campo;
                }
            }
        });

        if (!formularioValido) {

            primerCampoIncorrecto.focus();
            primerCampoIncorrecto.reportValidity();

            return;
        }

        const nuevaSolicitud = {
            nombre: nombre.value.trim(),
            email: email.value.trim(),
            telefono: telefono.value.trim(),
            motivo: motivo.selectedOptions[0].textContent,
            mensaje: mensaje.value.trim(),
            llamada: llamada.checked

        };

        const mensajes = obtenerMensajes();
        mensajes.push(nuevaSolicitud);

        guardarDatosUsuario(
            nuevaSolicitud.nombre,
            nuevaSolicitud.email
        );

        guardarMensajes(mensajes);

        formulario.reset();
        camposTocados.clear();

        campos.forEach(function (campo) {
            campo.removeAttribute("aria-invalid");
        });

        telefono.setCustomValidity("");

        contador.textContent = "0 / 500 caracteres";

        mostrarMensajes();
        recuperarDatosUsuario();

    });
    mostrarMensajes();
    recuperarDatosUsuario();

}
