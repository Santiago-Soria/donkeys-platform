document.addEventListener('DOMContentLoaded', function() {
  const sortTrigger = document.getElementById('sortTrigger');
  const sortDropdown = document.getElementById('sortDropdown');
  const sortOptions = document.querySelectorAll('.sort-option');
  
  let currentSort = 'recent'; // Default sort option
  
  // Toggle dropdown
  sortTrigger.addEventListener('click', function(e) {
    e.stopPropagation();
    sortDropdown.classList.toggle('show');
  });
  
  // Handle option selection
  sortOptions.forEach(option => {
    option.addEventListener('click', function() {
      // Remove active class from all options
      sortOptions.forEach(opt => opt.classList.remove('active'));
      
      // Add active class to selected option
      this.classList.add('active');
      
      // Get the sort value
      currentSort = this.getAttribute('data-value');
      console.log('Selected sort:', currentSort);
      
      // Here you would typically trigger your sorting function
      // sortProperties(currentSort);
      
      // Close dropdown
      sortDropdown.classList.remove('show');
    });
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', function() {
    sortDropdown.classList.remove('show');
  });
  
  // Prevent dropdown from closing when clicking inside it
  sortDropdown.addEventListener('click', function(e) {
    e.stopPropagation();
  });
  
  // Set default active option
  document.querySelector(`.sort-option[data-value="${currentSort}"]`).classList.add('active');
});