import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

// Firebase config
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

// Lógica de interfaz y Firestore
document.addEventListener('DOMContentLoaded', function () {
  const amenidadCards = document.querySelectorAll('.amenidad-card');
  const nextBtn = document.querySelector('.next-btn');
  const backButton = document.querySelector('.back-header');
  const searchInput = document.querySelector('.search-input');

  let selectedAmenities = [];
  const MIN_SELECTION = 1;

  const idAnuncio = localStorage.getItem("idAnuncioActual");
  console.log("🆔 ID del anuncio desde localStorage:", idAnuncio);

  if (!idAnuncio) {
    alert("No se encontró el ID del anuncio. Regresando...");
    window.location.href = "Registro6-2.html";
    return;
  }

  function init() {
    setupEventListeners();
    updateNextButton();
  }

  function setupEventListeners() {
    amenidadCards.forEach(card => {
      card.addEventListener('click', toggleAmenitySelection);
    });

    backButton.addEventListener('click', () => {
      window.history.back();
    });

    nextBtn.addEventListener('click', handleNextStep);

    searchInput.addEventListener('input', filterAmenities);
  }

  function toggleAmenitySelection(event) {
    const card = event.currentTarget;
    const amenityName = card.querySelector('.amenidad-name').textContent.trim();

    if (card.classList.contains('selected')) {
      card.classList.remove('selected');
      selectedAmenities = selectedAmenities.filter(item => item !== amenityName);
    } else {
      card.classList.add('selected');
      selectedAmenities.push(amenityName);
    }

    updateNextButton();
    console.log("✅ Amenidades seleccionadas:", selectedAmenities);
  }

  function updateNextButton() {
    const isValid = selectedAmenities.length >= MIN_SELECTION;
    nextBtn.disabled = !isValid;
    nextBtn.classList.toggle('btn-disabled', !isValid);

    nextBtn.title = isValid
      ? `Seleccionadas: ${selectedAmenities.length} amenidad(es)`
      : `Selecciona al menos ${MIN_SELECTION} amenidad`;
  }

  function filterAmenities() {
    const searchTerm = searchInput.value.toLowerCase();

    amenidadCards.forEach(card => {
      const amenityName = card.querySelector('.amenidad-name').textContent.toLowerCase();
      const isVisible = amenityName.includes(searchTerm);
      card.style.display = isVisible ? 'flex' : 'none';
    });
  }

  async function handleNextStep() {
    if (selectedAmenities.length < MIN_SELECTION) {
      alert(`Por favor selecciona al menos ${MIN_SELECTION} amenidad.`);
      return;
    }

    try {
      const anuncioRef = doc(db, "Anuncio", idAnuncio);

      await updateDoc(anuncioRef, {
        amenidades: selectedAmenities
      });

      console.log("📦 Amenidades guardadas en Firestore:", selectedAmenities);

      // Persistir ID en localStorage
      localStorage.setItem("idAnuncioActual", idAnuncio);

      alert("Amenidades guardadas correctamente.");
      window.location.href = "Registro9.html";

    } catch (error) {
      console.error("❌ Error al guardar las amenidades:", error);
      alert("Ocurrió un error al guardar las amenidades.");
    }
  }

  init();
});
