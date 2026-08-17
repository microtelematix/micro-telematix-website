async function loadComponent(containerId, fileName) {
  const container = document.getElementById(containerId);

  if (!container) return;

  try {
    const response = await fetch(fileName);

    if (!response.ok) {
      throw new Error(`Could not load ${fileName}: ${response.status}`);
    }

    container.innerHTML = await response.text();
  } catch (error) {
    console.error(error);
  }
}

async function loadSiteComponents() {
  await loadComponent("site-header", "header.html");
  initializeHeaderNavigation();

  await loadComponent("site-footer", "footer.html");

  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }
}

function initializeHeaderNavigation() {
  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.querySelector(".site-nav");

  if (!menuToggle || !siteNav) return;

  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

loadSiteComponents();