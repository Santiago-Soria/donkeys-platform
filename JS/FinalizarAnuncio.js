import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  updateDoc,
  collection,
  addDoc
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
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", function () {
  const nextBtn = document.querySelector('.next-btn');
  const inputs = document.querySelectorAll('.detail-input');
  const descriptionTextarea = document.querySelector('.description-textarea');
  const characterCounter = document.querySelector('.character-counter');
  const tituloInput = document.querySelector('input[type="text"]');
  const tipoSelect = document.getElementById("property-type");

  const MIN_DESCRIPTION_LENGTH = 20;
  const MAX_DESCRIPTION_LENGTH = 500;

  function init() {
    setupEventListeners();
    updateNextButton();
  }

  function setupEventListeners() {
    inputs.forEach(input => {
      input.addEventListener('input', function () {
        this.value = this.value.replace(/[^0-9]/g, '');
        updateNextButton();
      });
    });

    descriptionTextarea.addEventListener('input', function () {
      const currentLength = this.value.length;
      characterCounter.textContent = `${currentLength}/${MAX_DESCRIPTION_LENGTH} caracteres`;

      if (currentLength > MAX_DESCRIPTION_LENGTH) {
        this.value = this.value.substring(0, MAX_DESCRIPTION_LENGTH);
        characterCounter.textContent = `${MAX_DESCRIPTION_LENGTH}/${MAX_DESCRIPTION_LENGTH} caracteres`;
      }

      updateNextButton();
    });

    nextBtn.addEventListener('click', handleNextStep);
  }

  function validateFields() {
    let isValid = true;

    inputs.forEach(input => {
      if (!input.value || isNaN(input.value)) {
        isValid = false;
        input.classList.add('invalid');
      } else {
        input.classList.remove('invalid');
      }
    });

    if (descriptionTextarea.value.length < MIN_DESCRIPTION_LENGTH) {
      isValid = false;
      descriptionTextarea.classList.add('invalid');
    } else {
      descriptionTextarea.classList.remove('invalid');
    }

    if (!tituloInput.value.trim() || !tipoSelect.value) {
      isValid = false;
    }

    return isValid;
  }

  function updateNextButton() {
    const isValid = validateFields();
    nextBtn.disabled = !isValid;
    nextBtn.classList.toggle('btn-disabled', !isValid);
  }

  async function handleNextStep() {
    if (!validateFields()) {
      showAlert("Campos incompletos", "Por favor completa todos los campos requeridos", "error");
      return;
    }

    const idAnuncio = localStorage.getItem("idAnuncioActual");
    if (!idAnuncio) {
      showAlert("Error", "No se encontró el ID del anuncio en localStorage", "error");
      return;
    }

    const propertyData = {
      dimensiones: parseInt(inputs[0].value.trim()),
      banos: parseInt(inputs[1].value.trim()),
      estacionamiento: parseInt(inputs[2].value.trim()),
      recamaras: parseInt(inputs[3].value.trim()),
      Descripcion: descriptionTextarea.value.trim(),
      Titulo: tituloInput.value.trim(),
      Tipo: tipoSelect.value === "departamento"
    };

    console.log("📦 Datos recopilados:", propertyData);
    console.log("🆔 ID del anuncio:", idAnuncio);

    try {
      // Guardar en Servicio/
      const servicioRef = collection(db, "Servicio");
      const docServicio = await addDoc(servicioRef, {
        idAnuncio: idAnuncio,
        dimensiones: propertyData.dimensiones,
        banos: propertyData.banos,
        estacionamiento: propertyData.estacionamiento,
        recamaras: propertyData.recamaras
      });

      console.log("✅ Documento creado en Servicio con ID:", docServicio.id);

      // Actualizar en Anuncio/
      const anuncioRef = doc(db, "Anuncio", idAnuncio);
      await updateDoc(anuncioRef, {
        Descripcion: propertyData.Descripcion,
        Titulo: propertyData.Titulo,
        Tipo: propertyData.Tipo
      });

      console.log("✅ Documento Anuncio actualizado correctamente");

      showAlert(
        "¡Listo!",
        "La información de tu inmueble ha sido guardada correctamente.",
        "success",
        () => {
          // Redirigir a la siguiente página
          window.location.href = "/HTML/resultados1.html"; // cambia si es otra
        }
      );
    } catch (error) {
      console.error("❌ Error al guardar en Firestore:", error);
      showAlert("Error", "Ocurrió un error al guardar los datos. Intenta de nuevo.", "error");
    }
  }

  function showAlert(title, text, icon, callback = null) {
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        title: title,
        text: text,
        icon: icon,
        confirmButtonColor: '#5A2F34',
        confirmButtonText: 'Entendido'
      }).then((result) => {
        if (result.isConfirmed && callback) {
          callback();
        }
      });
    } else {
      alert(`${title}\n\n${text}`);
      if (callback) callback();
    }
  }

  init();
});
