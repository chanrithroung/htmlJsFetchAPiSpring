// Modal functionality
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('addStudentModal');
  const openModalBtn = document.getElementById('openAddStudentModal');
  const closeModalBtn = document.getElementById('closeAddStudentModal');
  const cancelBtn = document.getElementById('cancelAddStudent');
  const submitBtn = document.getElementById('submitAddStudent');
  const form = document.getElementById('addStudentForm');
  
  // Toggle password visibility
  const togglePasswordBtn = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('studentPassword');
  const eyeIcon = document.getElementById('eyeIcon');
  
  // Form fields
  const nameInput = document.getElementById('studentName');
  const genderInput = document.getElementById('studentGender');
  
  // Error messages
  const nameError = document.getElementById('nameError');
  const genderError = document.getElementById('genderError');
  const passwordError = document.getElementById('passwordError');
  
  // Open modal
  openModalBtn.addEventListener('click', function() {
    modal.classList.remove('hidden');
    // Reset form
    form.reset();
    hideAllErrors();
  });
  
  // Close modal functions
  function closeModal() {
    modal.classList.add('hidden');
  }
  
  closeModalBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  
  // Close modal when clicking outside
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  // Toggle password visibility
  togglePasswordBtn.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // Toggle eye icon
    if (type === 'text') {
      eyeIcon.innerHTML = `
        <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
      `;
    } else {
      eyeIcon.innerHTML = `
        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
        <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
      `;
    }
  });
  
  // Hide all error messages
  function hideAllErrors() {
    nameError.classList.add('hidden');
    genderError.classList.add('hidden');
    passwordError.classList.add('hidden');
  }
  
  // Validate form
  function validateForm() {
    let isValid = true;
    hideAllErrors();
    
    // Validate name
    if (!nameInput.value.trim()) {
      nameError.textContent = 'Please enter a name';
      nameError.classList.remove('hidden');
      isValid = false;
    }
    
    // Validate gender
    if (!genderInput.value) {
      genderError.textContent = 'Please select a gender';
      genderError.classList.remove('hidden');
      isValid = false;
    }
    
    // Validate password
    if (passwordInput.value.length < 6) {
      passwordError.textContent = 'Password must be at least 6 characters';
      passwordError.classList.remove('hidden');
      isValid = false;
    }
    
    return isValid;
  }
  
  // Submit form
  submitBtn.addEventListener('click', async function() {
    if (!validateForm()) {
      return;
    }
    
    // Create student object
    const student = {
      name: nameInput.value.trim(),
      gender: genderInput.value,
      password: passwordInput.value
    };
    
    try {
      // Show loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Adding...
      `;
      
      // Send data to API
      const response = await fetch('http://localhost:8080/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(student)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Student added successfully:', result);
      
      // Close modal
      closeModal();
      
      // Refresh the student list
      if (typeof fetchData === 'function') {
        fetchData();
      }
      
      // Show success notification
      showNotification('Student added successfully!', 'success');
      
    } catch (error) {
      console.error('Error adding student:', error);
      showNotification(`Error adding student: ${error.message}`, 'error');
    } finally {
      // Reset button state
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Add Student';
    }
  });
  
  // Show notification function
  function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-md shadow-md z-50 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white flex items-center`;
    
    // Add icon based on type
    const icon = type === 'success' 
      ? '<svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>'
      : '<svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>';
    
    notification.innerHTML = `${icon}<span>${message}</span>`;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.add('opacity-0', 'transition-opacity', 'duration-300');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
});