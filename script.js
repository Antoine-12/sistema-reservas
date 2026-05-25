// Elementos del DOM
const modal = document.getElementById('modalReserva');
const openBtn = document.getElementById('openReservaBtn');
const closeBtn = document.getElementById('closeModalBtn');
const form = document.getElementById('formReserva');
const feedbackDiv = document.getElementById('mensajeFeedback');

// ABRIR modal
function abrirModal() {
    modal.classList.add('active');
    // resetear mensajes previos
    if (feedbackDiv) feedbackDiv.innerHTML = '';
}

// CERRAR modal
function cerrarModal() {
    modal.classList.remove('active');
    if (feedbackDiv) feedbackDiv.innerHTML = '';
}

openBtn.addEventListener('click', abrirModal);
closeBtn.addEventListener('click', cerrarModal);

// Clic fuera del contenido también cierra (overlay)
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        cerrarModal();
    }
});

// Función para mostrar mensajes de feedback
function mostrarFeedback(mensaje, tipo) {
    if (!feedbackDiv) return;
    const clase = tipo === 'exito' ? 'mensaje-exito' : 'mensaje-error';
    feedbackDiv.innerHTML = `<div class="${clase}">${mensaje}</div>`;
    
    // Auto desaparecer mensaje después de 5 segundos
    setTimeout(() => {
        if (feedbackDiv && feedbackDiv.innerHTML.includes(mensaje)) {
            feedbackDiv.innerHTML = '';
        }
    }, 5000);
}

// Validación y simulación de reserva
form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Obtener valores
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const fecha = document.getElementById('fechaCita').value;
    const servicio = document.getElementById('servicioSelect').value;
    const telefono = document.getElementById('telefono').value.trim();
    const mensajeExtra = document.getElementById('mensaje').value.trim();

    // validaciones básicas
    if (nombre === "" || email === "") {
        mostrarFeedback("⚠️ Por favor completa nombre y correo electrónico.", "error");
        return;
    }
    if (!email.includes('@') || !email.includes('.')) {
        mostrarFeedback("📧 Ingresa un correo válido (ejemplo@dominio.com).", "error");
        return;
    }
    if (fecha === "") {
        mostrarFeedback("📅 Selecciona una fecha para tu cita.", "error");
        return;
    }
    
    // fecha no sea pasada
    const hoy = new Date().toISOString().split('T')[0];
    if (fecha < hoy) {
        mostrarFeedback("⏳ La fecha no puede ser anterior a hoy. Elige una fecha futura.", "error");
        return;
    }

    // Guardar registro de la cita en localStorage
    const nuevaCita = {
        id: Date.now(),
        nombre: nombre,
        email: email,
        telefono: telefono,
        servicio: servicio,
        fecha: fecha,
        mensaje: mensajeExtra,
        fechaRegistro: new Date().toLocaleString()
    };

    // Recuperar citas previas o crear arreglo
    let citas = [];
    const citasGuardadas = localStorage.getItem('citas_saludplus');
    if (citasGuardadas) {
        citas = JSON.parse(citasGuardadas);
    }
    citas.push(nuevaCita);
    localStorage.setItem('citas_saludplus', JSON.stringify(citas));

    // Mostrar mensaje de éxito
    mostrarFeedback(`✅ ¡Reservación confirmada, ${nombre}! Hemos registrado tu cita de ${servicio} para el día ${fecha}. En breve recibirás un correo de confirmación (simulación). Hemos mejorado la atención frente al uso de WhatsApp.`, "exito");

    // Limpiar formulario
    form.reset();
    
    // Opcional: cerrar modal después de 3 segundos
    setTimeout(() => {
        cerrarModal();
    }, 3000);
});

// Establecer fecha mínima en el campo date
const fechaInput = document.getElementById('fechaCita');
if (fechaInput) {
    const today = new Date().toISOString().split('T')[0];
    fechaInput.setAttribute('min', today);
}

// Mensaje en consola para verificar funcionamiento
console.log("✅ Sistema de reservaciones en línea listo. Puedes agendar citas y reemplazar la comunicación por WhatsApp.");

// Mostrar estadísticas de reservas en consola (opcional)
const totalCitas = localStorage.getItem('citas_saludplus');
if (totalCitas) {
    const count = JSON.parse(totalCitas).length;
    console.log(`📋 Total de reservaciones registradas (demo): ${count}`);
} else {
    console.log("No hay reservaciones previas en localStorage");
}
