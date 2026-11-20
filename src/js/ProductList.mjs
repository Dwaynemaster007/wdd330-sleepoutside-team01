import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  const imgSrc =
    product.Images?.PrimaryMedium ||
    product.Images?.PrimaryLarge ||
    product.Image ||
    "";

  return `<li class="product-card">
    <a href="../product_pages/index.html?product=${product.Id}&category=${product.Category || ""}">
      <img src="${imgSrc}" alt="Image of ${product.Name}">
      <h3 class="card__brand">${product.Brand?.Name || ""}</h3>
      <h2 class="card__name">${product.NameWithoutBrand || product.Name}</h2>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    try {
      const list = await this.dataSource.getData(this.category);
      this.renderList(list);
    } catch {
      // The product API (a free Render service) can be asleep or unreachable
      if (this.listElement) {
        this.listElement.innerHTML =
          '<li class="product-list__error">Products couldn\'t be loaded right now. Please refresh in a minute.</li>';
      }
    }
  }

  async search(query) {
    const list = await this.dataSource.searchProducts(query);
    this.renderList(list);
    return list;
  }

  renderList(list) {
    if (!this.listElement) return;
    renderListWithTemplate(productCardTemplate, this.listElement, list, "afterbegin", true);
  }
}