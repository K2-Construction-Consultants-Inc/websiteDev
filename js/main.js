// Modal Management System
const ModalSystem = {
  activeModal: null,
  modalBackdrop: null,
  initialized: false,

  init() {
    if (this.initialized) {
      console.log("ModalSystem already initialized, skipping");
      return;
    }

    console.log("Initializing ModalSystem...");
    
    // Create backdrop element if it doesn't exist
    if (!this.modalBackdrop || !document.body.contains(this.modalBackdrop)) {
      console.log("Creating backdrop element");
      this.modalBackdrop = document.createElement("div");
      this.modalBackdrop.className = "modal-backdrop";
      document.body.appendChild(this.modalBackdrop);
    }

    // --- Event Delegation for Clicks --- 
    document.body.addEventListener("click", (e) => {
      // Check for click on backdrop itself
      if (e.target === this.modalBackdrop && this.activeModal) {
        this.hideModal(this.activeModal);
        return; // Stop further processing
      }
      
      // Check for click on overlay (but not content)
      if (e.target.classList.contains('modal-overlay') && this.activeModal) {
           this.hideModal(this.activeModal);
           return; // Stop further processing
      }
      
      // Check for click on a close button (or element inside it)
      const closeButton = e.target.closest(".modal-close");
      if (closeButton && this.activeModal) {
        e.preventDefault(); // Prevent default if it's a link/button
        this.hideModal(this.activeModal);
        return; // Stop further processing
      }
      
      // Check for click on a cancel button within form actions
      const cancelButton = e.target.closest('.form-actions .btn-secondary');
      if (cancelButton && this.activeModal) {
          // Check if the button has the specific onclick for hiding modal
          const onclickAttr = cancelButton.getAttribute('onclick');
          if (onclickAttr && onclickAttr.includes('ModalSystem.hideModal')) {
               e.preventDefault(); // Prevent default if it's a button
               this.hideModal(this.activeModal);
               return; // Stop further processing
          }
      }
    });

    // --- Keyboard Event Listener --- 
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.activeModal) {
        this.hideModal(this.activeModal);
      }
    });

    this.initialized = true;
    console.log("Modal System Initialized with Delegated Events");
  },

  showModal(modalId) {
    console.log(`Attempting to show modal: ${modalId}`);
    
    if (!this.initialized) {
      console.log("ModalSystem not initialized, initializing now...");
      this.init();
    }
    
    const modal = document.getElementById(modalId);
    if (!modal) {
      console.error(`Modal with id ${modalId} not found in the DOM`);
      console.log("Available modals:", 
        Array.from(document.querySelectorAll('.modal-overlay'))
          .map(el => `#${el.id}`)
          .join(', ') || 'None found');
      return;
    }

    // Create backdrop if it doesn't exist yet (in case init wasn't fully completed)
    if (!this.modalBackdrop || !document.body.contains(this.modalBackdrop)) {
      console.warn("Modal backdrop not found, creating it now");
      this.modalBackdrop = document.createElement("div");
      this.modalBackdrop.className = "modal-backdrop";
      document.body.appendChild(this.modalBackdrop);
    }

    // Hide any active modal first
    if (this.activeModal) {
      this.hideModal(this.activeModal);
    }

    // --- Prepare modal and backdrop for transition --- 
    // Set initial styles before adding .show class
    modal.style.display = "flex";       // Make it part of the layout
    modal.style.opacity = "1";          // Set opacity directly
    modal.style.visibility = "visible"; // Ensure visibility
    modal.style.pointerEvents = "auto"; // Enable interaction
    modal.style.zIndex = "9999";        // High z-index
    
    this.modalBackdrop.style.display = "block";
    this.modalBackdrop.style.opacity = "1";
    this.modalBackdrop.style.visibility = "visible";
    this.modalBackdrop.style.zIndex = "9998";

    // --- Force Reflow --- 
    // Ensures the browser applies the initial styles before the transition starts
    void modal.offsetWidth;
    void this.modalBackdrop.offsetWidth;

    // Delay adding show class slightly to ensure CSS is ready for transition
    this.activeModal = modal;
    document.body.style.overflow = "hidden"; // Prevent background scrolling
    
    // Also directly set styles on the modal container
    const container = modal.querySelector('.modal-container');
    if (container) {
      container.style.opacity = "1";
      container.style.visibility = "visible";
      container.style.transform = "translateY(0)";
      container.style.zIndex = "10000";
    }
    
    // Use a small timeout to ensure CSS is fully applied before starting transition
    setTimeout(() => {
      // --- Trigger Transition by adding .show class --- 
      modal.classList.add("show");
      this.modalBackdrop.classList.add("show");
      console.log(`Modal ${modalId} show transition started`);
    }, 10);

    console.log(`Modal ${modalId} show triggered.`);
  },

  hideModal(modal) {
    if (!modal || !modal.classList.contains('show')) return; // Don't hide if already hidden

    console.log(`Hiding modal: ${modal.id}`);
    
    // Make sure modalBackdrop exists
    if (this.modalBackdrop) {
      this.modalBackdrop.classList.remove("show");
    } else {
      console.warn("Modal backdrop not found when hiding modal");
    }
    
    // Remove show class and update styles for fade-out
    modal.classList.remove("show");

    // NOTE: We rely on the CSS rules for the removal of .show 
    // to transition opacity back to 0 and transform back.
    // JS handles setting display:none after transition.
    modal.style.pointerEvents = "none"; // Disable pointer events immediately

    // Use transitionend event for hiding instead of fixed timeout for reliability
    const onTransitionEnd = (event) => {
        // Ensure we're reacting to the overlay's transition and it's hidden
        // We check opacity via computedStyle as inline style might be transitioning
        if (event.target === modal && window.getComputedStyle(modal).opacity === '0') { 
            console.log(`Transition ended for ${modal.id}`);
            modal.style.display = "none";
            // Only hide backdrop when the *last* modal is fully hidden
            if (this.activeModal === modal) { 
                if (this.modalBackdrop) {
                  this.modalBackdrop.style.display = "none";
                }
                document.body.style.overflow = ""; // Restore background scrolling
                this.activeModal = null;
                console.log(`Modal ${modal.id} fully hidden and activeModal reset.`);
            } else {
                // This case should ideally not happen if hideModal is called correctly
                console.log(`Modal ${modal.id} fully hidden, but it wasn't the active one. Clearing activeModal anyway.`);
                // If we are hiding a modal that isn't the active one (rare), 
                // still clear activeModal if it matches the one being hidden.
                if (this.activeModal === modal) { 
                    this.activeModal = null;
                    document.body.style.overflow = ""; 
                }
                // If another modal became active in the meantime, don't hide the backdrop.
                if (!this.activeModal && this.modalBackdrop) {
                    this.modalBackdrop.style.display = "none";
                }
            }
            modal.removeEventListener('transitionend', onTransitionEnd);
        }
    };
    // Listen specifically for the opacity transition
    modal.addEventListener('transitionend', onTransitionEnd);

    // Fallback timeout remains a good safety measure - increased to 500ms for reliability
    setTimeout(() => {
        // Check if display is still not 'none' (transitionend might not have fired)
        if (modal.style.display !== 'none') { 
            console.log(`Transitionend fallback triggered for ${modal.id} (this is normal in some browsers)`);
            modal.style.display = 'none';
            // Perform cleanup similar to transitionend handler
            if (this.activeModal === modal) {
                if (this.modalBackdrop) {
                  this.modalBackdrop.style.display = 'none';
                }
                document.body.style.overflow = '';
                this.activeModal = null;
            } else if (!this.activeModal && this.modalBackdrop) {
                this.modalBackdrop.style.display = 'none'; // Hide backdrop if no other modal is active
            }
            modal.removeEventListener('transitionend', onTransitionEnd);
        }
    }, 500); // Increased timeout for reliability
  },
};

