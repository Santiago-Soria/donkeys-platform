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
  // Crear input dinámico y agregarlo al DOM
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".jpg, .jpeg, .png, .pdf";
  fileInput.style.display = "none";
  document.body.appendChild(fileInput);
  const selectBtn = document.querySelector(".select-files-btn");
  const nextBtn = document.querySelector(".next-button");
  const fileInfo = document.querySelector(".file-formats");

  let selectedFile = null;

  const MAX_SIZE = 10 * 1024 * 1024;
  const VALID_TYPES = ["image/jpeg", "image/png", "application/pdf"];

  selectBtn.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    handleFile(file);
  });

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

  auth.onAuthStateChanged((user) => {
    if (user) {
      const idAnuncio = localStorage.getItem("idAnuncioActual");
      console.log("🆔 ID del anuncio recuperado:", idAnuncio);
      if (!idAnuncio) {
        alert("No se encontró el ID del anuncio. Regresa y vuelve a intentarlo.");
        window.location.href = "Registro5.html";
      }
    } else {
      alert("Debes iniciar sesión.");
      window.location.href = "login.html";
    }
  });

  function handleFile(file) {
    if (!file) return;

    if (!VALID_TYPES.includes(file.type)) {
      alert("Tipo de archivo no permitido.");
      return;
    }

    if (file.size > MAX_SIZE) {
      alert("El archivo debe ser menor a 10MB.");
      return;
    }

    selectedFile = file;
    fileInfo.textContent = file.name;
    updateNextButton();
  }

  function updateNextButton() {
    const isValid = !!selectedFile;
    nextBtn.disabled = !isValid;
    nextBtn.classList.toggle("btn-secondary", !isValid);
    nextBtn.classList.toggle("btn-primary", isValid);
    nextBtn.innerHTML = isValid ? "Subir comprobante" : "Siguiente";
  }

  nextBtn.addEventListener("click", async () => {
    if (!selectedFile) {
      await Swal.fire({
        icon: "warning",
        title: "Archivo requerido",
        text: "Debes seleccionar un archivo antes de continuar.",
      });
      return;
    }

    try {
      nextBtn.disabled = true;
      nextBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span> Subiendo...`;

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

      const email = user.email.replace(/[.#$[\]]/g, "_");
      const uid = user.uid;

      const idAnuncio = localStorage.getItem("idAnuncioActual");
      if (!idAnuncio) {
        await Swal.fire({
          icon: "error",
          title: "Sin ID de anuncio",
          text: "No se encontró el ID del anuncio. Regresa y vuelve a intentarlo.",
        });
        nextBtn.disabled = false;
        nextBtn.innerHTML = "Siguiente";
        return;
      }

      const storageRef = ref(
        storage,
        `Propietarios/ComprobanteDomicilio/${email}/${selectedFile.name}_${Date.now()}`
      );

      await uploadBytes(storageRef, selectedFile);
      const url = await getDownloadURL(storageRef);

      const propietariosRef = collection(db, "propietarios");
      const q = query(propietariosRef, where("UID", "==", uid));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        await addDoc(propietariosRef, {
          UID: uid,
          email,
          urlCheckDomicilio: url,
          fechaSubida: new Date(),
        });
      } else {
        const docSnap = snapshot.docs[0];
        const docRef = doc(db, "propietarios", docSnap.id);

        await updateDoc(docRef, {
          urlCheckDomicilio: url,
          fechaSubida: new Date(),
        });
      }

      await Swal.fire({
        icon: "success",
        title: "Comprobante subido correctamente",
        text: "Tu comprobante de domicilio ha sido subido exitosamente.",
        timer: 1700,
        showConfirmButton: false,
      });

      // Limpiar input y estado visual
      fileInput.value = "";
      fileInfo.textContent = "Formatos: JPG, PNG, PDF • Máximo 10MB";
      selectedFile = null;
      updateNextButton();

      window.location.href = "Registro7.html";
    } catch (error) {
      console.error("❌ Error al subir comprobante:", error);
      await Swal.fire({
        icon: "error",
        title: "Error al subir comprobante",
        text: "Ocurrió un error al subir el archivo.",
      });
    } finally {
      nextBtn.disabled = false;
      nextBtn.innerHTML = "Siguiente";
    }
  });
});
