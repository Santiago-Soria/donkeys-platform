document.addEventListener('DOMContentLoaded', function() {
    const changePasswordForm = document.getElementById('changePasswordForm');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const submitBtn = document.getElementById('submitBtn');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const btnText = document.getElementById('btnText');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    const loginLink = document.getElementById('loginLink');

    let passwordRequirements = {
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
    };

    // Event listeners
    newPasswordInput.addEventListener('input', function() {
        checkPasswordStrength();
        errorMessage.style.display = 'none';
    });

    confirmPasswordInput.addEventListener('input', function() {
        checkPasswordMatch();
        errorMessage.style.display = 'none';
    });

    changePasswordForm.addEventListener('submit', function(event) {
        event.preventDefault();
        handleSubmit();
    });

    function togglePassword(fieldId) {
        const field = document.getElementById(fieldId);
        const type = field.getAttribute('type') === 'password' ? 'text' : 'password';
        field.setAttribute('type', type);
    }

    function checkPasswordStrength() {
        const password = newPasswordInput.value;
        const strengthDiv = document.getElementById('passwordStrength');
        
        // Reset requirements
        passwordRequirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        // Update requirement indicators
        updateRequirementIndicator('req-length', passwordRequirements.length);
        updateRequirementIndicator('req-uppercase', passwordRequirements.uppercase);
        updateRequirementIndicator('req-lowercase', passwordRequirements.lowercase);
        updateRequirementIndicator('req-number', passwordRequirements.number);
        updateRequirementIndicator('req-special', passwordRequirements.special);

        // Calculate strength
        const metRequirements = Object.values(passwordRequirements).filter(Boolean).length;
        
        if (password.length === 0) {
            strengthDiv.classList.remove('show');
            return;
        }

        strengthDiv.classList.add('show');
        strengthDiv.classList.remove('strength-weak', 'strength-medium', 'strength-strong');

        if (metRequirements < 3) {
            strengthDiv.classList.add('strength-weak');
            strengthDiv.textContent = 'Contraseña débil';
        } else if (metRequirements < 5) {
            strengthDiv.classList.add('strength-medium');
            strengthDiv.textContent = 'Contraseña media';
        } else {
            strengthDiv.classList.add('strength-strong');
            strengthDiv.textContent = 'Contraseña fuerte';
        }

        checkFormValidity();
    }

    function updateRequirementIndicator(elementId, isMet) {
        const element = document.getElementById(elementId);
        if (isMet) {
            element.classList.add('met');
        } else {
            element.classList.remove('met');
        }
    }

    function checkPasswordMatch() {
        const password = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (confirmPassword.length === 0) {
            confirmPasswordInput.classList.remove('valid', 'invalid');
            return;
        }

        if (password === confirmPassword) {
            confirmPasswordInput.classList.remove('invalid');
            confirmPasswordInput.classList.add('valid');
        } else {
            confirmPasswordInput.classList.remove('valid');
            confirmPasswordInput.classList.add('invalid');
        }

        checkFormValidity();
    }

    function checkFormValidity() {
        const password = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        const allRequirementsMet = Object.values(passwordRequirements).every(Boolean);
        const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
        
        submitBtn.disabled = !(allRequirementsMet && passwordsMatch);
    }

    function handleSubmit() {
        const password = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        // Validaciones finales
        if (password !== confirmPassword) {
            errorMessage.style.display = 'block';
            document.getElementById('errorText').textContent = 'Las contraseñas no coinciden.';
            return;
        }
        
        const allRequirementsMet = Object.values(passwordRequirements).every(Boolean);
        if (!allRequirementsMet) {
            errorMessage.style.display = 'block';
            document.getElementById('errorText').textContent = 'La contraseña no cumple con todos los requisitos.';
            return;
        }
        
        // Mostrar estado de carga
        submitBtn.disabled = true;
        loadingSpinner.style.display = 'inline-block';
        btnText.textContent = 'Procesando...';
        
        // Simular cambio de contraseña (reemplazar con lógica real)
        setTimeout(() => {
            successMessage.style.display = 'block';
            changePasswordForm.style.display = 'none';
            loginLink.style.display = 'block';
            
            // Restaurar botón
            submitBtn.disabled = false;
            loadingSpinner.style.display = 'none';
            btnText.textContent = 'Cambiar Contraseña';
        }, 2000);
    }

    function goToLogin() {
        // Aquí puedes agregar la lógica para ir al login
        window.location.href = '/login';
    }
});