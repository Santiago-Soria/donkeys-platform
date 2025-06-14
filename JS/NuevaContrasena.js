import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, confirmPasswordReset } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBpauU81ETkJBO6Zo7womi4fGBvy8ThpkQ",
  authDomain: "donkeys-cc454.firebaseapp.com",
  projectId: "donkeys-cc454",
  storageBucket: "donkeys-cc454.appspot.com",
  messagingSenderId: "679976056227",
  appId: "1:679976056227:web:7c38245c3363a6f0735616"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Obtener código de recuperación
const params = new URLSearchParams(window.location.search);
const oobCode = params.get('oobCode');

// Referencias DOM
const form = document.getElementById('changePasswordForm');
const newPasswordInput = document.getElementById('newPassword');
const confirmPasswordInput = document.getElementById('confirmPassword');
const submitBtn = document.getElementById('submitBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const btnText = document.getElementById('btnText');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const loginLink = document.getElementById('loginLink');

// Mostrar error si no hay código
if (!oobCode) {
  errorMessage.style.display = "block";
  errorText.textContent = "Código de recuperación inválido o expirado.";
  form.style.display = "none";
}

// Validar contraseña segura
function validarPassword(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])(?!.*\s).{8,}$/;
  return regex.test(password);
}

// Habilita/deshabilita el botón al escribir
function actualizarEstadoBoton() {
  const password = newPasswordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  const valido = validarPassword(password) && password === confirmPassword;
  submitBtn.disabled = !valido;
}

// Escuchar cambios
newPasswordInput.addEventListener('input', actualizarEstadoBoton);
confirmPasswordInput.addEventListener('input', actualizarEstadoBoton);

// Cambiar contraseña
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newPassword = newPasswordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (newPassword !== confirmPassword) {
    errorMessage.style.display = "block";
    errorText.textContent = "Las contraseñas no coinciden.";
    return;
  }

  submitBtn.disabled = true;
  loadingSpinner.style.display = "inline-block";
  btnText.textContent = "Cambiando...";

  try {
    await confirmPasswordReset(auth, oobCode, newPassword);
    form.style.display = "none";
    errorMessage.style.display = "none";
    successMessage.style.display = "block";
    loginLink.style.display = "block";
  } catch (error) {
    errorMessage.style.display = "block";
    errorText.textContent = "Error al cambiar la contraseña: " + error.message;
    submitBtn.disabled = false;
    loadingSpinner.style.display = "none";
    btnText.textContent = "Cambiar Contraseña";
  }
});
