document.addEventListener('DOMContentLoaded', function () {
    let photos = [];
    const maxPhotos = 5;

    // Elementos del DOM
    const fileInput = document.getElementById('fileInput');
    const previewGrid = document.getElementById('previewGrid');
    const uploadSection = document.querySelector('.upload-section');
    const counterText = document.getElementById('counterText');
    const photoCounter = document.getElementById('photoCounter');
    const nextBtn = document.getElementById('nextBtn');

    // Inicializar la grilla con placeholders
    function initializeGrid() {
        previewGrid.innerHTML = '';
        for (let i = 0; i < maxPhotos; i++) {
            const slot = createPhotoSlot(i);
            previewGrid.appendChild(slot);
        }
    }

    // Crear slot de foto
    function createPhotoSlot(index) {
        const slot = document.createElement('div');
        slot.className = 'photo-preview';
        slot.dataset.index = index;

        if (photos[index]) {
            // Slot con foto
            slot.innerHTML = `
                <img src="${photos[index].url}" alt="Foto ${index + 1}">
                <button class="delete-btn" title="Eliminar foto">×</button>
            `;
            slot.querySelector('.delete-btn').addEventListener('click', function (e) {
                e.stopPropagation();
                removePhoto(index);
            });
        } else {
            // Slot vacío
            slot.innerHTML = `
                <div class="placeholder">
                    <div class="placeholder-icon">📷</div>
                    <div class="placeholder-text">Foto ${index + 1}</div>
                </div>
            `;
            slot.querySelector('.placeholder').addEventListener('click', function () {
                selectPhoto(index);
            });
        }

        return slot;
    }

    // Seleccionar foto para un slot específico
    function selectPhoto(index) {
        fileInput.dataset.targetIndex = index;
        fileInput.click();
    }

    // Manejar selección de archivos
    fileInput.addEventListener('change', function () {
        const files = Array.from(this.files);
        const targetIndex = parseInt(this.dataset.targetIndex);

        if (!isNaN(targetIndex)) {
            if (files[0]) {
                addPhotoToSlot(files[0], targetIndex);
            }
        } else {
            files.forEach(file => {
                if (photos.filter(p => p && p.file).length < maxPhotos) {
                    const nextIndex = findNextEmptySlot();
                    if (nextIndex !== -1) {
                        addPhotoToSlot(file, nextIndex);
                    }
                }
            });
        }

        this.value = '';
        delete this.dataset.targetIndex;
    });

    // Encontrar el siguiente slot vacío
    function findNextEmptySlot() {
        for (let i = 0; i < maxPhotos; i++) {
            if (!photos[i] || !photos[i].file) {
                return i;
            }
        }
        return -1;
    }

    // Añadir foto a un slot específico
    function addPhotoToSlot(file, index) {
        if (!isValidFile(file)) {
            Swal.fire({
                icon: 'error',
                title: 'Archivo inválido',
                text: 'Por favor selecciona una imagen válida (JPG, PNG, WEBP) menor a 5MB'
            });
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            photos[index] = {
                file: file,
                url: e.target.result,
                name: file.name
            };
            console.log(`Foto agregada en el slot ${index}`, photos[index]);
            updateGrid();
        };
        reader.readAsDataURL(file);
    }

    // Validar archivo
    function isValidFile(file) {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        const maxSize = 5 * 1024 * 1024;
        return validTypes.includes(file.type) && file.size <= maxSize;
    }

    // Eliminar foto
    function removePhoto(index) {
        console.log(`Eliminando foto del slot ${index}`);
        photos[index] = null;
        updateGrid();
    }

    // Actualizar la grilla y el contador
    function updateGrid() {
        console.log("Actualizando grilla...");
        initializeGrid();
        updateCounter();
    }

    // Actualizar contador y botón
    function updateCounter() {
        const photoCount = photos.filter(photo => photo && photo.file).length;
        console.log(`Contador de fotos válidas: ${photoCount}`);
        counterText.textContent = `${photoCount} de ${maxPhotos} fotos subidas`;

        if (photoCount >= maxPhotos) {
            photoCounter.className = 'photo-counter counter-complete';
            nextBtn.disabled = false;
        } else {
            photoCounter.className = 'photo-counter counter-incomplete';
            nextBtn.disabled = true;
        }
    }

    // Validar mínimo de fotos antes de avanzar
    nextBtn.addEventListener('click', function () {
        const photoCount = photos.filter(photo => photo && photo.file).length;
        if (photoCount < maxPhotos) {
            Swal.fire({
                icon: 'warning',
                title: 'Faltan fotos',
                text: 'Debes subir al menos 5 fotos para continuar.'
            });
            return;
        }

        console.log("Suficientes fotos cargadas. Puedes continuar.");
        // window.location.href = '/HTML/Registro8.html';
    });

    // Drag and drop
    uploadSection.addEventListener('dragover', function (e) {
        e.preventDefault();
        this.classList.add('dragover');
    });

    uploadSection.addEventListener('dragleave', function (e) {
        e.preventDefault();
        this.classList.remove('dragover');
    });

    uploadSection.addEventListener('drop', function (e) {
        e.preventDefault();
        this.classList.remove('dragover');

        const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
        console.log("Archivos soltados:", files);

        files.forEach(file => {
            if (photos.filter(p => p && p.file).length < maxPhotos) {
                const nextIndex = findNextEmptySlot();
                if (nextIndex !== -1) {
                    addPhotoToSlot(file, nextIndex);
                }
            }
        });
    });

    // Inicializar grilla
    initializeGrid();

    // Exponer funciones globales si se requiere
    window.removePhoto = removePhoto;
    window.selectPhoto = selectPhoto;
});
