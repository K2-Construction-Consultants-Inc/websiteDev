// Load components based on data-page attribute
document.addEventListener("DOMContentLoaded", async function () {
  const page = document.body.getAttribute("data-page");
  const rootPath = document.body.getAttribute("data-root-path") || ".";

  console.log("Loader initialized for page:", page);

  try {
    // Load navigation
    const navResponse = await fetch(`${rootPath}/components/navigation.html`);
    const navHtml = await navResponse.text();
    document.getElementById("navigation").innerHTML = navHtml;

    // Load breadcrumb
    const breadcrumbResponse = await fetch(
      `${rootPath}/components/breadcrumb.html`
    );
    const breadcrumbHtml = await breadcrumbResponse.text();
    const breadcrumbContainer = document.getElementById("breadcrumb");
    if (breadcrumbContainer) {
        breadcrumbContainer.innerHTML = breadcrumbHtml;
        
        // IMPORTANT: Wait a short moment for the breadcrumb script to be executed
        // Then trigger the custom event with the page data
        setTimeout(() => {
            console.log("Loader: Triggering BreadcrumbReady event with", page, rootPath);
            const breadcrumbEvent = new CustomEvent('BreadcrumbReady', {
                detail: {
                    page: page,
                    rootPath: rootPath
                }
            });
            document.dispatchEvent(breadcrumbEvent);
        }, 200);
    } else {
         console.error('Breadcrumb container div (#breadcrumb) not found!');
    }

    // Load footer
    const footerResponse = await fetch(`${rootPath}/components/footer.html`);
    const footerHtml = await footerResponse.text();
    const footerContainer = document.getElementById("footer");
    if (footerContainer) {
         footerContainer.innerHTML = footerHtml;
    } else {
        console.error('Footer container div (#footer) not found!');
    }

    // ... rest of loader.js ...
  } catch (error) {
    console.error('Error loading components:', error);
  }
});