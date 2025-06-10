document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.querySelector('.register-form');
    
    // Función para mostrar errores de manera más elegante
    function showError(message) {
        // Puedes personalizar esto para mostrar errores en un div específico
        alert(message);
    }
    
    // Función para validar email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Función para validar contraseña (mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número)
    function isValidPassword(password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }
    
    // Validar edad
    function calculateAge(birthDate) {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    }
    
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obtener valores y limpiar espacios en blanco
        const nombre = document.getElementById('nombre').value.trim();
        const apellidos = document.getElementById('apellidos').value.trim();
        const email = document.getElementById('email').value.trim();
        const fechaNacimiento = document.getElementById('fecha_nacimiento').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm_password').value;
        const terms = document.getElementById('terms').checked;
        
        // Validaciones mejoradas
        if (!nombre || !apellidos || !email || !fechaNacimiento || !password || !confirmPassword) {
            showError('Por favor completa todos los campos obligatorios');
            return;
        }
        
        // Validar nombres (solo letras y espacios)
        const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        if (!nameRegex.test(nombre)) {
            showError('El nombre solo debe contener letras');
            return;
        }
        
        if (!nameRegex.test(apellidos)) {
            showError('Los apellidos solo deben contener letras');
            return;
        }
        
        // Validar email
        if (!isValidEmail(email)) {
            showError('Por favor ingresa un email válido');
            return;
        }
        
        // Validar contraseña
        if (!isValidPassword(password)) {
            showError('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número');
            return;
        }
        
        if (password !== confirmPassword) {
            showError('Las contraseñas no coinciden');
            return;
        }
        
        if (!terms) {
            showError('Debes aceptar los términos y condiciones');
            return;
        }
        
        // Validar fecha de nacimiento
        const birthDate = new Date(fechaNacimiento);
        const today = new Date();
        
        if (birthDate >= today) {
            showError('La fecha de nacimiento debe ser anterior a hoy');
            return;
        }
        
        const age = calculateAge(fechaNacimiento);
        
        if (age < 18) {
            showError('Debes tener al menos 18 años para registrarte');
            return;
        }
        
        if (age > 120) {
            showError('Por favor verifica tu fecha de nacimiento');
            return;
        }
        
        // Si todo está correcto
        alert('¡Registro exitoso!');
        console.log({
            nombre,
            apellidos,
            email,
            fechaNacimiento,
            edad: age,
            // No loguear la contraseña por seguridad
            registradoEn: new Date().toISOString()
        });
        
        // Aquí normalmente enviarías los datos al servidor
        // submitToServer(formData);
        
        // Opcional: limpiar el formulario
        // registerForm.reset();
    });

    // Cargar códigos de país para el select de lada
    const selectLada = document.getElementById('lada');
    
    if (selectLada) {
        // Agregar opción por defecto
        selectLada.innerHTML = '<option value="">Selecciona un país...</option>';
        
        // Hacer la petición a la API de países con manejo de errores mejorado
        fetch('https://restcountries.com/v3.1/all?fields=name,idd')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta de la API');
                }
                return response.json();
            })
            .then(data => {
                // Filtrar países que tienen código de teléfono
                const countriesWithCodes = data.filter(country => 
                    country.idd && 
                    country.idd.root && 
                    country.name && 
                    country.name.common
                );
                
                // Ordenar países alfabéticamente
                countriesWithCodes.sort((a, b) => {
                    return a.name.common.localeCompare(b.name.common, 'es', { sensitivity: 'base' });
                });
                
                // Limpiar el select (mantener la opción por defecto)
                const defaultOption = selectLada.querySelector('option[value=""]');
                selectLada.innerHTML = '';
                if (defaultOption) {
                    selectLada.appendChild(defaultOption);
                }
                
                // Agregar opciones para cada país
                countriesWithCodes.forEach(country => {
                    const option = document.createElement('option');
                    const root = country.idd.root;
                    let suffixes = '';
                    
                    // Manejar múltiples sufijos (tomar el primero)
                    if (country.idd.suffixes && country.idd.suffixes.length > 0) {
                        suffixes = country.idd.suffixes[0];
                    }
                    
                    const fullCode = root + suffixes;
                    option.value = fullCode;
                    option.textContent = `${country.name.common} (${fullCode})`;
                    selectLada.appendChild(option);
                });
                
                // Seleccionar México por defecto si existe
                const mexicoOption = Array.from(selectLada.options).find(opt => 
                    opt.textContent.toLowerCase().includes('mexico') || 
                    opt.textContent.toLowerCase().includes('méxico')
                );
                if (mexicoOption) {
                    mexicoOption.selected = true;
                }
                
            })
            .catch(error => {
                console.error('Error al cargar los códigos de país:', error);
                
                // Cargar algunos países principales como fallback
                const fallbackCountries = [
                    { name: 'México', code: '+52' },
                    { name: 'Estados Unidos', code: '+1' },
                    { name: 'España', code: '+34' },
                    { name: 'Argentina', code: '+54' },
                    { name: 'Colombia', code: '+57' },
                    { name: 'Chile', code: '+56' }
                ];
                
                selectLada.innerHTML = '<option value="">Selecciona un país...</option>';
                
                fallbackCountries.forEach(country => {
                    const option = document.createElement('option');
                    option.value = country.code;
                    option.textContent = `${country.name} (${country.code})`;
                    selectLada.appendChild(option);
                });
                
                // Seleccionar México por defecto
                selectLada.value = '+52';
            });
    }
});