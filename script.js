// Esperar a que todo el HTML esté cargado
document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos del DOM
    const modal = document.getElementById('modalReserva');
    const openBtn = document.getElementById('openReservaBtn');
    const closeBtn = document.getElementById('closeModalBtn');
    const form = document.getElementById('formReserva');
    const feedbackDiv = document.getElementById('mensajeFeedback');

    // Verificar que los elementos existen
    if (!openBtn) {
        console.error('❌ Botón no encontrado!');
        return;
    }

    // ABRIR modal
    function abrirModal() {
        modal.classList.add('active');
        if (feedbackDiv) feedbackDiv.innerHTML = '';
    }

    // CERRAR modal
    function cerrarModal() {
        modal.classList.remove('active');
        if (feedbackDiv) feedbackDiv.innerHTML = '';
    }

    openBtn.addEventListener('click', abrirModal);
    
    if (closeBtn) {
        closeBtn.addEventListener('click', cerrarModal);
    }

    // Clic fuera del contenido
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                cerrarModal();
            }
        });
    }

    // Función para mostrar mensajes
    function mostrarFeedback(mensaje, tipo) {
        if (!feedbackDiv) return;
        const clase = tipo === 'exito' ? 'mensaje-exito' : 'mensaje-error';
        feedbackDiv.innerHTML = `<div class="${clase}">${mensaje}</div>`;
        
        setTimeout(() => {
            if (feedbackDiv && feedbackDiv.innerHTML.includes(mensaje)) {
                feedbackDiv.innerHTML = '';
            }
        }, 5000);
    }

    // Envío del formulario
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value.trim();
            const email = document.getElementById('email').value.trim();
            const fecha = document.getElementById('fechaCita').value;
            const servicio = document.getElementById('servicioSelect').value;
            const telefono = document.getElementById('telefono').value.trim();
            const mensajeExtra = document.getElementById('mensaje').value.trim();

            if (nombre === "" || email === "") {
                mostrarFeedback("⚠️ Por favor completa nombre y correo electrónico.", "error");
                return;
            }
            if (!email.includes('@') || !email.includes('.')) {
                mostrarFeedback("📧 Ingresa un correo válido.", "error");
                return;
            }
            if (fecha === "") {
                mostrarFeedback("📅 Selecciona una fecha para tu cita.", "error");
                return;
            }
            
            const hoy = new Date().toISOString().split('T')[0];
            if (fecha < hoy) {
                mostrarFeedback("⏳ La fecha no puede ser anterior a hoy.", "error");
                return;
            }

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

            let citas = [];
            const citasGuardadas = localStorage.getItem('citas_saludplus');
            if (citasGuardadas) {
                citas = JSON.parse(citasGuardadas);
            }
            citas.push(nuevaCita);
            localStorage.setItem('citas_saludplus', JSON.stringify(citas));

            mostrarFeedback(`✅ ¡Reservación confirmada, ${nombre}! Hemos registrado tu cita de ${servicio} para el día ${fecha}.`, "exito");
            form.reset();
            
            setTimeout(() => {
                cerrarModal();
            }, 3000);
        });
    }

    // Establecer fecha mínima
    const fechaInput = document.getElementById('fechaCita');
    if (fechaInput) {
        const today = new Date().toISOString().split('T')[0];
        fechaInput.setAttribute('min', today);
    }

    console.log("✅ Sistema funcionando correctamente");
});
