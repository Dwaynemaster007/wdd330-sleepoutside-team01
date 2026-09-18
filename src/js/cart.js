import { getLocalStorage, setLocalStorage, renderCartCount } from "./utils.mjs";

function renderCartContents() {
  // getLocalStorage always returns an array, so an empty cart is just []
  const cartItems = getLocalStorage("so-cart");
  const listElement = document.querySelector(".product-list");

  if (!listElement) return;

  if (cartItems.length === 0) {
    listElement.innerHTML = `<li class="cart-card__empty">Your cart is empty.</li>`;
  } else {
    listElement.innerHTML = cartItems.map(cartItemTemplate).join("");
    attachRemoveListeners();
    attachQuantityListeners();
  }

  renderCartTotal(cartItems);
  renderCartCount();
}

// Ticket: "Total$ in Cart" -- only show the total when the cart isn't empty
function renderCartTotal(cartItems) {
  const footerElement = document.querySelector(".cart-footer");
  const totalElement = document.querySelector(".cart-total");

  if (!footerElement || !totalElement) return;

  if (cartItems.length === 0) {
    footerElement.classList.add("hide");
    return;
  }

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.FinalPrice) * (item.Quantity || 1),
    0
  );

  totalElement.innerHTML = `Total: $${total.toFixed(2)}`;
  footerElement.classList.remove("hide");
}

function cartItemTemplate(item) {
  // Resolve image path across different API response formats
  let imgSrc =
    item.Images?.PrimaryMedium ||
    item.Images?.PrimaryLarge ||
    item.Image ||
    "/images/noun_Tent_2517.svg";

  if (!imgSrc.startsWith("/") && !imgSrc.startsWith("http")) {
    imgSrc = `/${imgSrc}`;
  }

  const quantity = item.Quantity || 1;

  return `<li class="cart-card divider">
  <span class="cart-card__remove" data-id="${item.Id}" role="button" tabindex="0" aria-label="Remove ${item.Name} from cart">&times;</span>
  <a href="../product_pages/index.html?product=${item.Id}" class="cart-card__image">
    <img src="${imgSrc}" alt="${item.Name}" />
  </a>
  <a href="../product_pages/index.html?product=${item.Id}">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors?.[0]?.ColorName || ""}</p>
  <div class="cart-card__qty-controls">
    <button type="button" class="cart-card__qty-btn" data-id="${item.Id}" data-action="decrease" aria-label="Decrease quantity of ${item.Name}">&minus;</button>
    <span class="cart-card__qty-value">${quantity}</span>
    <button type="button" class="cart-card__qty-btn" data-id="${item.Id}" data-action="increase" aria-label="Increase quantity of ${item.Name}">&plus;</button>
  </div>
  <p class="cart-card__price">$${(Number(item.FinalPrice) * quantity).toFixed(2)}</p>
</li>`;
}

function attachRemoveListeners() {
  document.querySelectorAll(".cart-card__remove").forEach((button) => {
    button.addEventListener("click", (event) => {
      removeFromCart(event.currentTarget.dataset.id);
    });
  });
}

// Ticket: "Cart quantities" -- +/- buttons on each line item
function attachQuantityListeners() {
  document.querySelectorAll(".cart-card__qty-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const { id, action } = event.currentTarget.dataset;
      updateQuantity(id, action);
    });
  });
}

function updateQuantity(productId, action) {
  const cartItems = getLocalStorage("so-cart");
  const item = cartItems.find((item) => item.Id === productId);

  if (!item) return;

  const currentQty = item.Quantity || 1;

  if (action === "increase") {
    item.Quantity = currentQty + 1;
  } else if (action === "decrease") {
    if (currentQty <= 1) {
      // Quantity can't go below 1 from the stepper -- use the remove (x) to delete the line
      return;
    }
    item.Quantity = currentQty - 1;
  }

  setLocalStorage("so-cart", cartItems);
  renderCartContents();
}

// Removes a line item entirely (the "x" button)
function removeFromCart(productId) {
  const cartItems = getLocalStorage("so-cart");
  const index = cartItems.findIndex((item) => item.Id === productId);

  if (index === -1) return;

  cartItems.splice(index, 1);
  setLocalStorage("so-cart", cartItems);
  renderCartContents();
}

renderCartContents();
