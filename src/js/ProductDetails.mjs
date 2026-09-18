import { getLocalStorage, setLocalStorage, renderCartCount } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    if (!this.product) return;

    this.renderProductDetails();

    const addBtn = document.getElementById("addToCart");
    if (addBtn) {
      addBtn.addEventListener("click", this.addProductToCart.bind(this));
    }
  }

  addProductToCart() {
    const cartItems = getLocalStorage("so-cart");

    // If this product is already in the cart, bump its quantity
    // instead of adding a second copy of the same item.
    const existingItem = cartItems.find((item) => item.Id === this.product.Id);

    if (existingItem) {
      existingItem.Quantity = (existingItem.Quantity || 1) + 1;
    } else {
      cartItems.push({ ...this.product, Quantity: 1 });
    }

    setLocalStorage("so-cart", cartItems);
    renderCartCount();
  }

  renderProductDetails() {
    document.querySelector("#productName").textContent = this.product.Brand?.Name || "";
    document.querySelector("#productNameWithoutBrand").textContent =
      this.product.NameWithoutBrand || this.product.Name;

    const imgElement = document.querySelector("#productImage");
    const imgSrc =
      this.product.Images?.PrimaryLarge ||
      this.product.Images?.PrimaryMedium ||
      this.product.Image ||
      "";

    imgElement.src = imgSrc;
    imgElement.alt = this.product.Name;

    document.querySelector("#productFinalPrice").textContent =
      `$${this.product.FinalPrice}`;
    this.renderProductDiscount();
    document.querySelector("#productColorName").textContent =
      this.product.Colors?.[0]?.ColorName || "";
    document.querySelector("#productDescriptionHtmlSimple").innerHTML =
      this.product.DescriptionHtmlSimple || "";
    
    const addBtn = document.getElementById("addToCart");
    if (addBtn) {
      addBtn.dataset.id = this.product.Id;
    }
  }

  // Ticket: "Add discount to product detail pages"
  // Compares MSRP (SuggestedRetailPrice) to what the customer actually pays
  // (FinalPrice) and shows a badge only when there is a real discount.
  renderProductDiscount() {
    const discountElement = document.querySelector("#productDiscount");
    if (!discountElement) return;

    const msrp = Number(this.product.SuggestedRetailPrice);
    const finalPrice = Number(this.product.FinalPrice);

    if (!msrp || !finalPrice || msrp <= finalPrice) {
      discountElement.textContent = "";
      discountElement.classList.add("hide");
      return;
    }

    const percentOff = Math.round(((msrp - finalPrice) / msrp) * 100);
    const amountOff = (msrp - finalPrice).toFixed(2);

    discountElement.textContent = `Save ${percentOff}% ($${amountOff} off)`;
    discountElement.classList.remove("hide");
  }
}