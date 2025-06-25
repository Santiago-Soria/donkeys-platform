import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-storage.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  addDoc,
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

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
const storage = getStorage(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  const dropZone = document.querySelector(".dropzone");
  const fileInput = document.getElementById("ineInput");
  const uploadBtn = document.getElementById("uploadBtn");
  const nextBtn = document.getElementById("nextBtn");
  const fileNameText = document.getElementById("ineFileName");

  let selectedFile = null;

  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];

  // Abrir el input al hacer clic
  uploadBtn.addEventListener("click", () => fileInput.click());

  // Drag and drop
  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("drag-over");
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("drag-over");
  });

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("drag-over");
    const file = e.dataTransfer.files[0];
    handleFile(file);
  });

  // Selección de archivo manual
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    handleFile(file);
  });

  // Botón siguiente
  nextBtn.addEventListener("click", async () => {
    if (!selectedFile) {
      Swal.fire({
        icon: "warning",
        title: "Archivo requerido",
        text: "Debes seleccionar un archivo antes de continuar.",
      });
      return;
    }

    nextBtn.disabled = true;
    nextBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Subiendo...`;

    try {
      const user = auth.currentUser;
      if (!user) {
        await Swal.fire({
          icon: "error",
          title: "No autenticado",
          text: "Debes iniciar sesión.",
        });
        nextBtn.disabled = false;
        nextBtn.innerHTML = "Siguiente";
        return;
      }

      // Obtener email y limpiar caracteres inválidos
      const email = user.email.replace(/[.#$[\]]/g, "_");

      const storageRef = ref(
        storage,
        `Propietarios/Ine/${email}/${selectedFile.name}_${Date.now()}`
      );

      await uploadBytes(storageRef, selectedFile);
      const url = await getDownloadURL(storageRef);

      // Aquí guardas en Firestore usando UID si quieres, o también email
      const propietariosRef = collection(db, "propietarios");
      const q = query(propietariosRef, where("UID", "==", user.uid));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        await addDoc(propietariosRef, {
          UID: user.uid,
          email,
          urlIne: url,
          fechaSubida: new Date(),
        });
      } else {
        const docRef = doc(db, "propietarios", snapshot.docs[0].id);
        await updateDoc(docRef, {
          urlIne: url,
          fechaSubida: new Date(),
        });
      }

      await Swal.fire({
        icon: "success",
        title: "Archivo subido correctamente",
        text: "Tu INE se ha subido y guardado exitosamente.",
        timer: 1700,
        showConfirmButton: false,
      });

      selectedFile = null;
      fileInput.value = "";
      fileNameText.textContent = "Formatos: JPG, PNG, PDF • Máximo 10MB";
      updateNextBtn();
      window.location.href = "Registro6.html";
    } catch (e) {
      console.error(e);
      Swal.fire({
        icon: "error",
        title: "Error al subir archivo",
        text: "Ocurrió un error al subir el archivo. Intenta de nuevo.",
      });
    } finally {
      nextBtn.disabled = false;
      nextBtn.innerHTML = `Siguiente`;
    }
  });

  // Función para manejar la validación de archivos
  function handleFile(file) {
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      Swal.fire({
        icon: "error",
        title: "Tipo de archivo no permitido",
        text: "Solo se permiten archivos JPG, PNG o PDF.",
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      Swal.fire({
        icon: "error",
        title: "Archivo demasiado grande",
        text: "El archivo debe ser menor a 10MB.",
      });
      return;
    }

    selectedFile = file;
    fileNameText.textContent = file.name;
    updateNextBtn();
  }

  // Activar o desactivar botón siguiente
  function updateNextBtn() {
    const isValid = !!selectedFile;
    nextBtn.disabled = !isValid;
    nextBtn.classList.toggle("btn-secondary", !isValid);
    nextBtn.classList.toggle("btn-primary", isValid);
    nextBtn.innerHTML = isValid
      ? '<i class="fas fa-check-circle me-2"></i>Subir INE'
      : "Selecciona un archivo";
  }
});
