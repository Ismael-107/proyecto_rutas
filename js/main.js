import { tipo, rutas } from "./datos.js";

const articulos = document.querySelectorAll(
    ".rutas_recientes .ruta1, .rutas_recientes .ruta2, .rutas_recomendadas .ruta1, .rutas_recomendadas .ruta2"
);
const contenedor = document.querySelector("#listado-rutas");

articulos.forEach((articulo, busca) => {
    const boton = articulo.querySelector("button");
    const ruta = rutas[busca];

    boton.addEventListener("click", () => {
        const detalles = articulo.querySelector(".detalles");
        if (detalles) {

            detalles.remove();
            boton.textContent = "Ver más";
        } else {

            const categoria = tipo.find(t => t.id === ruta.tipoId);
            const nuevoDetalle = document.createElement("div");
            nuevoDetalle.classList.add("detalles");

            nuevoDetalle.innerHTML = `
                <p>Nombre: ${ruta.nombre}</p>
                <p>Tipo: ${categoria.nombre}</p>
                <p>Distancia: ${ruta.distancia} km</p>
                <p>Duración: ${ruta.tiempo} horas</p>
                <p>Dificultad: ${ruta.dificultad}/3</p>
            `;

            articulo.appendChild(nuevoDetalle);
            boton.textContent = "Ocultar";
        }
    });
});

if (contenedor) {

    rutas.forEach(ruta => {

        const categoria = tipo.find(t => t.id === ruta.tipoId);

        const tarjeta = document.createElement("article");
        tarjeta.classList.add("tarjeta");

        tarjeta.innerHTML = `
            <h2>${ruta.nombre}</h2>
            <p><strong>Tipo:</strong> ${categoria.nombre}</p>
            <p><strong>Distancia:</strong> ${ruta.distancia} km</p>
            <p><strong>Duración:</strong> ${ruta.tiempo} horas</p>
            <p><strong>Dificultad:</strong> ${ruta.dificultad}/3</p>
        `;

        contenedor.appendChild(tarjeta);
    });

}