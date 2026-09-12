import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="product_pages/index.html?product=${product.Id}">
      <img src="${product.Image}" alt="Image of ${product.Name}">
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
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
    // Fetch full product list array from dataSource
    const list = await this.dataSource.getData();
    // Filter down to the four target products
    const filteredList = this.filterProducts(list);
    // Render filtered product cards using template helper
    this.renderList(filteredList);
  }

  filterProducts(list) {
    const requiredIds = ["880RR", "985RF", "989CG", "880RT"];
    return list.filter((product) => requiredIds.includes(product.Id));
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}