
let servicio = "";
let barbero = "";
let horario = "";

function seleccionarServicio(s) {
  servicio = s;
  actualizarResumen();
}

function seleccionarBarbero(b) {
  barbero = b;
  actualizarResumen();
}

function reservar(h) {
  horario = h;
  actualizarResumen();
}

function actualizarResumen() {
  document.getElementById("resumen").innerText =
    `Servicio: ${servicio} | Barbero: ${barbero} | Hora: ${horario}`;
}
