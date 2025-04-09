// Modal Helper Script
// This script ensures that modal functions are globally available
// and fixes issues with dynamically loaded content

(function() {
  console.log("Modal Helper Script initializing...");
  
  // List of required modal functions
  const requiredFunctions = [
    'showGeneralModal',
    'showProjectPerformanceModal',
    'showDataTransformationModal',
    'showCyberSecurityModal'
  ];
  
  // Function to check and fix window modal functions
  function ensureModalFunctions() {
    // Check if ModalSystem exists
    if (typeof ModalSystem === 'undefined') {
      console.error("ModalSystem not defined. Modal functions may not work.");
      return;
    }
    
    // Ensure ModalSystem is initialized
    if (!ModalSystem.initialized) {
      console.log("Initializing ModalSystem from helper script");
      ModalSystem.init();
    }
    
    // Fix global modal functions
    requiredFunctions.forEach(funcName => {
      if (typeof window[funcName] !== 'function') {
        console.log(`Fixing missing window.${funcName} function`);
        
        // Create the function if it doesn't exist
        window[funcName] = function() {
          console.log(`Called ${funcName} via helper`);
          const modalId = funcName.replace('show', '') + 'Modal';
          ModalSystem.showModal(modalId);
        };
      }
    });
    
    console.log("Modal helper functions are now available globally");
  }
  
  // Add a direct test function
  window.testModal = function(modalId) {
    console.log(`Testing modal ${modalId} directly`);
    if (typeof ModalSystem !== 'undefined') {
      ModalSystem.showModal(modalId);
    } else {
      console.error("ModalSystem not available for direct test");
    }
  };
  
  // Add a debug function
  window.debugModal = function(modalId) {
    console.log(`Debugging modal: ${modalId}`);
    const modal = document.getElementById(modalId);
    
    if (!modal) {
      console.error(`Modal element #${modalId} not found!`);
      return;
    }
    
    console.log(`Modal found: ${modalId}`, {
      display: getComputedStyle(modal).display,
      opacity: getComputedStyle(modal).opacity,
      visibility: getComputedStyle(modal).visibility,
      zIndex: getComputedStyle(modal).zIndex
    });
    
    const container = modal.querySelector('.modal-container');
    if (!container) {
      console.error(`Modal container inside #${modalId} not found!`);
      return;
    }
    
    console.log(`Container found inside ${modalId}`, {
      display: getComputedStyle(container).display,
      opacity: getComputedStyle(container).opacity,
      visibility: getComputedStyle(container).visibility,
      zIndex: getComputedStyle(container).zIndex,
      transform: getComputedStyle(container).transform
    });
    
    // Fix modal visibility directly
    console.log("Applying emergency fix to modal");
    
    // Backdrop fix
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.style.display = "block";
      backdrop.style.opacity = "1";
      backdrop.style.visibility = "visible";
      backdrop.style.zIndex = "9998";
      backdrop.classList.add("show");
    } else {
      console.warn("No modal backdrop found");
      
      // Create backdrop if needed
      const newBackdrop = document.createElement("div");
      newBackdrop.className = "modal-backdrop show";
      newBackdrop.style.display = "block";
      newBackdrop.style.opacity = "1";
      newBackdrop.style.visibility = "visible";
      newBackdrop.style.zIndex = "9998";
      document.body.appendChild(newBackdrop);
      console.log("Created new backdrop");
    }
    
    // Modal fix
    modal.style.display = "flex";
    modal.style.opacity = "1";
    modal.style.visibility = "visible";
    modal.style.zIndex = "9999";
    modal.style.pointerEvents = "auto";
    modal.classList.add("show");
    
    // Container fix
    container.style.display = "block";
    container.style.opacity = "1";
    container.style.visibility = "visible";
    container.style.zIndex = "10000";
    container.style.transform = "translateY(0)";
    container.style.pointerEvents = "auto";
    
    // Prevent background scrolling
    document.body.style.overflow = "hidden";
    
    return "Modal visibility fix applied";
  };
  
  // Run immediately
  ensureModalFunctions();
  
  // Also run when DOM is fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    console.log("Re-checking modal functions after DOM loaded");
    ensureModalFunctions();
    
    // Add direct onclick handlers to modal buttons
    const buttons = document.querySelectorAll('[data-modal]');
    buttons.forEach(button => {
      const modalId = button.getAttribute('data-modal');
      if (modalId) {
        console.log(`Adding direct handler for ${modalId} button`);
        button.addEventListener('click', function(e) {
          e.preventDefault();
          ModalSystem.showModal(modalId);
          return false;
        });
      }
    });
  });
})(); 