document.addEventListener('DOMContentLoaded', function() {
  // Seleccionar amenidades
  const amenidadCards = document.querySelectorAll('.amenidad-card');
  
  amenidadCards.forEach(card => {
    card.addEventListener('click', function() {
      this.classList.toggle('selected');
      
      if (this.classList.contains('selected')) {
       
        this.querySelector('.amenidad-name').style.color = 'white';
      } else {
       
        this.querySelector('.amenidad-name').style.color = 'white';
      }
    });
  });
  
  // Botón de regresar
  const backButton = document.querySelector('.back-header');
  backButton.addEventListener('click', function() {
    window.history.back();
  });
  
  // Botón siguiente
  const nextBtn = document.querySelector('.next-btn');
  nextBtn.addEventListener('click', function() {
    // Aquí puedes agregar la lógica para avanzar a la siguiente página
    window.location.href = '/HTML/Registro9.html';
  });
});