// Show contact form modals
function showGeneralModal() {
  console.log("showGeneralModal called");
  ModalSystem.showModal("generalContactModal");
}

function showProjectPerformanceModal() {
  console.log("showProjectPerformanceModal called");
  ModalSystem.showModal("projectPerformanceContactModal");
}

function showDataTransformationModal() {
  console.log("showDataTransformationModal called");
  ModalSystem.showModal("dataTransformationContactModal");
}

function showCyberSecurityModal() {
  console.log("showCyberSecurityModal called");
  ModalSystem.showModal("cyberSecurityContactModal");
}

// Explicitly attach modal functions to window object to ensure they're globally available
window.showGeneralModal = showGeneralModal;
window.showProjectPerformanceModal = showProjectPerformanceModal;
window.showDataTransformationModal = showDataTransformationModal;
window.showCyberSecurityModal = showCyberSecurityModal;

// Form handling functions
window.handleGeneralFormSubmit = function (event) {
  event.preventDefault();
  const form = event.target;
  const successMessage = document.getElementById("generalFormSuccess");

  // Here you would typically send the form data to your server
  // For now, we'll just show the success message
  if (successMessage) {
    successMessage.classList.add("show");
  }
  form.reset();

  // Hide success message after 3 seconds
  setTimeout(() => {
    if (successMessage) {
      successMessage.classList.remove("show");
    }
    ModalSystem.hideModal(form.closest(".modal-overlay"));
  }, 3000);

  return false;
};

