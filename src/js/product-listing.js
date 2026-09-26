import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

loadHeaderFooter();

const category = getParam("category") || "tents";
const searchQuery = getParam("search");

const titleElement = document.querySelector(".title");
const listElement = document.querySelector(".product-list");
const dataSource = new ExternalServices(category);
const myList = new ProductList(category, dataSource, listElement);

async function initListing() {
  if (searchQuery && searchQuery.trim() !== "") {
    if (titleElement) {
      titleElement.textContent = `Search results for "${searchQuery}"`;
    }
    const results = await myList.search(searchQuery);
    if (!results.length && listElement) {
      listElement.innerHTML =
        `<li class="product-card"><p>No products found for "${searchQuery}".</p></li>`;
    }
  } else {
    if (category && titleElement) {
      const formatted =
        category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ");
      titleElement.textContent = `Top Products: ${formatted}`;
    }
    await myList.init();
  }
}

initListing();
