document.addEventListener('DOMContentLoaded', function() {
  // Sidebar toggle
  document.getElementById('sidebarCollapse').addEventListener('click', function() {
    document.getElementById('sidebar').classList.toggle('active');
  });
  
  // Activate current menu item
  const currentLocation = location.pathname;
  const menuItems = document.querySelectorAll('#sidebar ul li a');
  
  menuItems.forEach(item => {
    if (item.getAttribute('href') === currentLocation) {
      item.parentElement.classList.add('active');
    }
  });
});