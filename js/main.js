
import { tipo, rutas } from "./datos.js";

const contenedor = document.querySelector("listado-rutas");


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
