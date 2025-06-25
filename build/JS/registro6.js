document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.querySelector('.domicilio-form');
    const botonSiguiente = document.querySelector('.next-button');
    const botonRegresar = document.querySelector('.back-button');

// Validar campos requeridos
function validarCampos() {
    let valido = true;
    const camposRequeridos = formulario.querySelectorAll('[required]');

    camposRequeridos.forEach(campo => {
        if (!campo.value.trim()) {
            marcarInvalido(campo);
            valido = false;
        } else {
            marcarValido(campo);
            
            // Validación específica para Código Postal (5 dígitos en México)
            if (campo.previousElementSibling.textContent.includes('C.P')) {
                if (!/^\d{5}$/.test(campo.value)) {
                    mostrarError(campo, 'El código postal debe tener 5 dígitos');
                    valido = false;
                }
            }
            
            // Validación para precio (número entero positivo)
            if (campo.previousElementSibling.textContent.includes('Precio')) {
                if (!/^\d+$/.test(campo.value)) {
                    mostrarError(campo, 'El precio debe ser un número entero');
                    valido = false;
                }
                
                // Validar que sea mayor que cero
                if (parseInt(campo.value) <= 0) {
                    mostrarError(campo, 'El precio debe ser mayor que cero');
                    valido = false;
                }
            }
        }
    });

    return valido;
}

    // Marcar campo como inválido
    function marcarInvalido(campo) {
        campo.classList.add('is-invalid');
        campo.classList.remove('is-valid');
        
        // Mostrar mensaje de error si no existe
        if (!campo.nextElementSibling || !campo.nextElementSibling.classList.contains('invalid-feedback')) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'invalid-feedback';
            errorDiv.textContent = 'Este campo es obligatorio';
            campo.parentNode.insertBefore(errorDiv, campo.nextSibling);
        }
    }

    // Marcar campo como válido
    function marcarValido(campo) {
        campo.classList.remove('is-invalid');
        campo.classList.add('is-valid');
        
        // Eliminar mensaje de error si existe
        if (campo.nextElementSibling && campo.nextElementSibling.classList.contains('invalid-feedback')) {
            campo.nextElementSibling.remove();
        }
    }

    // Mostrar error personalizado
    function mostrarError(campo, mensaje) {
        campo.classList.add('is-invalid');
        
        if (!campo.nextElementSibling || !campo.nextElementSibling.classList.contains('invalid-feedback')) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'invalid-feedback';
            errorDiv.textContent = mensaje;
            campo.parentNode.insertBefore(errorDiv, campo.nextSibling);
        } else {
            campo.nextElementSibling.textContent = mensaje;
        }
    }

    // Manejar envío del formulario
    formulario.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validarCampos()) {
            // Guardar datos en localStorage (opcional)
            const formData = new FormData(formulario);
            const datos = {};
            formData.forEach((value, key) => {
                datos[key] = value;
            });
            localStorage.setItem('datosDomicilio', JSON.stringify(datos));
            
            // Mostrar confirmación con SweetAlert2 y redirigir
            Swal.fire({
                icon: 'success',
                title: 'Datos guardados',
                text: 'Tu información de domicilio se guardó correctamente.',
                timer: 1600,
                showConfirmButton: false
            }).then(() => {
                window.location.href = '/HTML/Registro5.html';
            });
        } else {
            // Mostrar alerta si hay errores con SweetAlert2
            Swal.fire({
                icon: 'error',
                title: 'Formulario incompleto',
                text: 'Por favor corrige los errores en el formulario'
            });
        }
    });

    // Validación en tiempo real
    formulario.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.trim()) {
                marcarValido(this);
            } else {
                marcarInvalido(this);
            }
        });
    });


        const unidadesAcademicas = [
        { id: 1, nombre: "Zacatenco" },
        { id: 2, nombre: "Milpa Alta" },
        { id: 3, nombre: "Ticomán" },
        { id: 4, nombre: "Culhuacán" },
        { id: 5, nombre: "Iztacalco" },
        // ... más opciones
    ];
    
    const select = document.getElementById('unidad-academica');
    select.innerHTML = '<option value="" selected disabled>Selecciona una opción</option>';
    
    unidadesAcademicas.forEach(unidad => {
        const option = document.createElement('option');
        option.value = unidad.id;
        option.textContent = unidad.nombre;
        select.appendChild(option);
    });


    // Botón de regresar
    botonRegresar.addEventListener('click', function() {
        window.location.href = '/HTML/Registro6-2.html';
    });
});