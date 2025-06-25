document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const dropZone = document.querySelector('.dropzone');
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.accept = 'image/jpeg, image/png, application/pdf';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
    
    const selectFilesBtn = document.querySelector('.select-files-btn');
    const nextBtn = document.querySelector('.next-button');
    const backButton = document.querySelector('.back-button');
    let uploadedFiles = [];
    
    // Configuración de validación
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
    const REQUIRED_FILES = 1; // Fotos del comprobante de domicilio
    
    // Efecto de transición de página
    function createPageTransition() {
        const transition = document.createElement('div');
        transition.className = 'page-transition';
        document.body.appendChild(transition);
        return transition;
    }

    // Inicialización
    function init() {
        updateNextButton();
        setupEventListeners();
    }
    
    // Configurar event listeners
    function setupEventListeners() {
        // Selección de archivos
        selectFilesBtn.addEventListener('click', () => fileInput.click());
        
        // Cambio en la selección de archivos
        fileInput.addEventListener('change', (e) => handleFiles(e.target.files));
        
        // Drag and drop
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });
        
        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('drag-over');
        });
        
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            if (e.dataTransfer.files.length) {
                handleFiles(e.dataTransfer.files);
            }
        });
        
        // Botón de regresar
        backButton.addEventListener('click', () => {
            window.location.href = '/HTML/Registro6.html'; // Ajusta la URL según tu estructura
        });
        
        // Botón siguiente
        nextBtn.addEventListener('click', handleNextStep);
    }
    
    // Manejo de archivos
    function handleFiles(files) {
        const validation = validateFiles(files);
        
        if (validation.invalidFiles.length > 0) {
            showErrorAlert(validation.invalidFiles);
        }
        
        if (validation.validFiles.length > 0) {
            uploadedFiles = [...uploadedFiles, ...validation.validFiles].slice(0, 1); // Limitar a 1 archivos
            showPreviews(uploadedFiles);
            updateNextButton();
        }
    }
    
    // Validación de archivos
    function validateFiles(files) {
        const result = {
            validFiles: [],
            invalidFiles: []
        };
        
        Array.from(files).forEach(file => {
            if (!ALLOWED_TYPES.includes(file.type)) {
                result.invalidFiles.push({
                    name: file.name,
                    reason: 'Tipo de archivo no permitido'
                });
                return;
            }
            
            if (file.size > MAX_FILE_SIZE) {
                result.invalidFiles.push({
                    name: file.name,
                    reason: 'Tamaño excede el límite de 10MB'
                });
                return;
            }
            
            result.validFiles.push(file);
        });
        
        return result;
    }
    
    // Mostrar alerta de error con SweetAlert2
    function showErrorAlert(invalidFiles) {
        const errorList = invalidFiles.map(file =>
            `<li>${file.name} - ${file.reason}</li>`
        ).join('');
        Swal.fire({
            icon: 'error',
            title: 'Error en los archivos',
            html: `<ul style="text-align:left">${errorList}</ul>
                   <div class="mt-2">Por favor sube solo archivos JPG, PNG o PDF menores a 10MB.</div>`
        });
    }
    
    // Mostrar previsualizaciones
    function showPreviews(files) {
        clearPreviews();
        
        const previewContainer = document.createElement('div');
        previewContainer.className = 'file-previews d-flex flex-wrap justify-content-center gap-3';
        
        files.forEach((file, index) => {
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item position-relative';
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-btn btn btn-danger btn-sm';
            removeBtn.innerHTML = '<i class="fas fa-times"></i>';
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                removeFile(index);
            });
            
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.className = 'img-thumbnail';
                    previewItem.appendChild(img);
                    previewItem.appendChild(removeBtn);
                    previewContainer.appendChild(previewItem);
                };
                reader.readAsDataURL(file);
            } else {
                const pdfIcon = document.createElement('div');
                pdfIcon.className = 'pdf-preview d-flex align-items-center justify-content-center';
                pdfIcon.innerHTML = '<i class="fas fa-file-pdf fa-3x text-danger"></i>';
                previewItem.appendChild(pdfIcon);
                previewItem.appendChild(removeBtn);
                previewContainer.appendChild(previewItem);
            }
        });
        
        dropZone.insertBefore(previewContainer, dropZone.firstChild);
    }
    
    // Limpiar previsualizaciones
    function clearPreviews() {
        const previews = dropZone.querySelector('.file-previews');
        if (previews) previews.remove();
    }
    
    // Eliminar archivo
    function removeFile(index) {
        uploadedFiles.splice(index, 1);
        showPreviews(uploadedFiles);
        updateNextButton();
    }
    
    // Actualizar estado del botón siguiente
    function updateNextButton() {
        const isValid = uploadedFiles.length >= REQUIRED_FILES;
        nextBtn.disabled = !isValid;
        nextBtn.classList.toggle('btn-secondary', !isValid);
        nextBtn.classList.toggle('btn-primary', isValid);
        
        // Actualizar texto del botón según la validación
        if (isValid) {
            nextBtn.innerHTML = '<i class="fas fa-check-circle me-2"></i>Continuar';
        } else {
            const remaining = REQUIRED_FILES - uploadedFiles.length;
            nextBtn.innerHTML = `Sube ${remaining} archivo${remaining !== 1 ? 's' : ''} más`;
        }
    }
    
    // Manejar el siguiente paso
    async function handleNextStep() {
        if (uploadedFiles.length < REQUIRED_FILES) {
            Swal.fire({
                icon: 'warning',
                title: 'Archivos insuficientes',
                text: `Por favor sube al menos ${REQUIRED_FILES} archivo${REQUIRED_FILES !== 1 ? 's' : ''}.`
            });
            return;
        }

        try {
            // Mostrar loader
            nextBtn.disabled = true;
            nextBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Procesando...';

            // Simular subida de archivos (reemplazar con tu lógica real)
            const uploadSuccess = await uploadFiles(uploadedFiles);

            if (uploadSuccess) {
                // Efecto de transición
                const transition = createPageTransition();
                transition.classList.add('active');

                // Redirección después de la animación
                setTimeout(() => {
                    window.location.href = '/HTML/Registro7.html'; // Ajusta la URL de destino
                }, 800);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al subir los archivos. Por favor inténtalo de nuevo.'
                });
                nextBtn.disabled = false;
                updateNextButton();
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error inesperado',
                text: 'Ocurrió un error inesperado. Por favor inténtalo de nuevo.'
            });
            nextBtn.disabled = false;
            updateNextButton();
        }
    }
    
    // Función simulada para subir archivos (reemplazar con tu implementación real)
    function uploadFiles(files) {
        return new Promise((resolve) => {
            // Simular tiempo de subida
            setTimeout(() => {
                // Aquí iría tu lógica real para subir los archivos al servidor
                console.log('Archivos a subir:', files);
                resolve(true); // Cambiar a false para simular un error
            }, 1500);
        });
    }
    
    // Inicializar la aplicación
    init();
});