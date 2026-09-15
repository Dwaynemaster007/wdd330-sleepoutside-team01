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
    let cartItems = getLocalStorage("so-cart");
    if (!Array.isArray(cartItems)) {
      cartItems = [];
    }
    cartItems.push(this.product);
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
    document.querySelector("#productColorName").textContent =
      this.product.Colors?.[0]?.ColorName || "";
    document.querySelector("#productDescriptionHtmlSimple").innerHTML =
      this.product.DescriptionHtmlSimple || "";
    
    const addBtn = document.getElementById("addToCart");
    if (addBtn) {
      addBtn.dataset.id = this.product.Id;
    }
  }
}