const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");

menuButton.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

const contactForm = document.querySelector(".contact-form");

if (contactForm) {
  const messages = {
    Name: "Please enter your name.",
    Phone: "Please enter your phone number.",
    Email: "Please enter a valid email address.",
    Subject: "Please select a subject.",
    "Business Name": "Please enter your business name.",
    "Place of Business": "Please enter your place of business.",
    Message: "Please enter your message."
  };

  const subjectField = contactForm.querySelector('select[name="Subject"]');
  const dealerFields = contactForm.querySelector(".dealer-extra-fields");
  const dealerInputs = dealerFields ? Array.from(dealerFields.querySelectorAll("input")) : [];

  const updateDealerFields = () => {
    const showDealerFields = subjectField && subjectField.value === "dealer-enquiry";

    if (dealerFields) {
      dealerFields.hidden = !showDealerFields;
    }

    dealerInputs.forEach((field) => {
      field.required = showDealerFields;

      if (!showDealerFields) {
        field.value = "";
        field.classList.remove("invalid");
        field.removeAttribute("aria-invalid");
        const error = getErrorElement(field);
        if (error) {
          error.textContent = "";
        }
      }
    });
  };

  const getErrorElement = (field) => {
    const describedBy = field.getAttribute("aria-describedby");
    return describedBy ? document.getElementById(describedBy) : null;
  };

  const validateField = (field) => {
    const value = field.value.trim();
    let isValid = true;

    if (!field.required && !value) {
      isValid = true;
    } else if (!value) {
      isValid = false;
    } else if (field.type === "email" && !field.checkValidity()) {
      isValid = false;
    }

    field.classList.toggle("invalid", !isValid);
    field.setAttribute("aria-invalid", String(!isValid));

    const error = getErrorElement(field);
    if (error) {
      error.textContent = isValid ? "" : messages[field.name];
    }

    return isValid;
  };

  contactForm.addEventListener("submit", (event) => {
    const fields = Array.from(contactForm.querySelectorAll("input, select, textarea"));
    const validationResults = fields.map(validateField);
    const isValid = validationResults.every(Boolean);

    if (!isValid) {
      event.preventDefault();
      const firstInvalid = contactForm.querySelector(".invalid");
      if (firstInvalid) {
        firstInvalid.focus();
      }
    }
  });

  contactForm.querySelectorAll("input, select, textarea").forEach((field) => {
    field.addEventListener("input", () => validateField(field));
    field.addEventListener("change", () => validateField(field));
  });

  if (subjectField) {
    subjectField.addEventListener("change", updateDealerFields);
    updateDealerFields();
  }
}

document.querySelectorAll("[data-tabs]").forEach((tabs) => {
  const tabButtons = Array.from(tabs.querySelectorAll('[role="tab"]'));
  const tabPanels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));

  const activateTab = (tab, moveFocus = true) => {
    const targetPanelId = tab.getAttribute("aria-controls");

    tabButtons.forEach((button) => {
      const isActive = button === tab;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", String(isActive));
      button.tabIndex = isActive ? 0 : -1;
    });

    tabPanels.forEach((panel) => {
      const isActive = panel.id === targetPanelId;
      panel.classList.toggle("is-active", isActive);
      panel.hidden = !isActive;
    });

    if (moveFocus) {
      tab.focus();
    }
  };

  tabButtons.forEach((tab, index) => {
    tab.addEventListener("click", () => activateTab(tab, false));

    tab.addEventListener("keydown", (event) => {
      const lastIndex = tabButtons.length - 1;
      let nextIndex = index;

      if (event.key === "ArrowRight") {
        nextIndex = index === lastIndex ? 0 : index + 1;
      } else if (event.key === "ArrowLeft") {
        nextIndex = index === 0 ? lastIndex : index - 1;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = lastIndex;
      } else {
        return;
      }

      event.preventDefault();
      activateTab(tabButtons[nextIndex]);
    });
  });
});

const circleCheckIcon = `
  <svg class="lucide-icon" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="m9 12 2 2 4-4"></path>
  </svg>
`;

const buildCheckList = (items) => {
  const list = document.createElement("ul");
  list.className = "borewell-check-list";
  
  items.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `${circleCheckIcon}<span>${item}</span>`;
    list.appendChild(listItem);
  });

  return list;
};

const buildBorewellCheckList = (items) => {
  const list = document.createElement("ul");
  list.className = "borewell-check-list-column";

  items.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `${circleCheckIcon}<span>${item}</span>`;
    list.appendChild(listItem);
  });

  return list;
};

const renderCheckGroup = (selector, items) => {
  const container = document.querySelector(selector);
  
  if (!container) {
    return;
  }

  container.innerHTML = "";
  container.appendChild(buildCheckList(items));
};

const renderTwoColumnCheckGroup = (selector, items, firstColumnCount) => {
  const container = document.querySelector(selector);

  if (!container) {
    return;
  }

  const leftItems = items.slice(0, firstColumnCount);
  const rightItems = items.slice(firstColumnCount);

  container.innerHTML = "";
  container.appendChild(buildBorewellCheckList(leftItems));
  container.appendChild(buildBorewellCheckList(rightItems));
};

renderCheckGroup("[data-single-tank-features]", [
  "Five-level LED indication (Empty · 1/4 · Half · 3/4 · Full)Manual pump start",
  "Audible overflow alarm",
  "Easy installation",
  "Saves water and electricity"
]);

renderTwoColumnCheckGroup("[data-full-auto-borewell-features]", [
  "Automatic borewell motor ON/OFF",
  "Overflow prevention",
  "Auto/Manual modes",
  "Motor current & voltage indication",
  "Overload protection",
  "Dry-run protection",
  "Compatible with single & three-phase motors"
], 4);

renderTwoColumnCheckGroup("[data-full-auto-borewell-benefits]", [
  "Continuous 24×7 water availability",
  "Reduced operator involvement",
  "Helps prevent dry-run pump damage",
  "Prevent property damage due to overflow",
  "Reliable safe operation",
  "1 Year Warranty"
], 3);

renderTwoColumnCheckGroup("[data-full-auto-features]", [
  "Fully automatic operation",
  "Overflow prevention",
  "No operator required",
  "Supports overhead, supply-line & underground tanks",
  "Optional manual operation",
  "Dry-run protection",
  "Compatible with single-phase, three-phase, monoblock & open submersible pumps",
  "Supports 0.5–10 HP single-phase & three-phase motors"
], 4);

renderTwoColumnCheckGroup("[data-full-auto-benefits]", [
  "Eliminates manual monitoring & ON/OFF operation",
  "Saves water & electricity",
  "Extends pump life",
  "Reliable 24×7 operation",
  "1 Year Warranty"
], 3);

renderTwoColumnCheckGroup("[data-semi-auto-features]", [
  "Manual pump start",
  "Automatic pump stop when tank is full",
], 4);

renderTwoColumnCheckGroup("[data-semi-auto-benefits]", [
  "Eliminates manual monitoring and OFF operation",
  "Saves water & electricity",
  "Helps prevent dry-run pump damage",
  "Prevent property damage due to overflow",
  "1 Year Warranty"
], 3);
