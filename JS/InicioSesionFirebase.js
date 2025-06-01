import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBpauU81ETkJBO6Zo7womi4fGBvy8ThpkQ",
  authDomain: "donkeys-cc454.firebaseapp.com",
  projectId: "donkeys-cc454",
  storageBucket: "donkeys-cc454.appspot.com",
  messagingSenderId: "679976056227",
  appId: "1:679976056227:web:7c38245c3363a6f0735616",
  measurementId: "G-6PR3CRYVRE",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", () => {
  const formLogin = document.getElementById("formLogin");
  const passwordInput = document.getElementById("password");
  const togglePassword = document.querySelector(".toggle-password i");

  // Toggle mostrar/ocultar contraseña
  document.querySelector(".toggle-password").addEventListener("click", () => {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      togglePassword.classList.remove("fa-eye");
      togglePassword.classList.add("fa-eye-slash");
    } else {
      passwordInput.type = "password";
      togglePassword.classList.remove("fa-eye-slash");
      togglePassword.classList.add("fa-eye");
    }
  });

  // Manejar envío del formulario
  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = passwordInput.value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      alert("✅ Inicio de sesión exitoso");
      localStorage.setItem("correoUsuario", email);
      window.location.href = "/HTML/Index.html";
    } catch (error) {
      alert("❌ Correo o contraseña incorrectos");
      console.error(error);
    }
  });
});
