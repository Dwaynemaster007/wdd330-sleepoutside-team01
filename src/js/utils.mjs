// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// retrieve data from localstorage safely
export function getLocalStorage(key) {
  const data = localStorage.getItem(key);
  try {
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
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
export function renderWithTemplate(template, parentElement, data, callback) {
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

// Count total items in cart localStorage
export function getCartCount() {
  const cartItems = getLocalStorage("so-cart");
  if (!Array.isArray(cartItems)) return 0;
  return cartItems.reduce((total, item) => total + (item.Quantity || 1), 0);
}

// Render cart badge number
export function renderCartCount() {
  const countElement = document.querySelector("#cart-count");
  if (countElement) {
    const count = getCartCount();
    countElement.textContent = count;
    if (count > 0) {
      countElement.classList.remove("hide");
    } else {
      countElement.classList.add("hide");
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