window.handleProjectPerformanceFormSubmit = function (event) {
  event.preventDefault();
  const form = event.target;
  const successMessage = document.getElementById("projectPerformanceFormSuccess");

  // Here you would typically send the form data to your server
  // For now, we'll just show the success message
  if (successMessage) {
    successMessage.classList.add("show");
  }
  form.reset();

  // Hide success message after 3 seconds
  setTimeout(() => {
    if (successMessage) {
      successMessage.classList.remove("show");
    }
    ModalSystem.hideModal(form.closest(".modal-overlay"));
  }, 3000);

  return false;
};

window.handleDataTransformationFormSubmit = function (event) {
  event.preventDefault();
  const form = event.target;
  const successMessage = document.getElementById("dataTransformationFormSuccess");

  // Here you would typically send the form data to your server
  // For now, we'll just show the success message
  if (successMessage) {
    successMessage.classList.add("show");
  }
  form.reset();

  // Hide success message after 3 seconds
  setTimeout(() => {
    if (successMessage) {
      successMessage.classList.remove("show");
    }
    ModalSystem.hideModal(form.closest(".modal-overlay"));
  }, 3000);

  return false;
};

window.handleCyberSecurityFormSubmit = function (event) {
  event.preventDefault();
  const form = event.target;
  const successMessage = document.getElementById("cyberSecurityFormSuccess");

  // Here you would typically send the form data to your server
  // For now, we'll just show the success message
  if (successMessage) {
    successMessage.classList.add("show");
  }
  form.reset();

  // Hide success message after 3 seconds
  setTimeout(() => {
    if (successMessage) {
      successMessage.classList.remove("show");
    }
    ModalSystem.hideModal(form.closest(".modal-overlay"));
  }, 3000);

  return false;
};

// Floating Contact Button
window.toggleContactInfo = function () {
  const contactInfo = document.getElementById("contactInfo");
  if (contactInfo) {
    contactInfo.classList.toggle("active");
  } else {
    console.warn("Contact info element not found");
  }
};

// Close contact info when clicking outside
document.addEventListener("click", function (event) {
  const contactInfo = document.getElementById("contactInfo");
  const floatingContact = event.target.closest(".floating-contact");

  // Only proceed if contactInfo exists
  if (contactInfo && !floatingContact && contactInfo.classList.contains("active")) {
    contactInfo.classList.remove("active");
  }
});

