import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

loadHeaderFooter();

const category = getParam("category") || "tents";

// Update page title dynamically
if (category) {
  const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
  const titleElement = document.querySelector(".title");
  if (titleElement) {
    titleElement.textContent = `Top Products: ${formattedCategory}`;
  }
}

const dataSource = new ProductData(category);
const listElement = document.querySelector(".product-list");
const myList = new ProductList(category, dataSource, listElement);

myList.init();