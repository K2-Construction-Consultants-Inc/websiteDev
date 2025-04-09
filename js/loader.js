// Load components based on data-page attribute
document.addEventListener("DOMContentLoaded", async function () {
  const page = document.body.getAttribute("data-page");
  const rootPath = document.body.getAttribute("data-root-path") || ".";

  console.log("Loader initialized for page:", page);

  // Function to load component HTML
  async function loadComponent(componentPath, targetElementId) {
    try {
      const response = await fetch(`${rootPath}/${componentPath}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${componentPath}: ${response.statusText}`);
      }
      const html = await response.text();
      const container = document.getElementById(targetElementId);
      if (container) {
        container.innerHTML = html;
      } else {
        // Don't log an error if the element simply doesn't exist on the page
        // console.log(`Container element #${targetElementId} not found on this page.`); 
      }
    } catch (error) {
      console.error(`Error loading component ${componentPath}:`, error);
    }
  }

  // --- Load Core Components --- 
  await loadComponent("components/navigation.html", "navigation");
  await loadComponent("components/breadcrumb.html", "breadcrumb");
  await loadComponent("components/footer.html", "footer");
  await loadComponent("components/floating-contact.html", "floatingContact");

  // --- Load Contact Form Modals (only if the placeholder div exists) --- 
  await loadComponent("components/contact-forms/general-form.html", "generalContactModal");
  await loadComponent("components/contact-forms/project-performance-form.html", "projectPerformanceContactModal");
  await loadComponent("components/contact-forms/data-transformation-form.html", "dataTransformationContactModal");
  await loadComponent("components/contact-forms/cyber-security-form.html", "cyberSecurityContactModal");

  // After loading modals, make sure all containers have the right styles
  console.log("Setting direct styles on modal containers");
  document.querySelectorAll('.modal-container').forEach(container => {
    // Make container ready for proper display
    container.style.display = "block";  
    container.style.visibility = "visible";
    container.style.opacity = "1";
    container.style.zIndex = "10000";
    container.style.transform = "translateY(0)";
  });

  // Ensure ModalSystem is initialized after all components are loaded
  if (typeof ModalSystem !== 'undefined' && ModalSystem.init) {
    console.log("Re-initializing ModalSystem after loading components");
    ModalSystem.init();
  } else {
    console.warn("ModalSystem not available when components loaded");
  }

  // --- Trigger Breadcrumb Update After Core Components --- 
  // Wait a short moment for the breadcrumb script to potentially be executed 
  // from within its loaded HTML before triggering the update.
  setTimeout(() => {
      const breadcrumbContainer = document.getElementById("breadcrumb");
      if (breadcrumbContainer) {
          console.log("Loader: Triggering BreadcrumbReady event with", page, rootPath);
          const breadcrumbEvent = new CustomEvent('BreadcrumbReady', {
              detail: {
                  page: page,
                  rootPath: rootPath
              }
          });
          document.dispatchEvent(breadcrumbEvent);
      } else {
           console.warn('Breadcrumb container div (#breadcrumb) not found, cannot trigger update.');
      }
  }, 100); // Reduced timeout slightly

  console.log("Loader finished.");
});