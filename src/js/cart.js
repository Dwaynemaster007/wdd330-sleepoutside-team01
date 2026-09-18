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
  }

  renderCartTotal(cartItems);
  renderCartCount();
}

function renderCartTotal(cartItems) {
  const totalElement = document.querySelector("#cartTotal");
  const footerElement = document.querySelector(".cart-footer");

  if (!totalElement) return;

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.FinalPrice) * (item.Quantity || 1),
    0
  );

  totalElement.textContent = `$${total.toFixed(2)}`;

  // Hide the total row entirely when there is nothing in the cart
  if (footerElement) {
    footerElement.classList.toggle("hide", cartItems.length === 0);
  }
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
  <p class="cart-card__quantity">qty: ${quantity}</p>
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

// Removes one unit. If that was the last one, drop the line item entirely.
function removeFromCart(productId) {
  const cartItems = getLocalStorage("so-cart");
  const index = cartItems.findIndex((item) => item.Id === productId);

  if (index === -1) return;

  const item = cartItems[index];

  if ((item.Quantity || 1) > 1) {
    item.Quantity -= 1;
  } else {
    cartItems.splice(index, 1);
  }

  setLocalStorage("so-cart", cartItems);
  renderCartContents();
}

renderCartContents();