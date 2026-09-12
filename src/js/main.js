import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

// Create instance of ProductData for tents
const dataSource = new ProductData("tents");

// Target the HTML element where the product list will render
const listElement = document.querySelector(".product-list");

// Create instance of ProductList and initialize it
const productList = new ProductList("tents", dataSource, listElement);
productList.init();