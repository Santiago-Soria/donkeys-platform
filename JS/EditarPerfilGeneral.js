import { getAuth, updatePassword } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

// Obtener referencia al formulario
const form = document.querySelector('.edit-profile-form');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm_password');

// Escuchar el envío del formulario
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nuevaContrasena = passwordInput.value.trim();
  const confirmarContrasena = confirmPasswordInput.value.trim();

  // Si el usuario ingresó contraseñas (no están vacías)
  if (nuevaContrasena || confirmarContrasena) {

    // Validar coincidencia
    if (nuevaContrasena !== confirmarContrasena) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    // Validar seguridad de contraseña
    const esSegura = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(nuevaContrasena);
    if (!esSegura) {
      alert("La contraseña debe tener al menos 8 caracteres, incluir mayúscula, minúscula, número y símbolo.");
      return;
    }

    try {
      const auth = getAuth();
      const usuario = auth.currentUser;

      if (usuario) {
        await updatePassword(usuario, nuevaContrasena);
        alert("Contraseña actualizada exitosamente.");
        passwordInput.value = '';
        confirmPasswordInput.value = '';
      } else {
        alert("No hay usuario autenticado.");
      }

    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        alert("Por seguridad, vuelve a iniciar sesión para cambiar tu contraseña.");
        // Aquí puedes redirigir al login si quieres:
        // window.location.href = "/HTML/login.html";
      } else {
        alert("Error al actualizar la contraseña: " + error.message);
      }
    }

  } else {
    // Si no cambió contraseña, simplemente continúa (puedes agregar lógica para guardar otros datos si quieres)
    alert("No se ingresó nueva contraseña. Datos actualizados sin cambiar la contraseña.");
  }
});
