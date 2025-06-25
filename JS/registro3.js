document.addEventListener('DOMContentLoaded', function() {
    const credencialUpload = document.getElementById('credencialUpload');
    const horarioUpload = document.getElementById('horarioUpload');
    const credencialInput = document.getElementById('credencial');
    const horarioInput = document.getElementById('horario');
    const submitBtn = document.querySelector('.submit-btn');
    const verificationForm = document.querySelector('.verification-form');
    
    let credencialFile = null;
    let horarioFile = null;
    
    // Manejar clic en el área de credencial
    credencialUpload.addEventListener('click', function() {
        credencialInput.click();
    });
    
    // Manejar clic en el área de horario
    horarioUpload.addEventListener('click', function() {
        horarioInput.click();
    });
    
    // Manejar selección de archivo para credencial
    credencialInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            credencialFile = e.target.files[0];
            updateFileDisplay(credencialUpload, credencialFile.name);
            checkFiles();
        }
    });
    
    // Manejar selección de archivo para horario
    horarioInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            horarioFile = e.target.files[0];
            updateFileDisplay(horarioUpload, horarioFile.name);
            checkFiles();
        }
    });
    
    // Actualizar la visualización del archivo seleccionado
    function updateFileDisplay(uploadBox, fileName) {
        const instructions = uploadBox.querySelector('.file-instructions');
        instructions.textContent = fileName;
        instructions.style.fontWeight = '500';
        instructions.style.color = '#5A2F34';
    }
    
    // Verificar si ambos archivos están seleccionados
    function checkFiles() {
        if (credencialFile && horarioFile) {
            submitBtn.classList.add('active');
            submitBtn.disabled = false;
        } else {
            submitBtn.classList.remove('active');
            submitBtn.disabled = true;
        }
    }
    
    // Manejar envío del formulario
    verificationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar tamaño de archivos (5MB máximo)
        const maxSize = 5 * 1024 * 1024; // 5MB
        
        if (credencialFile.size > maxSize || horarioFile.size > maxSize) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Uno o ambos archivos exceden el tamaño máximo de 5MB'
            });
            return;
        }
        
        // Mostrar mensaje de confirmación
        Swal.fire({
            icon: 'success',
            title: 'Documentos recibidos',
            text: 'Tus documentos han sido enviados para verificación. Te notificaremos por correo electrónico cuando hayan sido procesados.',
            confirmButtonText: 'Aceptar'
        }).then(() => {
            // Redirigir después de mostrar el mensaje
            window.location.href = '/index.html';
        });
        
        // Aquí iría la lógica real para subir los archivos al servidor
        console.log('Credencial:', credencialFile);
        console.log('Horario:', horarioFile);
    });
    
    // Drag and drop functionality
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        [credencialUpload, horarioUpload].forEach(uploadBox => {
            uploadBox.addEventListener(eventName, preventDefaults, false);
        });
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        [credencialUpload, horarioUpload].forEach(uploadBox => {
            uploadBox.addEventListener(eventName, highlight, false);
        });
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        [credencialUpload, horarioUpload].forEach(uploadBox => {
            uploadBox.addEventListener(eventName, unhighlight, false);
        });
    });
    
    function highlight(e) {
        this.classList.add('highlight');
    }
    
    function unhighlight(e) {
        this.classList.remove('highlight');
    }
    
    [credencialUpload, horarioUpload].forEach(uploadBox => {
        uploadBox.addEventListener('drop', handleDrop, false);
    });
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        const input = this === credencialUpload ? credencialInput : horarioInput;
        
        input.files = files;
        const event = new Event('change');
        input.dispatchEvent(event);
    }
});