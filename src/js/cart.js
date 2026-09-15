import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];

  updateCartCount(cartItems);

  if (Array.isArray(cartItems) && cartItems.length > 0) {
    const htmlItems = cartItems.map((item) => cartItemTemplate(item));
    document.querySelector(".product-list").innerHTML = htmlItems.join("");
    attachRemoveListeners();
  } else {
    document.querySelector(".product-list").innerHTML =
      "<p>Your cart is empty.</p>";
  }
}

function updateCartCount(cartItems) {
  const countElem = document.getElementById("cart-count");
  if (!countElem) return;

  const totalCount = Array.isArray(cartItems)
    ? cartItems.reduce((sum, item) => sum + (item.Quantity || 1), 0)
    : 0;

  if (totalCount > 0) {
    countElem.textContent = totalCount;
    countElem.style.display = "flex";
  } else {
    countElem.textContent = "";
    countElem.style.display = "none";
  }
}

function cartItemTemplate(item) {
  // Resolve image path across different API response formats
  let imgSrc = item.Image || item.Images?.PrimaryMedium || item.Images?.PrimaryLarge || "";
  if (imgSrc && !imgSrc.startsWith("/") && !imgSrc.startsWith("http")) {
    imgSrc = `/${imgSrc}`;
  }

  const newItem = `<li class="cart-card divider">
  <span class="cart-card__remove" data-id="${item.Id}" role="button" aria-label="Remove item">&times;</span>
  <a href="../product_pages/index.html?product=${item.Id}" class="cart-card__image">
    <img
      src="${imgSrc}"
      alt="${item.Name}"
    />
  </a>
  <a href="../product_pages/index.html?product=${item.Id}">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors?.[0]?.ColorName || ""}</p>
  <p class="cart-card__quantity">qty: ${item.Quantity || 1}</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

function attachRemoveListeners() {
  const removeButtons = document.querySelectorAll(".cart-card__remove");
  removeButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const productId = event.target.dataset.id;
      removeFromCart(productId);
    });
  });
}

function removeFromCart(productId) {
  let cartItems = getLocalStorage("so-cart") || [];

  const index = cartItems.findIndex((item) => item.Id === productId);
  if (index !== -1) {
    cartItems.splice(index, 1);
    setLocalStorage("so-cart", cartItems);
    renderCartContents();
  }
}

renderCartContents();