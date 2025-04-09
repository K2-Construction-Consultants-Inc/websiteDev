// Modal Management System
const ModalSystem = {
  activeModal: null,
  modalBackdrop: null,

  init() {
    // Create backdrop element if it doesn't exist
    if (!this.modalBackdrop) {
      this.modalBackdrop = document.createElement("div");
      this.modalBackdrop.className = "modal-backdrop";
      document.body.appendChild(this.modalBackdrop);
    }

    // Add click event to backdrop
    this.modalBackdrop.addEventListener("click", (e) => {
      if (e.target === this.modalBackdrop && this.activeModal) {
        this.hideModal(this.activeModal);
      }
    });

    // Add keyboard event listener
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.activeModal) {
        this.hideModal(this.activeModal);
      }
    });

    // Initialize close buttons
    document.querySelectorAll(".modal-close").forEach((button) => {
      // Remove any existing event listeners
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);

      // Add new event listener
      newButton.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const modal = newButton.closest(".modal-overlay");
        if (modal) {
          this.hideModal(modal);
        }
      });
    });

    // Add click event to modal overlays for closing when clicking outside
    document.querySelectorAll(".modal-overlay").forEach((modal) => {
      // Remove existing event listeners
      const newModal = modal.cloneNode(true);
      modal.parentNode.replaceChild(newModal, modal);

      // Add new event listener for closing when clicking outside
      newModal.addEventListener("click", (e) => {
        // Only close if clicking directly on the overlay (not its children)
        if (e.target === newModal) {
          this.hideModal(newModal);
        }
      });

      // Prevent clicks on modal container from closing
      const container = newModal.querySelector(".modal-container");
      if (container) {
        container.addEventListener("click", (e) => {
          e.stopPropagation();
        });
      }

      // Re-add form submit handlers
      const form = newModal.querySelector("form");
      if (form) {
        const formId = form.id;
        if (formId) {
          const handlerName = `handle${
            formId.charAt(0).toUpperCase() + formId.slice(1)
          }Submit`;
          if (window[handlerName]) {
            form.onsubmit = (e) => window[handlerName](e);
          }
        }
      }
    });

    // Log initialized elements
    console.log("Modal System Initialized:", {
      backdrop: this.modalBackdrop,
      closeButtons: document.querySelectorAll(".modal-close").length,
      modals: document.querySelectorAll(".modal-overlay").length,
    });
  },

  showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) {
      console.error(`Modal with id ${modalId} not found`);
      return;
    }

    // Hide any active modal first
    if (this.activeModal) {
      this.hideModal(this.activeModal);
    }

    // Reset modal styles
    modal.style.display = "flex";
    modal.style.opacity = "0";
    modal.style.pointerEvents = "none";
    this.modalBackdrop.style.display = "block";
    this.modalBackdrop.style.opacity = "0";

    // Force a reflow to ensure the transition works
    modal.offsetHeight;
    this.modalBackdrop.offsetHeight;

    // Add show class and update styles
    requestAnimationFrame(() => {
      modal.classList.add("show");
      modal.style.opacity = "1";
      modal.style.pointerEvents = "auto";
      this.modalBackdrop.classList.add("show");
      this.modalBackdrop.style.opacity = "1";

      // Ensure modal container is visible
      const container = modal.querySelector(".modal-container");
      if (container) {
        container.style.opacity = "1";
      }

      // Log modal state for debugging
      console.log("Modal shown:", {
        id: modalId,
        display: modal.style.display,
        opacity: modal.style.opacity,
        classList: modal.classList.toString(),
        container: container
          ? {
              opacity: container.style.opacity,
            }
          : null,
      });
    });

    this.activeModal = modal;
    document.body.style.overflow = "hidden";
  },

  hideModal(modal) {
    if (!modal) return;

    // Remove show class and update styles
    modal.classList.remove("show");
    modal.style.opacity = "0";
    modal.style.pointerEvents = "none";
    this.modalBackdrop.classList.remove("show");
    this.modalBackdrop.style.opacity = "0";

    // Hide modal container
    const container = modal.querySelector(".modal-container");
    if (container) {
      container.style.opacity = "0";
    }

    // Hide elements after animation completes
    setTimeout(() => {
      modal.style.display = "none";
      this.modalBackdrop.style.display = "none";
      document.body.style.overflow = "";
    }, 300);

    this.activeModal = null;
  },
};

