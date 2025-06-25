// /JS/AuthSesionAdmin.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

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
const db = getFirestore(app);

// Selecciona el contenedor donde quieres mostrar el email y el logout
const navbarRight = document.querySelector('.navbar .ms-auto');

if (!navbarRight) {
  console.warn('No se encontró el contenedor .ms-auto en navbar');
}

// Crear elementos para usuario y logout
const userLink = document.createElement('a');
userLink.href = '/HTML/index.html';  // perfil admin
userLink.target = '_blank';
userLink.style.textDecoration = 'none';
userLink.style.color = 'WHITE';
userLink.style.fontWeight = '600';
userLink.style.marginRight = '20px';

const logoutLink = document.createElement('a');
logoutLink.href = '#';
logoutLink.textContent = 'Salir';
logoutLink.style.color = 'WHITE';
logoutLink.style.cursor = 'pointer';
logoutLink.style.fontWeight = '600';

onAuthStateChanged(auth, async (user) => {
  if (user && navbarRight) {
    // Opcional: traer datos de Firestore
    try {
      const userDocRef = doc(db, "Usuarios", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        console.log("Datos admin Firestore:", userDocSnap.data());
      }
    } catch (e) {
      console.error("Error obteniendo datos admin:", e);
    }
    // Mostrar correo y botón salir
    userLink.textContent = user.email;

    // Vaciar el contenedor antes de agregar
    navbarRight.innerHTML = '';
    navbarRight.appendChild(userLink);
    navbarRight.appendChild(logoutLink);
  } else if (navbarRight) {
    // No logueado: redirigir a login admin o mostrar link login
    navbarRight.innerHTML = `<a href="/HTML/loginadmin.html" style="font-weight:600; color:black;">Iniciar Sesión</a>`;
  }
});

// Evento logout
logoutLink.addEventListener('click', async (e) => {
  e.preventDefault();
  try {
    await signOut(auth);
    await Swal.fire({
      icon: 'success',
      title: 'Sesión cerrada',
      text: 'Sesión cerrada correctamente.',
      timer: 1500,
      showConfirmButton: false
    });
    window.location.href = '/index.html';
  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: 'Error al cerrar sesión',
      text: 'Ocurrió un error al cerrar la sesión. Intenta de nuevo.'
    });
    console.error(error);
  }
});
