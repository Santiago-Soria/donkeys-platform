import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBpauU81ETkJBO6Zo7womi4fGBvy8ThpkQ",
  authDomain: "donkeys-cc454.firebaseapp.com",
  projectId: "donkeys-cc454",
  storageBucket: "donkeys-cc454.appspot.com",
  messagingSenderId: "679976056227",
  appId: "1:679976056227:web:7c38245c3363a6f0735616",
  measurementId: "G-6PR3CRYVRE"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("recoveryForm");
  const emailInput = document.getElementById("email");
  const successMessage = document.getElementById("successMessage");
  const errorMessage = document.getElementById("errorMessage");

  form.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("🔁 Se envió el formulario de recuperación de contraseña");

  const email = emailInput.value.trim();
  console.log("📧 Correo ingresado:", email);

  const actionCodeSettings = {
    url: "http://127.0.0.7:5500/HTML/recuperar.html",
    handleCodeInApp: false
  };

  try {
    await sendPasswordResetEmail(auth, email, actionCodeSettings);
    console.log("✅ Correo de recuperación enviado exitosamente");

    successMessage.textContent = `✅ Se envió un enlace de recuperación a ${email}`;
    successMessage.style.display = "block";
    errorMessage.style.display = "none";
  } catch (error) {
    console.error("❌ Error al enviar el correo:", error.code, error.message);
    successMessage.style.display = "none";
    errorMessage.style.display = "block";

    switch (error.code) {
      case "auth/user-not-found":
        errorMessage.textContent = "No existe una cuenta con ese correo.";
        break;
      case "auth/invalid-email":
        errorMessage.textContent = "El correo ingresado no es válido.";
        break;
      default:
        errorMessage.textContent = "Ocurrió un error. Intenta de nuevo.";
    }
  }
});

});
