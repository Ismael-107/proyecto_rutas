// almacen.js
//futura implementacion
function obtenerTodos(coleccion) {
}

export function obtenerPorId(coleccion, id) {
}

function crear(coleccion, dato) {

}

function actualizar(coleccion, id, dato) {
}

export function borrar(coleccion, id) {
  const lista = obtenerTodos(coleccion).filter((item) => item.id !== id);
  localStorage.setItem(coleccion, JSON.stringify(lista));
}