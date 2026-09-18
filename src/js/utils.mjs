// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// Retrieve data from localStorage safely.
// Always returns an array so callers can map/reduce without null checks.
// localStorage.getItem returns null for a missing key, and JSON.parse(null)
// returns null -- calling .map() on that is what crashed the empty cart page.
export function getLocalStorage(key) {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    return Array.isArray(data) ? data : [];
  } catch {
    // Malformed JSON left over from an older version of the app
    return [];
  }
}

// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// set a listener for both touchend and click
export function setClick(selector, callback) {
  const elem = qs(selector);
  if (!elem) return;
  elem.addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  elem.addEventListener("click", callback);
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false
) {
  if (clear) {
    parentElement.innerHTML = "";
  }
  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

// Render template HTML into a parent element
export function renderWithTemplate(template, parentElement, callback, data) {
  if (parentElement) {
    parentElement.innerHTML = template;
    if (callback) {
      callback(data);
    }
  }
}

// Fetch HTML template string from a partial file path
export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

// Count total items in cart localStorage (respects per-item Quantity)
export function getCartCount() {
  const cartItems = getLocalStorage("so-cart");
  return cartItems.reduce((total, item) => total + (item.Quantity || 1), 0);
}

// Render cart badge number
export function renderCartCount() {
  const countElement = document.querySelector("#cart-count");
  if (countElement) {
    const count = getCartCount();
    if (count > 0) {
      countElement.textContent = count;
      countElement.classList.remove("hide");
      countElement.style.display = "flex";
    } else {
      countElement.textContent = "";
      countElement.classList.add("hide");
      countElement.style.display = "none";
    }
  }
}

// Fetch and render header & footer into current page
export async function loadHeaderFooter() {
  try {
    const headerTemplate = await loadTemplate("../partials/header.html");
    const footerTemplate = await loadTemplate("../partials/footer.html");

    const headerElement = document.querySelector("#main-header");
    const footerElement = document.querySelector("#main-footer");

    renderWithTemplate(headerTemplate, headerElement);
    renderWithTemplate(footerTemplate, footerElement);

    renderCartCount();
  } catch (error) {
    console.error("Failed to load header/footer templates:", error);
  }
}