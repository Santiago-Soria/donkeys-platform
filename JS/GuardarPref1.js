document.addEventListener("DOMContentLoaded", () => {
  const habitacionCard = document.getElementById("habitacionCard");
  habitacionCard.addEventListener("click", () => {
    localStorage.setItem("filtroTipo", "Habitación");
    console.log("Se guardó en localStorage:", "Habitación");
    window.location.href = "/HTML/paso2.html";
  });

  const departamentoCard = document.getElementById("departamentoCard");
  departamentoCard.addEventListener("click", () => {
    localStorage.setItem("filtroTipo", "Departamento");
    console.log("Se guardó en localStorage:", "Departamento");
    
  });
});