// Show contact form modals
function showGeneralModal() {
  ModalSystem.showModal("generalContactModal");
}

function showPlanningModal() {
  ModalSystem.showModal("planningContactForm");
}

function showProcessAnalyticsModal() {
  ModalSystem.showModal("processAnalyticsContactForm");
}

function showClaimsModal() {
  ModalSystem.showModal("claimsContactForm");
}

function showEVMSModal() {
  ModalSystem.showModal("evmsContactForm");
}

// Form handling functions
window.handleGeneralFormSubmit = function (event) {
  event.preventDefault();
  const form = event.target;
  const successMessage = document.getElementById("generalFormSuccess");

  // Here you would typically send the form data to your server
  // For now, we'll just show the success message
  successMessage.classList.add("show");
  form.reset();

  // Hide success message after 3 seconds
  setTimeout(() => {
    successMessage.classList.remove("show");
    ModalSystem.hideModal(form.closest(".modal-overlay"));
  }, 3000);

  return false;
};

window.handlePlanningFormSubmit = function (event) {
  event.preventDefault();
  const form = event.target;
  const successMessage = document.getElementById("planningFormSuccess");

  // Here you would typically send the form data to your server
  // For now, we'll just show the success message
  successMessage.classList.add("show");
  form.reset();

  // Hide success message after 3 seconds
  setTimeout(() => {
    successMessage.classList.remove("show");
    ModalSystem.hideModal(form.closest(".modal-overlay"));
  }, 3000);

  return false;
};

window.handleProcessAnalyticsFormSubmit = function (event) {
  event.preventDefault();
  const form = event.target;
  const successMessage = document.getElementById("processAnalyticsFormSuccess");

  // Here you would typically send the form data to your server
  // For now, we'll just show the success message
  successMessage.classList.add("show");
  form.reset();

  // Hide success message after 3 seconds
  setTimeout(() => {
    successMessage.classList.remove("show");
    ModalSystem.hideModal(form.closest(".modal-overlay"));
  }, 3000);

  return false;
};

window.handleClaimsFormSubmit = function (event) {
  event.preventDefault();
  const form = event.target;
  const successMessage = document.getElementById("claimsFormSuccess");

  // Here you would typically send the form data to your server
  // For now, we'll just show the success message
  successMessage.classList.add("show");
  form.reset();

  // Hide success message after 3 seconds
  setTimeout(() => {
    successMessage.classList.remove("show");
    ModalSystem.hideModal(form.closest(".modal-overlay"));
  }, 3000);

  return false;
};

window.handleEVMSFormSubmit = function (event) {
  event.preventDefault();
  const form = event.target;
  const successMessage = document.getElementById("evmsFormSuccess");

  // Here you would typically send the form data to your server
  // For now, we'll just show the success message
  successMessage.classList.add("show");
  form.reset();

  // Hide success message after 3 seconds
  setTimeout(() => {
    successMessage.classList.remove("show");
    ModalSystem.hideModal(form.closest(".modal-overlay"));
  }, 3000);

  return false;
};

// Floating Contact Button
window.toggleContactInfo = function () {
  const contactInfo = document.getElementById("contactInfo");
  contactInfo.classList.toggle("active");
};

// Close contact info when clicking outside
document.addEventListener("click", function (event) {
  const contactInfo = document.getElementById("contactInfo");
  const floatingContact = event.target.closest(".floating-contact");

  if (!floatingContact && contactInfo.classList.contains("active")) {
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
  console.log("DOM Content Loaded");
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
