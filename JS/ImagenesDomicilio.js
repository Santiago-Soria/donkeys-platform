import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBpauU81ETkJBO6Zo7womi4fGBvy8ThpkQ",
  authDomain: "donkeys-cc454.firebaseapp.com",
  projectId: "donkeys-cc454",
  storageBucket: "donkeys-cc454.firebasestorage.app",
  messagingSenderId: "679976056227",
  appId: "1:679976056227:web:7c38245c3363a6f0735616",
  measurementId: "G-6PR3CRYVRE",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

document.addEventListener("DOMContentLoaded", function () {
  let photos = [];
  const maxPhotos = 5;
  const idAnuncio = localStorage.getItem("idAnuncioActual");
  
  const fileInput = document.getElementById("fileInput");
  const previewGrid = document.getElementById("previewGrid");
  const uploadSection = document.querySelector(".upload-section");
  const counterText = document.getElementById("counterText");
  const photoCounter = document.getElementById("photoCounter");
  const nextBtn = document.getElementById("nextBtn");

  function initializeGrid() {
    previewGrid.innerHTML = "";
    for (let i = 0; i < maxPhotos; i++) {
      const slot = createPhotoSlot(i);
      previewGrid.appendChild(slot);
    }
    updateCounter();
  }

  function createPhotoSlot(index) {
    const slot = document.createElement("div");
    slot.className = "photo-preview";
    slot.dataset.index = index;

    if (photos[index]) {
      slot.innerHTML = `
        <img src="${photos[index].url}" alt="Foto ${index + 1}">
        <button class="delete-btn" title="Eliminar foto">×</button>
      `;
      slot.querySelector(".delete-btn").addEventListener("click", function (e) {
        e.stopPropagation();
        removePhoto(index);
      });
    } else {
      slot.innerHTML = `
        <div class="placeholder">
          <div class="placeholder-icon">📷</div>
          <div class="placeholder-text">Foto ${index + 1}</div>
        </div>
      `;
      slot.querySelector(".placeholder").addEventListener("click", function () {
        selectPhoto(index);
      });
    }

    return slot;
  }

  function selectPhoto(index) {
    fileInput.dataset.targetIndex = index;
    fileInput.click();
  }

  fileInput.addEventListener("change", function () {
    const files = Array.from(fileInput.files);
    const targetIndex = parseInt(this.dataset.targetIndex);

    if (!isNaN(targetIndex)) {
      if (files[0]) addPhotoToSlot(files[0], targetIndex);
    } else {
      files.forEach(file => {
        if (photos.length < maxPhotos) {
          const nextIndex = findNextEmptySlot();
          if (nextIndex !== -1) addPhotoToSlot(file, nextIndex);
        }
      });
    }

    this.value = "";
    delete this.dataset.targetIndex;
  });

  function findNextEmptySlot() {
    for (let i = 0; i < maxPhotos; i++) {
      if (!photos[i]) return i;
    }
    return -1;
  }

  function addPhotoToSlot(file, index) {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024;
    if (!validTypes.includes(file.type) || file.size > maxSize) {
      alert("Por favor selecciona una imagen válida (JPG, PNG, WEBP) menor a 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
      photos[index] = {
        file,
        url: e.target.result,
        name: file.name
      };
      updateGrid();
    };
    reader.readAsDataURL(file);
  }

  function removePhoto(index) {
    delete photos[index];
    updateGrid();
  }

  function updateGrid() {
    initializeGrid();
  }

  function updateCounter() {
    const count = photos.filter(p => p).length;
    counterText.textContent = `${count} de ${maxPhotos} fotos subidas`;
    photoCounter.className = count >= maxPhotos ? "photo-counter counter-complete" : "photo-counter counter-incomplete";
    nextBtn.disabled = count < maxPhotos;
  }

  uploadSection.addEventListener("dragover", function (e) {
    e.preventDefault();
    this.classList.add("dragover");
  });

  uploadSection.addEventListener("dragleave", function (e) {
    e.preventDefault();
    this.classList.remove("dragover");
  });

  uploadSection.addEventListener("drop", function (e) {
    e.preventDefault();
    this.classList.remove("dragover");
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith("image/"));
    files.forEach(file => {
      if (photos.length < maxPhotos) {
        const nextIndex = findNextEmptySlot();
        if (nextIndex !== -1) addPhotoToSlot(file, nextIndex);
      }
    });
  });
  console.log("🆔 ID del anuncio desde sessionStorage:", idAnuncio);

  // ... (módulos e inicializaciones mantienen igual)

nextBtn.addEventListener("click", async () => {
  const validPhotos = photos.filter(p => p && p.file);

  if (validPhotos.length < maxPhotos) {
    alert("Debes subir mínimo 5 fotos.");
    return;
  }

  nextBtn.disabled = true;
  nextBtn.innerHTML = "Subiendo imágenes...";

  try {
    const user = auth.currentUser;
    if (!user) {
      alert("Debes iniciar sesión.");
      return;
    }

    const email = user.email.replace(/[.#$[\]]/g, "_");
    const uid = user.uid;
    const idAnuncio = localStorage.getItem("idAnuncioActual");

    if (!idAnuncio) {
      alert("No se encontró el ID del anuncio. Regresa y vuelve a intentarlo.");
      return;
    }

    console.log("🆔 ID del anuncio desde sessionStorage:", idAnuncio);

    const urls = [];

    for (let i = 0; i < validPhotos.length; i++) {
      const file = validPhotos[i].file;
      const storageRef = ref(storage, `Anuncio/Domicilio/${email}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      console.log(`✅ URL ${i + 1}:`, url);
      urls.push(url);
    }

    const anuncioDocRef = doc(db, "Anuncio", idAnuncio);
    const anuncioSnap = await getDocs(query(collection(db, "Anuncio"), where("ID_Propietario", "==", uid), where("idAnuncio", "==", idAnuncio)));

    if (anuncioSnap.empty) {
      alert("No se encontró el anuncio con ese ID y propietario.");
      return;
    }

    const updateData = {};
    urls.forEach((url, index) => {
      updateData[`URLImagen${index + 1}`] = url;
    });

    console.log("📤 URLs a subir:", updateData);
    await updateDoc(anuncioDocRef, updateData);

    console.log("✅ Firestore actualizado correctamente.");
    alert("Imágenes subidas y guardadas correctamente.");

    // Redirigir si deseas
     window.location.href = "/HTML/Registro8.html";

  } catch (error) {
    console.error("❌ Error al subir o guardar URLs:", error);
    alert("Ocurrió un error al subir las imágenes o guardarlas.");
  } finally {
    nextBtn.disabled = false;
    nextBtn.textContent = "Siguiente";
  }
});



  initializeGrid();
  window.removePhoto = removePhoto;
  window.selectPhoto = selectPhoto;
});