// Function to initialize carousels
window.initializeCarousel = function(carouselElement = null) {
  console.log('Initializing Carousel(s)... Target:', carouselElement || 'All');
  const carousels = carouselElement ? [carouselElement] : document.querySelectorAll(".carousel");
  
  if (carousels.length === 0) {
      console.warn("No carousel elements found to initialize.");
      return; // Exit if no carousels found
  }

  carousels.forEach((carousel) => {
    const items = carousel.querySelector(".carousel-items");
    const dotsContainer = carousel.querySelector(".carousel-dots");

    if (!items || !dotsContainer) {
      console.warn("Carousel missing .carousel-items or .carousel-dots", carousel);
      return; // Skip this carousel if elements are missing
    }

    // Ensure proper carousel item sizing
    // Force each carousel item to be exactly the width of the carousel
    const carouselItems = items.querySelectorAll('.carousel-item');
    carouselItems.forEach((item, index) => {
      item.style.width = '100%';
      item.style.minWidth = '100%';
      item.style.flex = '0 0 100%';
      // Ensure only the first item is active initially
      item.classList.toggle('active', index === 0);
    });

    // Ensure items container has initial styles for translateX
    items.style.transform = 'translateX(0%)'; 
    items.style.width = '100%';

    // Use let for slides/dots as they might be regenerated
    let slides = Array.from(items.children);
    let currentIndex = 0;
    let intervalId;

    // Only create/recreate dots if initializing a specific element OR if they are missing
    if (carouselElement || dotsContainer.children.length === 0) {
        dotsContainer.innerHTML = ''; // Clear dots
        slides.forEach((_, index) => {
          const dot = document.createElement("span");
          dot.classList.add("carousel-dot");
          // Mark first dot as active during creation
          if (index === 0) dot.classList.add("active"); 
          dot.dataset.index = index;
          dotsContainer.appendChild(dot);
        });
    }
    
    // Always re-select dots after potential creation
    let dots = Array.from(dotsContainer.children);

    // Ensure the first slide is active, remove active from others
    slides.forEach((slide, index) => slide.classList.toggle('active', index === 0));
    // Ensure dots array matches slides count before activating first dot
    if (dots.length === slides.length) {
         dots.forEach((dot, index) => dot.classList.toggle('active', index === 0));
    } else {
         console.warn('Mismatch between slide count and dot count.', carousel);
         // Potentially clear dots again if mismatch is critical
         // dotsContainer.innerHTML = ''; 
         // dots = [];
    }
    

    function updateSlidePositions() {
       // Check if items exist before transforming
       if (items) { 
           // Ensure proper width calculations
           const slideWidth = 100;
           items.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
       }
    }

    function showSlide(index) {
      // Refresh slides and dots references inside showSlide
      slides = Array.from(items.children); 
      dots = Array.from(dotsContainer.children); 
      
      // Bounds check
      if (index < 0 || index >= slides.length || slides.length === 0) {
          console.warn(`showSlide: Invalid index ${index} or no slides.`);
          return;
      }

      // --- Added Robust Checks --- 
      // Check current index validity before removing classes
      if (currentIndex >= 0 && currentIndex < slides.length) {
          if (slides[currentIndex]) slides[currentIndex].classList.remove("active");
          // Check dots array length matches slides before accessing dot
          if (dots.length === slides.length && dots[currentIndex]) {
              dots[currentIndex].classList.remove("active");
          }
      } else {
           console.warn(`showSlide: Invalid previous currentIndex ${currentIndex}`);
      }

      currentIndex = index; // Update current index

      // Check new index validity before adding classes
       if (slides[currentIndex]) slides[currentIndex].classList.add("active");
       // Check dots array length matches slides before accessing dot
       if (dots.length === slides.length && dots[currentIndex]) {
            dots[currentIndex].classList.add("active");
       }
       // --- End Robust Checks ---

      updateSlidePositions();
      resetInterval();
    }

    function goToSlide(index) {
      showSlide(index);
    }

    function nextSlide() {
      const nextIndex = (currentIndex + 1) % slides.length;
      showSlide(nextIndex);
    }

    function previousSlide() {
      const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
      showSlide(prevIndex);
    }

    function startInterval() {
      clearInterval(intervalId);
      intervalId = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    function resetInterval() {
      startInterval();
    }

    // Event listeners for dots
    dots.forEach((dot) => {
      // Use a more robust way to handle potential stale listeners
      const newDot = dot.cloneNode(true);
      dot.parentNode.replaceChild(newDot, dot);
      newDot.addEventListener("click", () => {
        // Re-fetch dots inside listener to ensure we have the latest references
        const currentDots = Array.from(dotsContainer.children);
        const clickedDotIndex = currentDots.indexOf(newDot);
        if (clickedDotIndex !== -1) {
             goToSlide(clickedDotIndex);
        }
      });
    });

    // Optional: Add event listeners for next/prev buttons if they exist
    const nextButton = carousel.querySelector(".carousel-next");
    const prevButton = carousel.querySelector(".carousel-prev");

    if (nextButton) {
      const newNextButton = nextButton.cloneNode(true);
      nextButton.parentNode.replaceChild(newNextButton, nextButton);
      newNextButton.addEventListener("click", nextSlide);
    }

    if (prevButton) {
       const newPrevButton = prevButton.cloneNode(true);
      prevButton.parentNode.replaceChild(newPrevButton, prevButton);
      newPrevButton.addEventListener("click", previousSlide);
    }

    // Initialize
    if (slides.length > 0) {
        updateSlidePositions(); // Set initial position
        startInterval();
    }
  });
};

// Animate metric numbers
function animateMetricNumbers() {
  const metrics = document.querySelectorAll(".metric-number");

  metrics.forEach((metric) => {
    const targetValue = parseInt(metric.getAttribute("data-value"));
    const duration = 2000; // Animation duration in milliseconds
    const startTime = performance.now();
    const startValue = 0;
    const suffix = metric.textContent.replace(/[0-9]/g, ""); // Get the suffix (+ or %)

    function updateNumber(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuad = (t) => t * (2 - t);
      const easedProgress = easeOutQuad(progress);

      const currentValue = Math.floor(
        startValue + (targetValue - startValue) * easedProgress
      );
      metric.textContent = currentValue.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      }
    }

    requestAnimationFrame(updateNumber);
  });
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Content Loaded, initializing ModalSystem...");
  ModalSystem.init();
  initializeCarousel();
  animateMetricNumbers();
});

// Helper function to manually update breadcrumb if needed
window.updatePageBreadcrumb = function() {
  const page = document.body.getAttribute("data-page");
  const rootPath = document.body.getAttribute("data-root-path") || ".";
  
  console.log("Manual breadcrumb update requested for:", page);
  
  // First try direct function call if component is loaded
  if (typeof window.updateBreadcrumb === 'function') {
    window.updateBreadcrumb(page, rootPath);
    return true;
  }
  
  // Otherwise dispatch event
  const breadcrumbEvent = new CustomEvent('BreadcrumbReady', {
    detail: {
      page: page,
      rootPath: rootPath
    }
  });
  document.dispatchEvent(breadcrumbEvent);
  return true;
};
