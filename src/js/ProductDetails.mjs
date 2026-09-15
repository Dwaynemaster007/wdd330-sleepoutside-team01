import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import { renderCartCount } from "./utils.mjs";

export function addToCart(product) {
  // Add item logic...
  renderCartCount();
}

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

    document
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
  }

  addProductToCart() {
    let cartItems = getLocalStorage("so-cart");
    if (!Array.isArray(cartItems)) {
      cartItems = [];
    }
    cartItems.push(this.product);
    setLocalStorage("so-cart", cartItems);
  }

  renderProductDetails() {
    document.querySelector("#productName").textContent = this.product.Brand.Name;
    document.querySelector("#productNameWithoutBrand").textContent =
      this.product.NameWithoutBrand;
    const imgElement = document.querySelector("#productImage");
    imgElement.src = this.product.Image;
    imgElement.alt = this.product.Name;
    imgElement.onerror = () => {
      imgElement.src =
        "../images/tents/marmot-ajax-tent-3-person-3-season-in-pale-pumpkin-terracotta~p~880rr_01~320.jpg";
    };
    document.querySelector("#productFinalPrice").textContent =
      `$${this.product.FinalPrice}`;
    document.querySelector("#productColorName").textContent =
      this.product.Colors?.[0]?.ColorName || "";
    document.querySelector("#productDescriptionHtmlSimple").innerHTML =
      this.product.DescriptionHtmlSimple;
    document.getElementById("addToCart").dataset.id = this.product.Id;
  }
}

function renderProductDetails(product, parentElement) {
  parentElement.querySelector("#productName").textContent = product.Name;
  parentElement.querySelector("#productNameWithoutBrand").textContent =
    product.NameWithoutBrand;
  parentElement.querySelector("#productImage").src =
    product.Images.PrimaryLarge;
  parentElement.querySelector("#productImage").alt = product.Name;
  parentElement.querySelector(
    "#productFinalPrice"
  ).textContent = `$${product.FinalPrice}`;
  parentElement.querySelector("#productColorName").textContent =
    product.Colors[0].ColorName;
  parentElement.querySelector("#productDescriptionHtmlSimple").innerHTML =
    product.DescriptionHtmlSimple;
  parentElement.querySelector("#addToCart").dataset.id = product.Id;
}
