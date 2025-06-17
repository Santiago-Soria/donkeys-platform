let preferenciasSeleccionadas = [];

document.addEventListener("DOMContentLoaded", () => {
  // Clicks en preferencias
  document.querySelectorAll(".preferencia-card").forEach(card => {
    card.addEventListener("click", () => {
      const nombre = card.getAttribute("data-nombre");
      if (!nombre) return;

      if (preferenciasSeleccionadas.includes(nombre)) {
        preferenciasSeleccionadas = preferenciasSeleccionadas.filter(p => p !== nombre);
      } else {
        preferenciasSeleccionadas.push(nombre);
      }

      document.querySelector(".selected-count").textContent =
        `${preferenciasSeleccionadas.length} preferencias seleccionadas`;
    });
  });

  // Finalizar
  document.getElementById("finalizar-btn").addEventListener("click", (e) => {
    e.preventDefault();

    // Guardar preferencias seleccionadas
    localStorage.setItem("filtroPreferencias", JSON.stringify(preferenciasSeleccionadas));

    // Animación
    const x = e.clientX;
    const y = e.clientY;
    const transition = document.querySelector('.page-transition');
    transition.style.left = `${x}px`;
    transition.style.top = `${y}px`;
    transition.classList.add('active');

    setTimeout(() => {
      window.location.href = "/HTML/resultados1.html";
    }, 800);
  });
});
